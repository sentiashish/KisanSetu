import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';

describe('validation and error responses', () => {
  it('rejects whitespace-only farmer fields', async () => {
    const response = await request(app)
      .post('/api/v1/farmers')
      .send({
        name: '   ',
        phone_number: '   '
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: 'INVALID_FARMER',
        message: 'Farmer name and phone number are required.'
      }
    });
  });

  it('returns JSON for unknown API routes', async () => {
    const response = await request(app).get('/api/v1/does-not-exist');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found.'
      }
    });
  });
});