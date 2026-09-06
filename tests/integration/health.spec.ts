import request from 'supertest';
import { DatabaseSync } from 'node:sqlite';
import { createApp } from '../../apps/server/src/app.js';

describe('Health API (integration)', () => {
  it('returns ok status', async () => {
    const app = createApp(new DatabaseSync(':memory:'));

    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
