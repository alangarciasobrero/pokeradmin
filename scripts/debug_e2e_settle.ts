import request from 'supertest';
const app = require('../src/app').default;

async function run() {
  try {
    const agent = request.agent(app as any);
    const login = await agent.get('/dev/login-admin');
    console.log('login status', login.status);
    const demo = await agent.post('/dev/create-demo');
    console.log('create-demo status', demo.status, demo.body && (demo.body.tournament && demo.body.tournament.id));
    const tid = demo.body && demo.body.tournament && demo.body.tournament.id ? demo.body.tournament.id : 1;
    const pj = await agent.get(`/admin/games/tournaments/${tid}/participants-json`);
    console.log('participants-json status', pj.status, pj.body && pj.body.participants && pj.body.participants.length);
    const unpaid = (pj.body && pj.body.participants || []).find((p:any)=>Number(p.debt||0) > 0.001);
    console.log('found unpaid', unpaid);
    if (!unpaid) return console.log('no unpaid');
    const settleRes = await agent.post('/admin/payments/settle').send({ userId: unpaid.user_id, amount: Number(unpaid.debt).toFixed(2), useCredit: false, method: 'efectivo', idempotencyKey: 'dbg-' + Date.now() });
    console.log('settle status', settleRes.status, settleRes.body);
  } catch (err) {
    console.error('error', err);
  }
}
run();
