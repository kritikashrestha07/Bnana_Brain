import 'dotenv/config';
import app from './app.js';
import { config } from './config/index.js';
import { pool } from './config/database.js';

async function start() {
  // Verify database connection before accepting traffic
  try {
    const client = await pool.connect();
    client.release();
    console.log('[DB] PostgreSQL connection verified.');
  } catch (err) {
    console.error('[DB] Failed to connect to PostgreSQL:', err.message);
    console.error('Ensure the database is running and .env credentials are correct.');
    process.exit(1);
  }

  app.listen(config.port, () => {
    console.log(`[SERVER] Banana Brain API running on http://localhost:${config.port}`);
    console.log(`[SERVER] Environment: ${config.nodeEnv}`);
  });
}

start();

