import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { pool } from './db/pool.js';
import { createRateLimiter } from './rateLimiter.js';

export const app = express();
const port = Number(process.env.PORT || 3000);
const currentFilePath = fileURLToPath(import.meta.url);
const oneHourMs = 60 * 60 * 1000;
const labourRequestRateLimiter = createRateLimiter(5, oneHourMs);
const workerReplyRateLimiter = createRateLimiter(10, oneHourMs);

function sendRateLimitError(response) {
  return response.status(429).json({
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests. Please try again later.'
    }
  });
}

app.use(express.json());

app.get('/', (_request, response) => {
  response.json({
    name: 'KisanSetu API',
    status: 'running'
  });
});

app.get('/api/v1/health', async (_request, response) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');

    if (!rows || rows.length === 0) {
      throw new Error('No response from database');
    }

    response.json({
      status: 'ok',
      database: 'connected'
    });
  } catch (error) {
    response.status(503).json({
      error: {
        code: 'DB_UNAVAILABLE',
        message: 'Database connection failed.'
      }
    });
  }
});

app.get('/api/v1/farmers', async (_request, response) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, phone_number, created_at FROM farmers ORDER BY id ASC'
    );

    response.json(rows);
  } catch (error) {
    response.status(500).json({
      error: {
        code: 'GET_FARMERS_FAILED',
        message: 'Unable to load farmers.'
      }
    });
  }
});

app.post('/api/v1/farmers', async (request, response) => {
  const { name, phone_number } = request.body || {};
  const farmerName = typeof name === 'string' ? name.trim() : '';
  const farmerPhone = typeof phone_number === 'string' ? phone_number.trim() : '';

  if (!farmerName || !farmerPhone) {
    return response.status(400).json({
      error: {
        code: 'INVALID_FARMER',
        message: 'Farmer name and phone number are required.'
      }
    });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO farmers (name, phone_number) VALUES (?, ?)',
      [farmerName, farmerPhone]
    );

    const [rows] = await pool.query(
      'SELECT id, name, phone_number, created_at FROM farmers WHERE id = ?',
      [result.insertId]
    );

    response.status(201).json(rows[0]);
  } catch (error) {
    const errorCode = error?.code === 'ER_DUP_ENTRY' ? 409 : 500;
    const errorMessage = error?.code === 'ER_DUP_ENTRY'
      ? 'A farmer with this phone number already exists.'
      : 'Unable to create farmer.';

    response.status(errorCode).json({
      error: {
        code: error?.code === 'ER_DUP_ENTRY' ? 'FARMER_EXISTS' : 'CREATE_FARMER_FAILED',
        message: errorMessage
      }
    });
  }
});

app.get('/api/v1/farmers/:farmerId/workers', async (request, response) => {
  const farmerId = Number(request.params.farmerId);

  if (!Number.isInteger(farmerId) || farmerId <= 0) {
    return response.status(400).json({
      error: {
        code: 'INVALID_FARMER_ID',
        message: 'Farmer id is invalid.'
      }
    });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, farmer_id, name, phone_number, created_at FROM workers WHERE farmer_id = ? ORDER BY id ASC',
      [farmerId]
    );

    response.json(rows);
  } catch (error) {
    response.status(500).json({
      error: {
        code: 'GET_WORKERS_FAILED',
        message: 'Unable to load workers.'
      }
    });
  }
});

