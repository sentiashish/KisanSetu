import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';

describe('farmers and workers endpoints', () => {
  it('lists farmers', async () => {
    const response = await request(app).get('/api/v1/farmers');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('creates a farmer', async () => {
    const farmerPhone = `999${Date.now().toString().slice(-8)}`;

    const response = await request(app)
      .post('/api/v1/farmers')
      .send({
        name: 'New Farmer',
        phone_number: farmerPhone
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'New Farmer',
      phone_number: farmerPhone
    });
  });

  it('lists workers for a farmer', async () => {
    const response = await request(app).get('/api/v1/farmers/1/workers');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('creates a worker for a farmer', async () => {
    const workerPhone = `888${Date.now().toString().slice(-8)}`;

    const response = await request(app)
      .post('/api/v1/farmers/1/workers')
      .send({
        name: 'New Worker',
        phone_number: workerPhone
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      farmer_id: 1,
      name: 'New Worker',
      phone_number: workerPhone
    });
  });
});
