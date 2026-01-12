let supertestReq: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  supertestReq = require('supertest');
} catch (err) {
  supertestReq = null;
}

if (!supertestReq) {
  describe('Admin preview->confirm-close flow (skipped)', () => {
    it('skipped because supertest is not installed', () => expect(true).toBe(true));
  });
} else {
  process.env.NODE_ENV = 'development';
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const app = require('../src/app').default;
  const Payment = require('../src/models/Payment').default;
  const Tournament = require('../src/models/Tournament').Tournament || require('../src/models/Tournament');

  describe('Admin preview -> confirm-close end-to-end', () => {
    it('should preview and confirm close, creating commission and payouts and finalizing tournament', async () => {
      const agent = supertestReq.agent(app as any);
      // login as admin (dev helper)
      const login = await agent.get('/dev/login-admin');
      expect([200,302]).toContain(login.status);

      // create demo tournament and registrations via dev helper
      const demo = await agent.post('/dev/create-demo');
      expect([200,201]).toContain(demo.status);
      const body = demo.body || {};
      const t = body.tournament;
      expect(t).toBeDefined();
      const tid = Number(t.id || t.ID || t.id);
      expect(tid).toBeGreaterThan(0);

      // call preview-close
      const preview = await agent.get(`/admin/games/tournaments/${tid}/preview-close`);
      expect(preview.status).toBe(200);
      const pj = preview.body || {};
      expect(typeof pj.pot).toBe('number');
      expect(typeof pj.prizePool).toBe('number');
      // choose prizes: single winner obtains whole prizePool
      const prizePool = Number(pj.prizePool || 0);
      const participants = pj.participants || [];
      expect(participants.length).toBeGreaterThan(0);
      const winner = participants[0];
      const prizes = [{ position: 1, user_id: winner.user_id, amount: prizePool }];

      // confirm close with commissionPct as in preview (or 10)
      const confirm = await agent.post(`/admin/games/tournaments/${tid}/confirm-close`).send({ commissionPct: pj.commissionPct || 10, prizes }).set('Content-Type','application/json');
      expect(confirm.status).toBe(200);
      expect(confirm.body && confirm.body.ok).toBe(true);

      // check commission payment exists
      const commissions = await Payment.findAll({ where: { source: 'commission', reference_id: tid } });
      expect(commissions.length).toBeGreaterThanOrEqual(1);
      const commissionRow = commissions[0] as any;
      expect(Number(commissionRow.amount || 0)).toBeGreaterThan(0);

      // check payouts exist
      const payouts = await Payment.findAll({ where: { source: 'tournament_payout' } });
      expect(payouts.length).toBeGreaterThanOrEqual(1);
      const payoutRow = payouts.find((p: any) => p.user_id === winner.user_id && Number(p.amount) < 0);
      expect(payoutRow).toBeDefined();

      // tournament should be finalized
      const tt = await Tournament.findByPk(tid) as any;
      expect(tt).toBeDefined();
      expect(Boolean(tt.registration_open)).toBe(false);
      expect(tt.end_date).toBeTruthy();

    }, 30000);
  });
}
