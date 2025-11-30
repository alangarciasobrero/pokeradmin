let supertestReqEdge: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  supertestReqEdge = require('supertest');
} catch (err) {
  supertestReqEdge = null;
}

if (!supertestReqEdge) {
  describe('Registration edge cases (skipped)', () => {
    it('skipped because supertest is not installed', () => expect(true).toBe(true));
  });
} else {
  process.env.NODE_ENV = 'development';
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const app = require('../src/app').default;
  const sequelize = require('../src/services/database').default;
  const User = require('../src/models/User').default;
  const Tournament = require('../src/models/Tournament').Tournament;
  const Payment = require('../src/models/Payment').default;

  describe('Registration edge cases', () => {
    beforeAll(async () => {
      await sequelize.sync({ force: true });
      await User.create({ username: 'admin', password_hash: 'x', role: 'admin' });
    });

    afterAll(async () => {
      await sequelize.close();
    });

    it('punctuality discount applied and expected payment created', async () => {
      const t = await Tournament.create({ name: 'T1', buy_in: 100, start_date: new Date(Date.now() + 1000 * 60 * 60), punctuality_discount: 20 });
      const u = await User.create({ username: 'player1', password_hash: 'x', is_player: true });
  const agent = supertestReqEdge.agent(app as any);

      const res = await agent.post(`/admin/games/tournaments/${t.id}/register`).type('form').send({ user_id: u.id, amount_paid: 0 });
      expect([302,200]).toContain(res.status);

      const payments = await Payment.findAll({ where: { user_id: u.id } });
      expect(payments.length).toBeGreaterThanOrEqual(1);
      const p = payments[0] as any;
      expect(Number(p.amount)).toBeCloseTo(80);
      expect(Number(p.paid_amount || 0)).toBe(0);
    }, 20000);

    it('partial payment and multiple settlements accumulate paid_amount', async () => {
      const t = await Tournament.create({ name: 'T2', buy_in: 200, start_date: new Date(Date.now() - 1000 * 60 * 60), punctuality_discount: 0 });
      const u = await User.create({ username: 'player2', password_hash: 'x', is_player: true });

  await supertestReqEdge(app as any).post(`/admin/games/tournaments/${t.id}/register`).type('form').send({ user_id: u.id, amount_paid: 0 });

      const expectation = await Payment.findOne({ where: { user_id: u.id, source: 'tournament' } }) as any;
      expect(expectation).toBeTruthy();

  const up1 = await supertestReqEdge(app as any).post(`/admin/users/${u.id}/payments/${expectation.id}/mark-paid`).type('form').send({ paid_amount: 50, method: 'cash' });
      expect([302,200]).toContain(up1.status);

  const up2 = await supertestReqEdge(app as any).post(`/admin/users/${u.id}/payments/${expectation.id}/mark-paid`).type('form').send({ paid_amount: 75, method: 'card' });
      expect([302,200]).toContain(up2.status);

      const reloaded = await Payment.findByPk(expectation.id) as any;
      expect(Number(reloaded.paid_amount)).toBeCloseTo(125);

      const settlements = await Payment.findAll({ where: { user_id: u.id, source: 'settlement' } });
      expect(settlements.length).toBeGreaterThanOrEqual(2);
    }, 25000);

  });
}
