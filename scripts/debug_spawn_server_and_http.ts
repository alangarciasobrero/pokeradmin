import child_process from 'child_process';
import http from 'http';
import path from 'path';

const BASE_URL = 'http://localhost:3000';
function httpJson(method: string, pathStr: string, body?: string) {
  return new Promise<any>((resolve, reject) => {
    try {
      const u = new URL(pathStr, BASE_URL);
      const isHttps = u.protocol === 'https:';
      const opts: any = { method, hostname: u.hostname, port: u.port || (isHttps ? 443 : 80), path: u.pathname + (u.search || ''), headers: { 'Accept': 'application/json' } };
      if (body) opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      const client = isHttps ? require('https') : require('http');
      const req = client.request(opts, (res: any) => {
        const chunks: any[] = [];
        res.on('data', (c: any) => chunks.push(c));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          try { const j = JSON.parse(text); resolve(j); } catch (e) { resolve({ raw: text }); }
        });
      });
      req.on('error', (err: any) => reject(err));
      if (body) req.write(body);
      req.end();
    } catch (e) { reject(e); }
  });
}

async function run() {
  const DEV_CMD = 'npm run dev';
  const serverProc = child_process.spawn(DEV_CMD, { shell: true, cwd: path.resolve(__dirname, '../'), env: process.env, stdio: 'inherit' });
  await new Promise((res) => setTimeout(res, 2000));
  try {
    console.log('calling create-demo via http');
    const demo = await httpJson('POST', '/dev/create-demo');
    console.log('demo', demo);
    const tid = demo && demo.tournament && demo.tournament.id ? demo.tournament.id : 1;
    const pj = await httpJson('GET', `/admin/games/tournaments/${tid}/participants-json`);
    console.log('pj', pj && pj.participants && pj.participants.length);
    const unpaid = (pj && pj.participants || []).find((p:any)=>Number(p.debt||0) > 0.001);
    console.log('unpaid', unpaid);
    if (!unpaid) return;
    const settleBody = `userId=${encodeURIComponent(unpaid.user_id)}&amount=${encodeURIComponent(Number(unpaid.debt||0).toFixed(2))}&useCredit=false&method=efectivo&idempotencyKey=dbgspawn-${Date.now()}`;
    const settleRes = await httpJson('POST', '/admin/payments/settle', settleBody);
    console.log('settleRes', settleRes);
  } catch (err) {
    console.error('error', err);
  } finally {
    try { serverProc.kill(); } catch (e) {}
  }
}
run();
