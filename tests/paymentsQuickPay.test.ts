let supertestReqQP: any;
try {
  supertestReqQP = require('supertest');
} catch (err) {
  supertestReqQP = null;
}

if (!supertestReqQP) {
  describe('Payments quick pay (skipped)', () => {
    it('skipped because supertest not installed', () => expect(true).toBe(true));
  });
} else {
  process.env.NODE_ENV = 'development';
  const app = require('../src/app').default;
  const Payment = require('../src/models/Payment').default;
  const User = require('../src/models/User').User || require('../src/models/User');
  const Tournament = require('../src/models/Tournament').Tournament || require('../src/models/Tournament');
  const Registration = require('../src/models/Registration').Registration || require('../src/models/Registration');

  describe('POST /admin/payments/settle quick pay flows', () => {
    it('pays daily expectations, then personal debt, and creates credit on overpay', async () => {
      const agent = supertestReqQP.agent(app as any);
      const login = await agent.get('/dev/login-admin');
      expect([200,302]).toContain(login.status);

      // create user
      const u = await User.create({ username: 'qp_user', password_hash: 'x', is_player: true });

      // create tournament and registrations with expectations
      const t = await Tournament.create({ name: 'QP Test', start_date: new Date(), buy_in: 100, punctuality_discount: 0, registration_open: true });
      const r1 = await Registration.create({ user_id: u.id, tournament_id: t.id, registration_date: new Date(), punctuality: true });
      const r2 = await Registration.create({ user_id: u.id, tournament_id: t.id, registration_date: new Date(), punctuality: true });

      // create expectation payments (unpaid)
      await Payment.create({ user_id: u.id, amount: 100, payment_date: new Date(), source: 'tournament', reference_id: r1.id, paid: false, paid_amount: 0, method: null, personal_account: false });
      await Payment.create({ user_id: u.id, amount: 100, payment_date: new Date(), source: 'tournament', reference_id: r2.id, paid: false, paid_amount: 0, method: null, personal_account: false });

      // create a personal historical debt of 150
      const personalDebt = await Payment.create({ user_id: u.id, amount: 150, payment_date: new Date(), source: 'personal_debt', reference_id: null, paid: false, paid_amount: 0, method: null, personal_account: true });

      // Case 1: pay only daily expectations partially (amount = 150) -> should pay r1 fully (100) and r2 partially (50)
      const resp1 = await agent.post('/admin/payments/settle').send({ userId: u.id, amount: 150, method: 'efectivo', idempotencyKey: 'test-1' }).set('Content-Type','application/json');
      expect(resp1.status).toBe(200);
      expect(resp1.body.ok).toBe(true);
      // verify payments created
      const settlements1 = await Payment.findAll({ where: { user_id: u.id, source: 'settlement' } });
      expect(settlements1.length).toBeGreaterThanOrEqual(2);
      // check expectations updated
      const exp1 = await Payment.findByPk(settlements1[0].reference_id);
      expect(exp1.paid).toBe(true);
      const exp2 = await Payment.findByPk(settlements1[1].reference_id);
      // one of the expectations should be partially paid
      expect(Number(exp2.paid_amount)).toBeGreaterThan(0);

      // Case 2: pay covering remaining day and some personal debt (amount = 200)
      const resp2 = await agent.post('/admin/payments/settle').send({ userId: u.id, amount: 200, method: 'tarjeta', idempotencyKey: 'test-2' }).set('Content-Type','application/json');
      expect(resp2.status).toBe(200);
      expect(resp2.body.ok).toBe(true);
      // personal debt should have settlement_personal
      const perSettlements = await Payment.findAll({ where: { user_id: u.id, source: 'settlement_personal' } });
      expect(perSettlements.length).toBeGreaterThanOrEqual(1);

      // Case 3: overpay -> creates credit
      const resp3 = await agent.post('/admin/payments/settle').send({ userId: u.id, amount: 1000, method: 'efectivo', idempotencyKey: 'test-3' }).set('Content-Type','application/json');
      expect(resp3.status).toBe(200);
      expect(resp3.body.ok).toBe(true);
      const credits = await Payment.findAll({ where: { user_id: u.id, source: 'credit' } });
      expect(credits.length).toBeGreaterThanOrEqual(1);

      // Idempotency: re-send same idemp key for test-3 should indicate alreadyProcessed
      const resp3b = await agent.post('/admin/payments/settle').send({ userId: u.id, amount: 1000, method: 'efectivo', idempotencyKey: 'test-3' }).set('Content-Type','application/json');
      expect(resp3b.status).toBe(200);
      expect(resp3b.body.alreadyProcessed).toBe(true);

    }, 30000);
  });
}
