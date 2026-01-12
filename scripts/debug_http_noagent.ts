import request from 'supertest';
const app = require('../src/app').default;

async function run() {
  try {
    // create-demo with no agent
    const demo = await request(app).post('/dev/create-demo');
    console.log('create-demo status', demo.status);
    const pj = await request(app).get('/admin/games/tournaments/1/participants-json');
    console.log('participants-json status', pj.status, pj.body && pj.body.participants && pj.body.participants.length);
    const unpaid = (pj.body && pj.body.participants || []).find((p:any)=>Number(p.debt||0) > 0.001);
    console.log('unpaid', unpaid && unpaid.user_id);
    if (!unpaid) return;
    // call settle without agent (no session persisted)
    const settleRes = await request(app).post('/admin/payments/settle').type('form').send({ userId: unpaid.user_id, amount: unpaid.debt, useCredit: false, method: 'efectivo', idempotencyKey: 'dbgnoag' + Date.now() });
    console.log('settle status', settleRes.status, settleRes.body);
  } catch (err) {
    console.error('err', err);
  }
}
run();
