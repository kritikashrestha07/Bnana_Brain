// AI assistance: Google Gemini (Antigravity) helped scaffold this game controller.
import { gameRepository } from '../repositories/gameRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { fetchBananaPuzzle } from '../services/bananaApiService.js';
import { calculateQuestionPoints, calculateGameStats, GAME_MODES } from '../services/scoringService.js';
import { success, error } from '../utils/response.js';

export const gameController = {
  async startGame(req, res) {
    const { mode } = req.body;
    const userId = req.session.userId;
    const modeConfig = GAME_MODES[mode] || GAME_MODES.medium;

    // Create game record
    const game = await gameRepository.create({ userId, mode });

    // Fetch first puzzle
    let puzzle;
    try {
      puzzle = await fetchBananaPuzzle();
    } catch (err) {
      await gameRepository.abandon(game.id);
      return error(res, `Could not load puzzle: ${err.message}`, 502);
    }

    // Store question in DB (solution stored server-side, never sent to client)
    const questionRecord = await gameRepository.addQuestion({
      gameId: game.id,
      questionNumber: 1,
      solution: puzzle.solution,
    });

    return success(res, {
      gameId: game.id,
      mode,
      totalQuestions: modeConfig.totalQuestions,
      timerSeconds: modeConfig.timerSeconds,
      questionNumber: 1,
      questionId: questionRecord.id,
      imageData: puzzle.question, // base64 data URI — solution NOT included
    }, 201);
  },

  async getCurrentQuestion(req, res) {
    const gameId = parseInt(req.params.id, 10);
    const userId = req.session.userId;

    const game = await gameRepository.findByIdAndUser(gameId, userId);
    if (!game) return error(res, 'Game not found', 404);
    if (game.status !== 'active') return error(res, 'This game is no longer active', 400);

    const questions = await gameRepository.getQuestions(gameId);
    const modeConfig = GAME_MODES[game.mode] || GAME_MODES.medium;

    // Find the latest unanswered question
    const currentQ = questions.find((q) => q.answered_at === null);
    if (!currentQ) {
      return error(res, 'No unanswered question found. Submit your answer or start next.', 400);
    }

    return success(res, {
      gameId,
      questionId: currentQ.id,
      questionNumber: currentQ.question_number,
      totalQuestions: modeConfig.totalQuestions,
      timerSeconds: modeConfig.timerSeconds,
      questionsAnswered: questions.filter((q) => q.answered_at !== null).length,
      // image is not re-sent; client keeps it from the initial fetch
    });
  },

  async nextQuestion(req, res) {
    const gameId = parseInt(req.params.id, 10);
    const userId = req.session.userId;

    const game = await gameRepository.findByIdAndUser(gameId, userId);
    if (!game) return error(res, 'Game not found', 404);
    if (game.status !== 'active') return error(res, 'This game is no longer active', 400);

    const questions = await gameRepository.getQuestions(gameId);
    const modeConfig = GAME_MODES[game.mode] || GAME_MODES.medium;
    const answeredCount = questions.filter((q) => q.answered_at !== null).length;

    if (answeredCount >= modeConfig.totalQuestions) {
      return error(res, 'All questions have been answered. Finish the game.', 400);
    }

    // Check no unanswered current question exists
    const hasUnanswered = questions.some((q) => q.answered_at === null);
    if (hasUnanswered) {
      return error(res, 'Please answer the current question first', 400);
    }

    const nextQuestionNumber = answeredCount + 1;

    // Fetch next puzzle
    let puzzle;
    try {
      puzzle = await fetchBananaPuzzle();
    } catch (err) {
      return error(res, `Could not load next puzzle: ${err.message}`, 502);
    }

    const questionRecord = await gameRepository.addQuestion({
      gameId,
      questionNumber: nextQuestionNumber,
      solution: puzzle.solution,
    });

    return success(res, {
      questionId: questionRecord.id,
      questionNumber: nextQuestionNumber,
      totalQuestions: modeConfig.totalQuestions,
      imageData: puzzle.question,
    });
  },

  async submitAnswer(req, res) {
    const gameId = parseInt(req.params.id, 10);
    const userId = req.session.userId;
    const { answer, elapsedMs } = req.body;

    const game = await gameRepository.findByIdAndUser(gameId, userId);
    if (!game) return error(res, 'Game not found', 404);
    if (game.status !== 'active') return error(res, 'This game is no longer active', 400);

    const questions = await gameRepository.getQuestions(gameId);
    const currentQ = questions.find((q) => q.answered_at === null);
    if (!currentQ) return error(res, 'No active question to answer', 400);

    // Prevent duplicate submission
    if (currentQ.answered_at !== null) {
      return error(res, 'This question has already been answered', 409);
    }

    // Compare answer against stored solution (never trust client)
    const isCorrect = parseInt(currentQ.solution_hash, 10) === answer;
    const streak = questions.filter((q, idx) => {
      const prev = questions[idx - 1];
      return q.is_correct && (!prev || prev.is_correct);
    }).length;

    const points = isCorrect
      ? calculateQuestionPoints(game.mode, elapsedMs, streak, currentQ.used_hint)
      : 0;

    const answered = await gameRepository.recordAnswer({
      questionId: currentQ.id,
      answer,
      isCorrect,
      pointsAwarded: points,
      elapsedMs,
      usedHint: currentQ.used_hint,
    });

    const modeConfig = GAME_MODES[game.mode] || GAME_MODES.medium;
    const allAnswered = questions.filter((q) => q.answered_at !== null).length + 1 >= modeConfig.totalQuestions;

    return success(res, {
      isCorrect,
      pointsAwarded: points,
      correctAnswer: isCorrect ? answer : parseInt(currentQ.solution_hash, 10), // reveal after answer
      gameComplete: allAnswered,
      questionsAnswered: questions.filter((q) => q.answered_at !== null).length + 1,
      totalQuestions: modeConfig.totalQuestions,
    });
  },

  async useHint(req, res) {
    const gameId = parseInt(req.params.id, 10);
    const userId = req.session.userId;

    const game = await gameRepository.findByIdAndUser(gameId, userId);
    if (!game) return error(res, 'Game not found', 404);
    if (game.status !== 'active') return error(res, 'This game is no longer active', 400);

    const questions = await gameRepository.getQuestions(gameId);
    const currentQ = questions.find((q) => q.answered_at === null);
    if (!currentQ) return error(res, 'No active question', 400);
    if (currentQ.used_hint) return error(res, 'Hint already used for this question', 409);

    await gameRepository.markHintUsed(currentQ.id);

    const modeConfig = GAME_MODES[game.mode] || GAME_MODES.medium;
    const solution = parseInt(currentQ.solution_hash, 10);
    // Hint: tell whether the answer is odd or even (helpful without revealing the solution)
    const hintText = solution % 2 === 0 ? 'The answer is an even number.' : 'The answer is an odd number.';

    return success(res, {
      hint: hintText,
      penalty: modeConfig.hintPenalty,
    });
  },

  async finishGame(req, res) {
    const gameId = parseInt(req.params.id, 10);
    const userId = req.session.userId;

    const game = await gameRepository.findByIdAndUser(gameId, userId);
    if (!game) return error(res, 'Game not found', 404);
    if (game.status !== 'active') return error(res, 'This game is not active', 400);

    const questions = await gameRepository.getQuestions(gameId);
    const stats = calculateGameStats(questions, game.mode);
    const durationSeconds = Math.round((Date.now() - new Date(game.started_at).getTime()) / 1000);

    const completed = await gameRepository.complete({
      gameId,
      correctAnswers: stats.correct,
      incorrectAnswers: stats.incorrect,
      unanswered: stats.unanswered,
      finalScore: stats.totalPoints,
      durationSeconds,
    });

    return success(res, {
      gameId,
      finalScore: stats.totalPoints,
      correctAnswers: stats.correct,
      incorrectAnswers: stats.incorrect,
      unanswered: stats.unanswered,
      accuracy: stats.accuracy,
      durationSeconds,
      status: 'completed',
    });
  },

  async getGame(req, res) {
    const gameId = parseInt(req.params.id, 10);
    const userId = req.session.userId;

    const game = await gameRepository.findByIdAndUser(gameId, userId);
    if (!game) return error(res, 'Game not found', 404);

    const questions = await gameRepository.getQuestions(gameId);
    return success(res, { game, questions });
  },

  async getHistory(req, res) {
    const userId = req.session.userId;
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [games, total] = await Promise.all([
      gameRepository.getHistory({ userId, limit: parseInt(limit, 10), offset }),
      gameRepository.countHistory(userId),
    ]);

    return success(res, {
      games,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  },

  async getLeaderboard(req, res) {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = Math.min(parseInt(limit, 10), 50);
    const offset = (pageNum - 1) * limitNum;

    const [entries, total] = await Promise.all([
      gameRepository.getLeaderboard({ limit: limitNum, offset }),
      gameRepository.getLeaderboardCount(),
    ]);

    let userRank = null;
    if (req.session?.userId) {
      userRank = await gameRepository.getUserRank(req.session.userId);
    }

    return success(res, {
      entries,
      userRank,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  },

  async getMyStats(req, res) {
    const userId = req.session.userId;
    const [stats, rank] = await Promise.all([
      gameRepository.getUserStats(userId),
      gameRepository.getUserRank(userId),
    ]);
    return success(res, { ...stats, rank });
  },
};

