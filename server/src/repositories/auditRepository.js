// AI assistance: Google Gemini (Antigravity) helped scaffold this audit log repository.
import { query } from '../config/database.js';

export const auditRepository = {
  async log({ actorUserId, action, targetType = null, targetId = null, metadata = null }) {
    await query(
      `INSERT INTO audit_logs (actor_user_id, action, target_type, target_id, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [actorUserId, action, targetType, targetId, metadata ? JSON.stringify(metadata) : null]
    );
  },

  async find({ limit = 20, offset = 0 } = {}) {
    const { rows } = await query(
      `SELECT al.id, al.action, al.target_type, al.target_id, al.metadata, al.created_at,
              u.username AS actor_username
       FROM audit_logs al
       LEFT JOIN users u ON u.id = al.actor_user_id
       ORDER BY al.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return rows;
  },

  async count() {
    const { rows } = await query('SELECT COUNT(*) FROM audit_logs');
    return parseInt(rows[0].count, 10);
  },
};

