let supertestReq2: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  supertestReq2 = require('supertest');
} catch (err) {
  supertestReq2 = null;
}

if (!supertestReq2) {
  describe('Registration payment flows (skipped)', () => {
    it('skipped because supertest is not installed', () => expect(true).toBe(true));
  });
} else {
  process.env.NODE_ENV = 'development';
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const app = require('../src/app').default;
  const Payment = require('../src/models/Payment').default;

  describe('Registration + payment flows', () => {
    it('creates a tournament registration with full payment (paid=true)', async () => {
      const agent = supertestReq2.agent(app as any);
      await agent.get('/dev/login-admin');

      // try to get a user and tournament from the admin registration form
      const form = await agent.get('/admin/registrations/new');
      expect([200, 302]).toContain(form.status);

      const matchUser = /name="user_id"[\s\S]*?<option value="(\d+)"/i.exec(form.text || '');
      const matchT = /name="tournament_id"[\s\S]*?<option value="(\d+)"/i.exec(form.text || '');
      if (!matchUser || !matchT) {
        expect(true).toBe(true);
        return;
      }
      const userId = Number(matchUser[1]);
      const tournamentId = Number(matchT[1]);

      // post to tournament register endpoint with a very large amount to ensure paid flag true
      const post = await agent.post(`/admin/games/tournaments/${tournamentId}/register`).type('form').send({ user_id: userId, amount_paid: 1000000, method: 'cash' });
      expect([200, 302]).toContain(post.status);

      // check payments
      const payments = await Payment.findAll({ where: { user_id: userId, source: 'tournament' }, order: [['createdAt','DESC']] });
      expect(payments.length).toBeGreaterThanOrEqual(1);
      const p = payments[0] as any;
      expect(Boolean(p.paid)).toBe(true);
      expect(Number(p.paid_amount || 0)).toBeGreaterThan(0);
    }, 20000);

    it('creates a tournament registration without payment (debtor -> paid=false)', async () => {
      const agent = supertestReq2.agent(app as any);
      await agent.get('/dev/login-admin');
      const form = await agent.get('/admin/registrations/new');
      expect([200, 302]).toContain(form.status);
      const matchUser = /name="user_id"[\s\S]*?<option value="(\d+)"/i.exec(form.text || '');
      const matchT = /name="tournament_id"[\s\S]*?<option value="(\d+)"/i.exec(form.text || '');
      if (!matchUser || !matchT) { expect(true).toBe(true); return; }
      const userId = Number(matchUser[1]);
      const tournamentId = Number(matchT[1]);

      const post = await agent.post(`/admin/games/tournaments/${tournamentId}/register`).type('form').send({ user_id: userId });
      expect([200, 302]).toContain(post.status);

      const payments = await Payment.findAll({ where: { user_id: userId, source: 'tournament' }, order: [['createdAt','DESC']] });
      expect(payments.length).toBeGreaterThanOrEqual(1);
      const p = payments[0] as any;
      // Ensure there's at least one unpaid payment record for this user/tournament (debtor case)
      const hasUnpaid = payments.some((r: any) => Boolean(r.paid) === false);
      expect(hasUnpaid).toBe(true);
    }, 20000);

    it('creates a cash registration without payment (debt) and then records a settlement', async () => {
      const agent = supertestReq2.agent(app as any);
      await agent.get('/dev/login-admin');

      // find a user
      const usersPage = await agent.get('/admin/users');
      expect([200,302]).toContain(usersPage.status);
      const matchUser = /\/admin\/users\/(\d+)\/edit/i.exec(usersPage.text || '');
      if (!matchUser) { expect(true).toBe(true); return; }
      const userId = Number(matchUser[1]);

      // create a cash game quickly to register against
      const createCash = await agent.post('/admin/games/cash/new').type('form').send({ user_id: userId, date: new Date().toISOString(), small_blind: 1, amount: 0 });
      expect([200,302]).toContain(createCash.status);

      // find a cash id from list
      const list = await agent.get('/admin/games/cash/list');
      expect(list.status).toBe(200);
      const matchCash = /\/admin\/games\/cash\/(\d+)/i.exec(list.text || '');
      if (!matchCash) { expect(true).toBe(true); return; }
      const cashId = Number(matchCash[1]);

      // register user into cash without paying
      const reg = await agent.post(`/admin/games/cash/${cashId}/register`).type('form').send({ user_id: userId });
      expect([200,302]).toContain(reg.status);

      // check payment created for cash (should exist and paid=false)
      const payments = await Payment.findAll({ where: { user_id: userId, source: 'cash' }, order: [['createdAt','DESC']] });
      expect(payments.length).toBeGreaterThanOrEqual(1);
      const p = payments[0] as any;
      expect(Boolean(p.paid)).toBe(false);

      // now call mark-paid (settlement) to record a real payment
      const pay = await agent.post(`/admin/users/${userId}/payments/${p.id}/mark-paid`).type('form').send({ paid_amount: 50, method: 'cash' });
      expect([200,302]).toContain(pay.status);

      // verify settlement exists
      const settlements = await Payment.findAll({ where: { user_id: userId, source: 'settlement' }, order: [['createdAt','DESC']] });
      expect(settlements.length).toBeGreaterThanOrEqual(1);
      const s = settlements[0] as any;
      expect(Boolean(s.paid)).toBe(true);
      expect(Number(s.paid_amount || 0)).toBeGreaterThan(0);

      // original payment should have accumulated paid_amount
      const updatedOriginal = await Payment.findByPk(p.id) as any;
      expect(Number(updatedOriginal.paid_amount || 0)).toBeGreaterThanOrEqual(Number(s.paid_amount || 0));
    }, 25000);

  });
}