app.post('/api/v1/farmers/:farmerId/workers', async (request, response) => {
  const farmerId = Number(request.params.farmerId);
  const { name, phone_number } = request.body || {};
  const workerName = typeof name === 'string' ? name.trim() : '';
  const workerPhone = typeof phone_number === 'string' ? phone_number.trim() : '';

  if (!Number.isInteger(farmerId) || farmerId <= 0) {
    return response.status(400).json({
      error: {
        code: 'INVALID_FARMER_ID',
        message: 'Farmer id is invalid.'
      }
    });
  }

  if (!workerName || !workerPhone) {
    return response.status(400).json({
      error: {
        code: 'INVALID_WORKER',
        message: 'Worker name and phone number are required.'
      }
    });
  }

  try {
    const [farmerRows] = await pool.query('SELECT id FROM farmers WHERE id = ?', [farmerId]);

    if (!farmerRows || farmerRows.length === 0) {
      return response.status(404).json({
        error: {
          code: 'FARMER_NOT_FOUND',
          message: 'Farmer not found.'
        }
      });
    }

    const [result] = await pool.query(
      'INSERT INTO workers (farmer_id, name, phone_number) VALUES (?, ?, ?)',
      [farmerId, workerName, workerPhone]
    );

    const [rows] = await pool.query(
      'SELECT id, farmer_id, name, phone_number, created_at FROM workers WHERE id = ?',
      [result.insertId]
    );

    response.status(201).json(rows[0]);
  } catch (error) {
    const errorCode = error?.code === 'ER_DUP_ENTRY' ? 409 : 500;
    const errorMessage = error?.code === 'ER_DUP_ENTRY'
      ? 'A worker with this phone number already exists.'
      : 'Unable to create worker.';

    response.status(errorCode).json({
      error: {
        code: error?.code === 'ER_DUP_ENTRY' ? 'WORKER_EXISTS' : 'CREATE_WORKER_FAILED',
        message: errorMessage
      }
    });
  }
});

app.get('/api/v1/farmers/:farmerId/requests', async (request, response) => {
  const farmerId = Number(request.params.farmerId);

  if (!Number.isInteger(farmerId) || farmerId <= 0) {
    return response.status(400).json({
      error: {
        code: 'INVALID_FARMER_ID',
        message: 'Farmer id is invalid.'
      }
    });
  }

  try {
    const [rows] = await pool.query(`
      SELECT
        lr.id,
        lr.farmer_id,
        lr.worker_id,
        w.name AS worker_name,
        lr.message,
        lr.status,
        lr.created_at,
        COUNT(DISTINCT lr2.id) AS response_count
      FROM labour_requests lr
      LEFT JOIN workers w ON w.id = lr.worker_id
      LEFT JOIN labour_replies lr2 ON lr2.request_id = lr.id
      WHERE lr.farmer_id = ?
      GROUP BY lr.id, lr.farmer_id, lr.worker_id, w.name, lr.message, lr.status, lr.created_at
      ORDER BY lr.created_at DESC
    `, [farmerId]);

    response.json(rows.map((row) => ({
      ...row,
      response_count: Number(row.response_count) || 0
    })));
  } catch (error) {
    response.status(500).json({
      error: {
        code: 'GET_REQUESTS_FAILED',
        message: 'Unable to load labour requests.'
      }
    });
  }
});

app.post('/api/v1/farmers/:farmerId/requests', async (request, response) => {
  const farmerId = Number(request.params.farmerId);
  const { worker_id, message } = request.body || {};

  if (!Number.isInteger(farmerId) || farmerId <= 0) {
    return response.status(400).json({
      error: {
        code: 'INVALID_FARMER_ID',
        message: 'Farmer id is invalid.'
      }
    });
  }

  if (!Number.isInteger(Number(worker_id)) || Number(worker_id) <= 0) {
    return response.status(400).json({
      error: {
        code: 'INVALID_WORKER_ID',
        message: 'Worker id is required.'
      }
    });
  }

  if (!message || !String(message).trim()) {
    return response.status(400).json({
      error: {
        code: 'INVALID_MESSAGE',
        message: 'Request message is required.'
      }
    });
  }

  if (labourRequestRateLimiter(String(farmerId))) {
    return sendRateLimitError(response);
  }

  try {
    const [farmerRows] = await pool.query('SELECT id FROM farmers WHERE id = ?', [farmerId]);
    if (!farmerRows || farmerRows.length === 0) {
      return response.status(404).json({
        error: {
          code: 'FARMER_NOT_FOUND',
          message: 'Farmer not found.'
        }
      });
    }

    const [workerRows] = await pool.query(
      'SELECT id FROM workers WHERE id = ? AND farmer_id = ?',
      [Number(worker_id), farmerId]
    );

    if (!workerRows || workerRows.length === 0) {
      return response.status(404).json({
        error: {
          code: 'WORKER_NOT_FOUND',
          message: 'Worker not found for this farmer.'
        }
      });
    }

    const [result] = await pool.query(
      'INSERT INTO labour_requests (farmer_id, worker_id, message, status) VALUES (?, ?, ?, ?)',
      [farmerId, Number(worker_id), String(message).trim(), 'pending']
    );

    const [rows] = await pool.query(`
      SELECT
        lr.id,
        lr.farmer_id,
        lr.worker_id,
        w.name AS worker_name,
        lr.message,
        lr.status,
        lr.created_at,
        0 AS response_count
      FROM labour_requests lr
      LEFT JOIN workers w ON w.id = lr.worker_id
      WHERE lr.id = ?
    `, [result.insertId]);

    response.status(201).json({
      ...rows[0],
      response_count: 0
    });
  } catch (error) {
    response.status(500).json({
      error: {
        code: 'CREATE_REQUEST_FAILED',
        message: 'Unable to create labour request.'
      }
    });
  }
});

