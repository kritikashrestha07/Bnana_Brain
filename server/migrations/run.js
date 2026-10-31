// AI assistance: Google Gemini (Antigravity) helped scaffold this migration runner.
// Run with: node migrations/run.js
import 'dotenv/config';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { Client } = pg;

async function runMigrations() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'banana_brain',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });

  await client.connect();
  console.log('[MIGRATE] Connected to database:', process.env.DB_NAME);

  // Create migrations tracking table
  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id         SERIAL PRIMARY KEY,
      filename   VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);

  const applied = await client.query('SELECT filename FROM _migrations');
  const appliedSet = new Set(applied.rows.map((r) => r.filename));

  const migrationDir = __dirname;
  const files = readdirSync(migrationDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  let count = 0;
  for (const file of files) {
    if (appliedSet.has(file)) {
      console.log(`[MIGRATE] Already applied: ${file}`);
      continue;
    }
    const sql = readFileSync(join(migrationDir, file), 'utf8');
    console.log(`[MIGRATE] Applying: ${file}`);
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('INSERT INTO _migrations (filename) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`[MIGRATE] ✓ ${file}`);
      count++;
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`[MIGRATE] ✗ ${file}: ${err.message}`);
      await client.end();
      process.exit(1);
    }
  }

  await client.end();
  console.log(`[MIGRATE] Done. ${count} migration(s) applied.`);
}

runMigrations().catch((err) => {
  console.error('[MIGRATE] Fatal error:', err.message);
  process.exit(1);
});

