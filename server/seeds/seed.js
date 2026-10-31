// AI assistance: Google Gemini (Antigravity) helped scaffold this seed script.
// Creates the first admin user.
// Run ONCE: node seeds/seed.js
// Reads admin credentials from environment variables — never hardcoded.
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pg from 'pg';

const { Client } = pg;

async function seed() {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminEmail    = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminDisplay  = process.env.ADMIN_DISPLAY_NAME || 'Administrator';

  if (!adminUsername || !adminEmail || !adminPassword) {
    console.error(
      '[SEED] Set ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD in your .env file before seeding.'
    );
    process.exit(1);
  }

  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'banana_brain',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });

  await client.connect();

  const existing = await client.query(
    'SELECT id FROM users WHERE email = $1 OR username = $2',
    [adminEmail.toLowerCase(), adminUsername.toLowerCase()]
  );
  if (existing.rows.length > 0) {
    console.log('[SEED] Admin user already exists. Skipping.');
    await client.end();
    return;
  }

  const hash = await bcrypt.hash(adminPassword, 12);
  await client.query(
    `INSERT INTO users (username, display_name, email, password_hash, role, status)
     VALUES ($1, $2, $3, $4, 'admin', 'active')`,
    [adminUsername.toLowerCase(), adminDisplay, adminEmail.toLowerCase(), hash]
  );

  console.log('[SEED] ✓ Admin user created:', adminEmail);
  await client.end();
}

seed().catch((err) => {
  console.error('[SEED] Error:', err.message);
  process.exit(1);
});

