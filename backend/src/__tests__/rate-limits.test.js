import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';
import { pool } from '../db/pool.js';

async function createFarmerAndWorker() {
  const suffix = Date.now().toString().slice(-8);
  const farmerResponse = await request(app)
    .post('/api/v1/farmers')
    .send({ name: 'Rate Limit Farmer', phone_number: `777${suffix}` });

  const workerResponse = await request(app)
    .post(`/api/v1/farmers/${farmerResponse.body.id}/workers`)
    .send({ name: 'Rate Limit Worker', phone_number: `666${suffix}` });

  return {
    farmerId: farmerResponse.body.id,
    workerId: workerResponse.body.id
  };
}

describe('labour request and worker reply rate limits', () => {
  it('limits a farmer to five labour requests per hour', async () => {
    const { farmerId, workerId } = await createFarmerAndWorker();

    for (let attempt = 1; attempt <= 5; attempt += 1) {
      const response = await request(app)
        .post(`/api/v1/farmers/${farmerId}/requests`)
        .send({ worker_id: workerId, message: `Availability request ${attempt}` });

      expect(response.status).toBe(201);
    }

    const limitedResponse = await request(app)
      .post(`/api/v1/farmers/${farmerId}/requests`)
      .send({ worker_id: workerId, message: 'Availability request 6' });

    expect(limitedResponse.status).toBe(429);
    expect(limitedResponse.body).toEqual({
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests. Please try again later.'
      }
    });
  });

  it('limits a worker to ten replies per hour', async () => {
    const { farmerId, workerId } = await createFarmerAndWorker();
    const requestIds = [];

    for (let attempt = 1; attempt <= 11; attempt += 1) {
      const [result] = await pool.query(
        'INSERT INTO labour_requests (farmer_id, worker_id, message, status) VALUES (?, ?, ?, ?)',
        [farmerId, workerId, `Reply request ${attempt}`, 'pending']
      );

      requestIds.push(result.insertId);
    }

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const response = await request(app)
        .post('/api/v1/workers/reply')
        .send({ request_id: requestIds[attempt], worker_id: workerId, reply: 'no' });

      expect(response.status).toBe(200);
    }

    const limitedResponse = await request(app)
      .post('/api/v1/workers/reply')
      .send({ request_id: requestIds[10], worker_id: workerId, reply: 'no' });

    expect(limitedResponse.status).toBe(429);
    expect(limitedResponse.body).toEqual({
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests. Please try again later.'
      }
    });
  });
});