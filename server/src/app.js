// AI assistance: Google Gemini (Antigravity) helped scaffold this Express application.
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import rateLimit from 'express-rate-limit';

import { config } from './config/index.js';
import { pool } from './config/database.js';

import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import gamesRouter from './routes/games.js';
import leaderboardRouter from './routes/leaderboard.js';
import statsRouter from './routes/stats.js';
import adminRouter from './routes/admin.js';

const app = express();

// ── Trust proxy (required when behind nginx/reverse proxy in production) ──────
if (config.isProduction) app.set('trust proxy', 1);

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'same-site' },
}));

// ── CORS — only allow the configured frontend origin ─────────────────────────
app.use(cors({
  origin: config.cors.clientOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ── Session store ─────────────────────────────────────────────────────────────
const PgSession = connectPgSimple(session);
app.use(session({
  store: new PgSession({
    pool,
    tableName: 'sessions',
    createTableIfMissing: true,
  }),
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  name: 'bb.sid',
  cookie: {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'lax',
    maxAge: config.session.maxAge,
  },
}));

// ── Global rate limiting ──────────────────────────────────────────────────────
app.use('/api', rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please slow down.' },
}));

// Stricter limit on login
app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: config.rateLimit.loginMax,
  message: { success: false, error: 'Too many login attempts, please try again later.' },
}));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/games', gamesRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/stats', statsRouter);
app.use('/api/admin', adminRouter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  // Never expose stack traces to clients
  res.status(500).json({ success: false, error: 'Internal server error' });
});

export default app;

