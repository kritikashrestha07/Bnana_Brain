-- AI assistance: Google Gemini (Antigravity) helped draft this schema.
-- Banana Brain — PostgreSQL Database Schema
-- Run this script to create all tables. Safe to re-run (uses IF NOT EXISTS).

-- ── Users ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  username        VARCHAR(30)  NOT NULL UNIQUE,
  display_name    VARCHAR(50)  NOT NULL,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            VARCHAR(20)  NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'admin')),
  status          VARCHAR(20)  NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  last_login_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_email    ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_users_role     ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_status   ON users (status);

-- ── Games ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS games (
  id                  SERIAL PRIMARY KEY,
  user_id             INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mode                VARCHAR(20)  NOT NULL DEFAULT 'medium' CHECK (mode IN ('easy', 'medium', 'hard')),
  status              VARCHAR(20)  NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  started_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  completed_at        TIMESTAMPTZ,
  total_questions     INTEGER      NOT NULL DEFAULT 10,
  correct_answers     INTEGER               DEFAULT 0,
  incorrect_answers   INTEGER               DEFAULT 0,
  unanswered_questions INTEGER              DEFAULT 0,
  final_score         INTEGER               DEFAULT 0,
  duration_seconds    INTEGER,
  score_verified      BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_games_user_id   ON games (user_id);
CREATE INDEX IF NOT EXISTS idx_games_status    ON games (status);
CREATE INDEX IF NOT EXISTS idx_games_started   ON games (started_at DESC);

-- ── Game Questions ────────────────────────────────────────────────────────────
-- solution_hash stores the correct answer (integer as text).
-- It is NEVER returned to the frontend before the player answers.
CREATE TABLE IF NOT EXISTS game_questions (
  id               SERIAL PRIMARY KEY,
  game_id          INTEGER      NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  question_number  INTEGER      NOT NULL,
  solution_hash    VARCHAR(10)  NOT NULL,       -- correct answer, server-side only
  submitted_answer INTEGER,
  is_correct       BOOLEAN,
  points_awarded   INTEGER      NOT NULL DEFAULT 0,
  elapsed_ms       INTEGER      NOT NULL DEFAULT 0,
  used_hint        BOOLEAN      NOT NULL DEFAULT FALSE,
  answered_at      TIMESTAMPTZ,
  UNIQUE (game_id, question_number)
);

CREATE INDEX IF NOT EXISTS idx_gq_game_id ON game_questions (game_id);

-- ── Achievements ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS achievements (
  id               SERIAL PRIMARY KEY,
  name             VARCHAR(100) NOT NULL UNIQUE,
  description      TEXT         NOT NULL,
  achievement_type VARCHAR(50)  NOT NULL,
  criteria         JSONB
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id        INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INTEGER      NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- ── Audit Logs ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id             SERIAL PRIMARY KEY,
  actor_user_id  INTEGER      REFERENCES users(id) ON DELETE SET NULL,
  action         VARCHAR(100) NOT NULL,
  target_type    VARCHAR(50),
  target_id      INTEGER,
  metadata       JSONB,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_actor  ON audit_logs (actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_time   ON audit_logs (created_at DESC);

-- ── Session store (created automatically by connect-pg-simple, listed here for reference) ─
-- CREATE TABLE IF NOT EXISTS "sessions" (
--   "sid"    varchar    NOT NULL COLLATE "default",
--   "sess"   json       NOT NULL,
--   "expire" timestamp(6) NOT NULL,
--   CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid")
-- );

