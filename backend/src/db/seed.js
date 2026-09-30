import 'dotenv/config';
import { pool } from './pool.js';

const farmers = [
  { name: 'Ram Kumar', phone_number: '9876543210' },
  { name: 'Sita Devi', phone_number: '9123456780' }
];

const workers = [
  { farmer_id: 1, name: 'Mohan Lal', phone_number: '9000000001' },
  { farmer_id: 1, name: 'Raju Yadav', phone_number: '9000000002' },
  { farmer_id: 2, name: 'Shivam Singh', phone_number: '9000000003' },
  { farmer_id: 2, name: 'Asha Kumari', phone_number: '9000000004' }
];

const requests = [
  { farmer_id: 1, worker_id: 1, message: 'Kya aaj kheti ke liye labour mil sakta hai?', status: 'accepted' },
  { farmer_id: 1, worker_id: 2, message: 'Kal subah 6 baje kaam hai. Aap aa sakte hain?', status: 'pending' },
  { farmer_id: 2, worker_id: 3, message: 'Aaj gaon mein gandha mitti ke kaam ke liye aadmi chahiye.', status: 'declined' }
];

const replies = [
  { request_id: 1, worker_id: 1, reply_text: 'haan' },
  { request_id: 3, worker_id: 3, reply_text: 'nahi' }
];

const existingFarmers = await pool.query('SELECT COUNT(*) AS count FROM farmers');
if (Number(existingFarmers[0][0].count) > 0) {
  console.log('Seed data already exists; skipping seed.');
  await pool.end();
  process.exit(0);
}

await pool.query('START TRANSACTION');

try {
  const farmerInsert = await pool.query(
    'INSERT INTO farmers (name, phone_number) VALUES (?, ?), (?, ?)',
    [farmers[0].name, farmers[0].phone_number, farmers[1].name, farmers[1].phone_number]
  );

  const farmerIds = [farmerInsert[0].insertId, farmerInsert[0].insertId + 1];

  const workerValues = workers.map((worker) => [
    farmerIds[worker.farmer_id - 1],
    worker.name,
    worker.phone_number
  ]);

  const workerInsert = await pool.query(
    'INSERT INTO workers (farmer_id, name, phone_number) VALUES ?',
    [workerValues]
  );

  const workerIds = [workerInsert[0].insertId, workerInsert[0].insertId + 1, workerInsert[0].insertId + 2, workerInsert[0].insertId + 3];

  const requestValues = requests.map((request) => [
    request.farmer_id,
    workerIds[request.worker_id - 1],
    request.message,
    request.status
  ]);

  const requestInsert = await pool.query(
    'INSERT INTO labour_requests (farmer_id, worker_id, message, status) VALUES ?',
    [requestValues]
  );

  const requestIds = [requestInsert[0].insertId, requestInsert[0].insertId + 1, requestInsert[0].insertId + 2];

  const replyValues = replies.map((reply) => [
    requestIds[reply.request_id - 1],
    workerIds[reply.worker_id - 1],
    reply.reply_text
  ]);

  if (replyValues.length > 0) {
    await pool.query(
      'INSERT INTO labour_replies (request_id, worker_id, reply_text) VALUES ?',
      [replyValues]
    );
  }

  await pool.query('COMMIT');
  console.log('Seed data inserted successfully.');
} catch (error) {
  await pool.query('ROLLBACK');
  throw error;
} finally {
  await pool.end();
}
