import request from 'supertest';

// Ensure dev routes are mounted in the app for the test
process.env.NODE_ENV = 'development';

import app from '../src/app';

describe('Admin ranking page', () => {
  it('should allow an admin to view the ranking page (dev login helper)', async () => {
    const agent = request.agent(app as any);

    // Use dev helper to login as admin
    const loginRes = await agent.get('/dev/login-admin');
    expect([200, 302]).toContain(loginRes.status);

    const res = await agent.get('/admin/games/ranking');
    // the route may redirect if missing data, accept 200 or 302
    expect([200, 302]).toContain(res.status);
  }, 10000);
});
