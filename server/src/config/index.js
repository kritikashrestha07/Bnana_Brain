// AI assistance: Google Gemini (Antigravity) helped scaffold this configuration module.
// Reviewed and adapted for this project.
import dotenv from 'dotenv';
dotenv.config();

function requireEnv(key) {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'banana_brain',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },

  session: {
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  cors: {
    clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  },

  bananaApi: {
    baseUrl: process.env.BANANA_API_BASE_URL || 'http://marcconrad.com/uob/banana/api.php',
    timeoutMs: parseInt(process.env.BANANA_API_TIMEOUT_MS || '8000', 10),
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    loginMax: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '10', 10),
  },

  game: {
    defaultQuestions: 10,
    defaultTimerSeconds: 120,
    pointsPerCorrect: 10,
    hintPenalty: 2,
    maxStreakBonus: 5,
  },
};

