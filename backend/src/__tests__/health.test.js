import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';

describe('GET /api/v1/health', () => {
  it('returns ok when the database is reachable', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('database', 'connected');
  });
});
