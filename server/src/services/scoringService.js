// AI assistance: Google Gemini (Antigravity) helped draft this scoring service.

import { config } from '../config/index.js';

/**
 * Game modes and their configuration.
 * The Banana API provides puzzles of a single difficulty level.
 * "Easy", "Medium", and "Hard" modes here refer to configurable game parameters
 * (timer length, question count, scoring multipliers), NOT to puzzle difficulty.
 */
export const GAME_MODES = {
  easy: {
    label: 'Easy',
    totalQuestions: 5,
    timerSeconds: 180,
    multiplier: 1.0,
    hintPenalty: 1,
  },
  medium: {
    label: 'Medium',
    totalQuestions: 10,
    timerSeconds: 120,
    multiplier: 1.5,
    hintPenalty: 2,
  },
  hard: {
    label: 'Hard',
    totalQuestions: 15,
    timerSeconds: 90,
    multiplier: 2.0,
    hintPenalty: 3,
  },
};

/**
 * Calculate points awarded for a single correct answer.
 * @param {string} mode - Game mode key.
 * @param {number} elapsedMs - Time taken for this question in milliseconds.
 * @param {number} streak - Current correct-answer streak count (for bonus).
 * @param {boolean} usedHint - Whether the player used the hint.
 * @returns {number} Points awarded (never negative).
 */
export function calculateQuestionPoints(mode, elapsedMs, streak, usedHint) {
  const modeConfig = GAME_MODES[mode] || GAME_MODES.medium;
  const basePoints = config.game.pointsPerCorrect;
  const multiplier = modeConfig.multiplier;

  // Speed bonus: up to 5 extra points for answering in under 5 seconds
  let speedBonus = 0;
  if (typeof elapsedMs === 'number' && elapsedMs < 5000) {
    speedBonus = Math.floor(5 * (1 - elapsedMs / 5000));
  }

  // Streak bonus: +1 per consecutive correct answer, capped at maxStreakBonus
  const streakBonus = Math.min(streak, config.game.maxStreakBonus);

  let points = Math.round((basePoints + speedBonus + streakBonus) * multiplier);

  // Hint deduction
  if (usedHint) {
    points = Math.max(0, points - modeConfig.hintPenalty);
  }

  return points;
}

/**
 * Calculate final game statistics from an array of question records.
 */
export function calculateGameStats(questions, mode) {
  const modeConfig = GAME_MODES[mode] || GAME_MODES.medium;

  const correct = questions.filter(
    (q) => q.is_correct === true
  ).length;

  const incorrect = questions.filter(
    (q) => q.is_correct === false
  ).length;

  const unanswered = Math.max(
    0,
    modeConfig.totalQuestions - questions.length
  );

  const totalPoints = questions.reduce(
    (sum, q) => sum + Number(q.points_awarded || 0),
    0
  );

  const accuracy =
    questions.length > 0
      ? Math.round((correct / questions.length) * 100)
      : 0;

  return {
    correct,
    incorrect,
    unanswered,
    totalPoints,
    accuracy,
  };
}

