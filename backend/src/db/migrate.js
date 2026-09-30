import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const currentFile = fileURLToPath(import.meta.url);
const migrationsDirectory = path.resolve(path.dirname(currentFile), '../../../database/migrations');

try {
  const migrationFiles = (await fs.readdir(migrationsDirectory))
    .filter((fileName) => fileName.endsWith('.sql'))
    .sort();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      file_name VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [appliedRows] = await pool.query('SELECT file_name FROM schema_migrations');
  const appliedFiles = new Set(appliedRows.map((row) => row.file_name));

  for (const fileName of migrationFiles) {
    if (appliedFiles.has(fileName)) {
      continue;
    }

    const migrationSql = await fs.readFile(path.join(migrationsDirectory, fileName), 'utf8');
    await pool.query(migrationSql);
    await pool.query('INSERT INTO schema_migrations (file_name) VALUES (?)', [fileName]);
    console.log(`Applied migration ${fileName}`);
  }

  console.log(`Migration check complete: ${migrationFiles.length} file(s) found.`);
} finally {
  await pool.end();
}
