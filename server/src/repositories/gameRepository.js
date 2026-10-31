// AI assistance: Google Gemini (Antigravity) helped scaffold this repository.
import { query, getClient } from '../config/database.js';
import { GAME_MODES } from '../services/scoringService.js';

export const gameRepository = {
  async create({ userId, mode }) {
    const modeConfig = GAME_MODES[mode] || GAME_MODES.medium;
    const { rows } = await query(
      `INSERT INTO games (user_id, mode, status, total_questions, started_at)
       VALUES ($1, $2, 'active', $3, NOW())
       RETURNING *`,
      [userId, mode, modeConfig.totalQuestions]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await query(
      'SELECT * FROM games WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async findByIdAndUser(id, userId) {
    const { rows } = await query(
      'SELECT * FROM games WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return rows[0] || null;
  },

  async getQuestions(gameId) {
    const { rows } = await query(
      `SELECT id, game_id, question_number, is_correct, points_awarded, elapsed_ms, used_hint, answered_at
       FROM game_questions
       WHERE game_id = $1
       ORDER BY question_number ASC`,
      [gameId]
    );
    return rows;
  },

  async addQuestion({ gameId, questionNumber, solution }) {
    const { rows } = await query(
      `INSERT INTO game_questions (game_id, question_number, solution_hash)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [gameId, questionNumber, solution.toString()]
    );
    return rows[0];
  },

  async recordAnswer({ questionId, answer, isCorrect, pointsAwarded, elapsedMs, usedHint }) {
    const { rows } = await query(
      `UPDATE game_questions
       SET submitted_answer = $1, is_correct = $2, points_awarded = $3,
           elapsed_ms = $4, used_hint = $5, answered_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [answer, isCorrect, pointsAwarded, elapsedMs || 0, usedHint || false, questionId]
    );
    return rows[0];
  },

  async markHintUsed(questionId) {
    await query(
      'UPDATE game_questions SET used_hint = true WHERE id = $1',
      [questionId]
    );
  },

  async complete({ gameId, correctAnswers, incorrectAnswers, unanswered, finalScore, durationSeconds }) {
    const { rows } = await query(
      `UPDATE games
       SET status = 'completed',
           completed_at = NOW(),
           correct_answers = $1,
           incorrect_answers = $2,
           unanswered_questions = $3,
           final_score = $4,
           duration_seconds = $5,
           score_verified = true
       WHERE id = $6
       RETURNING *`,
      [correctAnswers, incorrectAnswers, unanswered, finalScore, durationSeconds, gameId]
    );
    return rows[0];
  },

  async abandon(gameId) {
    await query(
      `UPDATE games SET status = 'abandoned', completed_at = NOW() WHERE id = $1`,
      [gameId]
    );
  },

  async getHistory({ userId, limit = 20, offset = 0 }) {
    const { rows } = await query(
      `SELECT id, mode, status, started_at, completed_at, total_questions,
              correct_answers, incorrect_answers, unanswered_questions,
              final_score, duration_seconds
       FROM games
       WHERE user_id = $1
       ORDER BY started_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return rows;
  },

  async countHistory(userId) {
    const { rows } = await query(
      'SELECT COUNT(*) FROM games WHERE user_id = $1',
      [userId]
    );
    return parseInt(rows[0].count, 10);
  },

  async getUserStats(userId) {
    const { rows } = await query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'completed') AS games_completed,
         COUNT(*) AS games_played,
         COALESCE(SUM(final_score) FILTER (WHERE status = 'completed'), 0) AS total_points,
         COALESCE(MAX(final_score), 0) AS best_score,
         COALESCE(
           ROUND(
             AVG(
               CASE WHEN total_questions > 0 THEN
                 correct_answers::numeric / total_questions * 100
               END
             ) FILTER (WHERE status = 'completed')
           ), 0
         ) AS avg_accuracy
       FROM games
       WHERE user_id = $1`,
      [userId]
    );
    return rows[0];
  },

  async getLeaderboard({ limit = 20, offset = 0 }) {
    const { rows } = await query(
      `SELECT
         u.id,
         u.display_name,
         u.username,
         COALESCE(SUM(g.final_score), 0) AS total_points,
         COALESCE(MAX(g.final_score), 0) AS best_score,
         COUNT(g.id) AS games_played,
         COALESCE(
           ROUND(AVG(
             CASE WHEN g.total_questions > 0 THEN
               g.correct_answers::numeric / g.total_questions * 100
             END
           )), 0
         ) AS avg_accuracy,
         RANK() OVER (
           ORDER BY COALESCE(SUM(g.final_score), 0) DESC,
                    COALESCE(MAX(g.final_score), 0) DESC
         ) AS rank
       FROM users u
       LEFT JOIN games g ON g.user_id = u.id AND g.status = 'completed' AND g.score_verified = true
       WHERE u.status = 'active' AND u.role = 'player'
       GROUP BY u.id, u.display_name, u.username
       ORDER BY total_points DESC, best_score DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return rows;
  },

  async getLeaderboardCount() {
    const { rows } = await query(
      `SELECT COUNT(DISTINCT u.id) FROM users u WHERE u.status = 'active' AND u.role = 'player'`
    );
    return parseInt(rows[0].count, 10);
  },

  async getUserRank(userId) {
    const { rows } = await query(
      `SELECT rank FROM (
         SELECT u.id, RANK() OVER (
           ORDER BY COALESCE(SUM(g.final_score), 0) DESC,
                    COALESCE(MAX(g.final_score), 0) DESC
         ) AS rank
         FROM users u
         LEFT JOIN games g ON g.user_id = u.id AND g.status = 'completed' AND g.score_verified = true
         WHERE u.status = 'active' AND u.role = 'player'
         GROUP BY u.id
       ) ranked
       WHERE id = $1`,
      [userId]
    );
    return rows[0]?.rank || null;
  },

  async getAdminStats() {
    const { rows } = await query(
      `SELECT
         (SELECT COUNT(*) FROM users) AS total_users,
         (SELECT COUNT(*) FROM users WHERE status = 'active') AS active_users,
         (SELECT COUNT(*) FROM games) AS total_games,
         (SELECT COUNT(*) FROM games WHERE status = 'completed') AS completed_games,
         (SELECT COALESCE(ROUND(AVG(
           CASE WHEN total_questions > 0 THEN correct_answers::numeric / total_questions * 100 END
         )), 0) FROM games WHERE status = 'completed') AS avg_accuracy,
         (SELECT COALESCE(MAX(final_score), 0) FROM games WHERE status = 'completed') AS highest_score`
    );
    return rows[0];
  },

  async getRecentGames({ limit = 10 }) {
    const { rows } = await query(
      `SELECT g.id, g.mode, g.status, g.final_score, g.started_at, g.completed_at,
              u.username, u.display_name
       FROM games g
       JOIN users u ON u.id = g.user_id
       ORDER BY g.started_at DESC
       LIMIT $1`,
      [limit]
    );
    return rows;
  },

  async getAllGames({ limit = 20, offset = 0 }) {
    const { rows } = await query(
      `SELECT g.id, g.mode, g.status, g.final_score, g.correct_answers,
              g.incorrect_answers, g.duration_seconds, g.started_at, g.completed_at,
              u.username, u.display_name
       FROM games g
       JOIN users u ON u.id = g.user_id
       ORDER BY g.started_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return rows;
  },
};

