// AI assistance: Google Gemini (Antigravity) helped scaffold this repository.
import { query } from '../config/database.js';

export const userRepository = {
  async findByEmail(email) {
    const { rows } = await query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    return rows[0] || null;
  },

  async findByUsername(username) {
    const { rows } = await query(
      'SELECT * FROM users WHERE username = $1',
      [username.toLowerCase()]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await query(
      'SELECT id, username, display_name, email, role, status, created_at, updated_at, last_login_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async findByIdentifier(identifier) {
    const { rows } = await query(
      `SELECT * FROM users
       WHERE email = $1 OR username = $1
       LIMIT 1`,
      [identifier.toLowerCase()]
    );
    return rows[0] || null;
  },

  async create({ username, displayName, email, passwordHash }) {
    const { rows } = await query(
      `INSERT INTO users (username, display_name, email, password_hash, role, status)
       VALUES ($1, $2, $3, $4, 'player', 'active')
       RETURNING id, username, display_name, email, role, status, created_at`,
      [username.toLowerCase(), displayName, email.toLowerCase(), passwordHash]
    );
    return rows[0];
  },

  async updateLastLogin(id) {
    await query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [id]
    );
  },

  async updateProfile(id, { displayName }) {
    const { rows } = await query(
      `UPDATE users SET display_name = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, username, display_name, email, role, status, created_at, updated_at`,
      [displayName, id]
    );
    return rows[0] || null;
  },

  async updatePassword(id, passwordHash) {
    await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, id]
    );
  },

  async getPasswordHash(id) {
    const { rows } = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [id]
    );
    return rows[0]?.password_hash || null;
  },

  async updateStatus(id, status) {
    const { rows } = await query(
      `UPDATE users SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, username, display_name, email, role, status`,
      [status, id]
    );
    return rows[0] || null;
  },

  async findAll({ limit = 20, offset = 0, search = '' } = {}) {
    const searchParam = `%${search}%`;
    const { rows } = await query(
      `SELECT id, username, display_name, email, role, status, created_at, last_login_at
       FROM users
       WHERE username ILIKE $1 OR email ILIKE $1 OR display_name ILIKE $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [searchParam, limit, offset]
    );
    return rows;
  },

  async count(search = '') {
    const searchParam = `%${search}%`;
    const { rows } = await query(
      `SELECT COUNT(*) FROM users
       WHERE username ILIKE $1 OR email ILIKE $1 OR display_name ILIKE $1`,
      [searchParam]
    );
    return parseInt(rows[0].count, 10);
  },
};

