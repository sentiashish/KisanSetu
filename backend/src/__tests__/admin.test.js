import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';

describe('temporary admin endpoints', () => {
  it('rejects requests without the admin key', async () => {
    const response = await request(app).get('/api/v1/admin/requests');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: {
        code: 'ADMIN_KEY_REQUIRED',
        message: 'Admin key is required.'
      }
    });
  });

  it('rejects requests with the wrong admin key', async () => {
    const response = await request(app)
      .get('/api/v1/admin/requests')
      .set('X-Admin-Key', 'wrong-key');

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: {
        code: 'INVALID_ADMIN_KEY',
        message: 'Admin key is invalid.'
      }
    });
  });

  it('lists labour requests with the admin key', async () => {
    const response = await request(app)
      .get('/api/v1/admin/requests')
      .set('X-Admin-Key', process.env.ADMIN_KEY);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});