app.post('/api/v1/workers/reply', async (request, response) => {
  const { request_id, worker_id, reply } = request.body || {};
  const normalizedReply = typeof reply === 'string' ? reply.trim().toLowerCase() : '';

  if (!Number.isInteger(Number(request_id)) || Number(request_id) <= 0) {
    return response.status(400).json({
      error: {
        code: 'INVALID_REQUEST_ID',
        message: 'Request id is required.'
      }
    });
  }

  if (!Number.isInteger(Number(worker_id)) || Number(worker_id) <= 0) {
    return response.status(400).json({
      error: {
        code: 'INVALID_WORKER_ID',
        message: 'Worker id is required.'
      }
    });
  }

  if (!['yes', 'no', 'stop'].includes(normalizedReply)) {
    return response.status(400).json({
      error: {
        code: 'INVALID_REPLY',
        message: 'Reply must be yes, no, or stop.'
      }
    });
  }

  if (workerReplyRateLimiter(String(worker_id))) {
    return sendRateLimitError(response);
  }

  try {
    const [requestRows] = await pool.query('SELECT id, worker_id FROM labour_requests WHERE id = ?', [Number(request_id)]);

    if (!requestRows || requestRows.length === 0) {
      return response.status(404).json({
        error: {
          code: 'REQUEST_NOT_FOUND',
          message: 'Labour request not found.'
        }
      });
    }

    const request = requestRows[0];

    if (Number(request.worker_id) !== Number(worker_id)) {
      return response.status(404).json({
        error: {
          code: 'WORKER_REQUEST_MISMATCH',
          message: 'This worker is not assigned to the request.'
        }
      });
    }

    const [existingRows] = await pool.query(
      'SELECT id FROM labour_replies WHERE request_id = ? AND worker_id = ?',
      [Number(request_id), Number(worker_id)]
    );

    if (existingRows && existingRows.length > 0) {
      return response.status(409).json({
        error: {
          code: 'REPLY_EXISTS',
          message: 'A reply for this worker and request already exists.'
        }
      });
    }

    await pool.query(
      'INSERT INTO labour_replies (request_id, worker_id, reply_text) VALUES (?, ?, ?)',
      [Number(request_id), Number(worker_id), normalizedReply]
    );

    await pool.query(
      'UPDATE labour_requests SET status = ?, responded_at = CURRENT_TIMESTAMP WHERE id = ?',
      [normalizedReply === 'yes' ? 'accepted' : normalizedReply === 'no' ? 'declined' : 'stopped', Number(request_id)]
    );

    response.json({
      request_id: Number(request_id),
      worker_id: Number(worker_id),
      reply: normalizedReply
    });
  } catch (error) {
    response.status(500).json({
      error: {
        code: 'REPLY_FAILED',
        message: 'Unable to record worker reply.'
      }
    });
  }
});

app.use('/api', (_request, response) => {
  response.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found.'
    }
  });
});

if (process.argv[1] === currentFilePath) {
  app.listen(port, () => {
    console.log(`KisanSetu API listening on port ${port}`);
  });
}
