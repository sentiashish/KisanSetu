import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';

describe('labour request endpoints', () => {
  it('lists requests for a farmer with response counts', async () => {
    const response = await request(app).get('/api/v1/farmers/1/requests');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('response_count');
  });

  it('creates a labour request for a worker', async () => {
    const response = await request(app)
      .post('/api/v1/farmers/1/requests')
      .send({
        worker_id: 2,
        message: 'Kal subah 7 baje kaam hai. Kya available ho?'
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      farmer_id: 1,
      worker_id: 2,
      message: 'Kal subah 7 baje kaam hai. Kya available ho?',
      status: 'pending',
      response_count: 0
    });
  });
});
