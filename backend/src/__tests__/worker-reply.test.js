import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';

describe('public worker reply endpoint', () => {
  it('records a worker reply to a request', async () => {
    const createResponse = await request(app)
      .post('/api/v1/farmers/1/requests')
      .send({
        worker_id: 2,
        message: 'Fresh request for reply test.'
      });

    expect(createResponse.status).toBe(201);

    const response = await request(app)
      .post('/api/v1/workers/reply')
      .send({
        request_id: createResponse.body.id,
        worker_id: 2,
        reply: 'yes'
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      request_id: createResponse.body.id,
      worker_id: 2,
      reply: 'yes'
    });
  });

  it('rejects a missing request', async () => {
    const response = await request(app)
      .post('/api/v1/workers/reply')
      .send({
        request_id: 999,
        worker_id: 1,
        reply: 'yes'
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('rejects a reply from a worker not assigned to the request', async () => {
    const createResponse = await request(app)
      .post('/api/v1/farmers/1/requests')
      .send({
        worker_id: 2,
        message: 'Worker mismatch test.'
      });

    const response = await request(app)
      .post('/api/v1/workers/reply')
      .send({
        request_id: createResponse.body.id,
        worker_id: 1,
        reply: 'yes'
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: {
        code: 'WORKER_REQUEST_MISMATCH',
        message: 'This worker is not assigned to the request.'
      }
    });
  });

  it('rejects a duplicate reply for the same request', async () => {
    const createResponse = await request(app)
      .post('/api/v1/farmers/1/requests')
      .send({
        worker_id: 2,
        message: 'Duplicate reply test.'
      });

    const reply = {
      request_id: createResponse.body.id,
      worker_id: 2,
      reply: 'no'
    };

    const firstResponse = await request(app)
      .post('/api/v1/workers/reply')
      .send(reply);
    const duplicateResponse = await request(app)
      .post('/api/v1/workers/reply')
      .send(reply);

    expect(firstResponse.status).toBe(200);
    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body).toEqual({
      error: {
        code: 'REPLY_EXISTS',
        message: 'A reply for this worker and request already exists.'
      }
    });
  });
});
