// AI assistance: Google Gemini (Antigravity) helped scaffold this database pool configuration.
import pg from 'pg';
import { config } from './index.js';

const { Pool } = pg;

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client:', err.message);
});

/**
 * Execute a parameterized query against the PostgreSQL pool.
 * @param {string} text - SQL query string with $1, $2... placeholders.
 * @param {any[]} [params] - Query parameters.
 */
export async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (config.nodeEnv !== 'test') {
      console.log(`[DB] query (${duration}ms): ${text.substring(0, 80)}`);
    }
    return result;
  } catch (err) {
    console.error('[DB] Query error:', err.message, '| SQL:', text.substring(0, 80));
    throw err;
  }
}

/**
 * Get a client from the pool for transactions.
 */
export async function getClient() {
  const client = await pool.connect();
  const release = client.release.bind(client);
  // Wrap release to add logging
  client.release = () => {
    client.release = release;
    return release();
  };
  return client;
}

export { pool };

