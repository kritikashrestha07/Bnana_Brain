
// AI assistance: Google Gemini (Antigravity) helped scaffold this game page component.
// External puzzle API: http://marcconrad.com/uob/banana/api.php
// IMPORTANT: The Banana API returns the solution alongside the puzzle image.
// We mitigate this by fetching on the backend only and never forwarding the solution to the client.

import { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Gamepad2,
  Timer,
  CheckCircle,
  XCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  LayoutDashboard,
  Trophy,
  Loader2,
  Brain,
  Sparkles,
  Clock3,
  Target,
  Zap,
  Medal,
  Crown,
  Flame,
  CircleHelp,
  ShieldCheck,
  PartyPopper,
  ChevronRight,
} from 'lucide-react';

import { AppLayout } from '../layouts/AppLayout.jsx';
import { gameApi } from '../services/api.js';
import { useCountdown } from '../hooks/useCountdown.js';
import { useToast } from '../hooks/useToast.jsx';
import { ErrorMessage } from '../components/ui/index.jsx';

// ── Difficulty modes ─────────────────────────────────────────────────────────

const MODES = [
  {
    key: 'easy',
    label: 'Easy',
    description: 'A relaxed challenge to warm up your brain.',
    questions: 5,
    timer: 180,
    icon: ShieldCheck,
    theme: 'emerald',
    color: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    selectedRing: 'ring-emerald-200',
    iconBg: 'bg-emerald-100 text-emerald-700',
  },
  {
    key: 'medium',
    label: 'Medium',
    description: 'A balanced challenge for puzzle lovers.',
    questions: 10,
    timer: 120,
    icon: Brain,
    theme: 'violet',
    color: 'border-violet-300 bg-violet-50 text-violet-800',
    selectedRing: 'ring-violet-200',
    iconBg: 'bg-violet-100 text-violet-700',
  },
  {
    key: 'hard',
    label: 'Hard',
    description: 'Test your speed and sharpen your focus.',
    questions: 15,
    timer: 90,
    icon: Flame,
    theme: 'red',
    color: 'border-red-300 bg-red-50 text-red-800',
    selectedRing: 'ring-red-200',
    iconBg: 'bg-red-100 text-red-700',
  },
];

// ── Mode selector ─────────────────────────────────────────────────────────────

function ModeSelector({ onStart }) {
  const [selected, setSelected] = useState('medium');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleStart() {
    setLoading(true);
    try {
      await onStart(selected);
    } catch (err) {
      toast(err.message || 'Could not start game', 'error');
      setLoading(false);
    }
  }

  const selectedMode = MODES.find((mode) => mode.key === selected);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Welcome heading */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-indigo-700 to-purple-900 p-7 sm:p-10 mb-8 text-white shadow-xl shadow-violet-200">
        <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-20 bottom-0 w-32 h-32 rounded-full bg-purple-400/20 blur-2xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-3 py-1.5 text-xs font-semibold mb-5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            READY FOR A CHALLENGE?
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Banana Brain
              </h1>
              <p className="text-violet-200 text-sm font-medium">
                The Puzzle Challenge
              </p>
            </div>
          </div>

          <p className="text-violet-100 text-sm sm:text-base leading-relaxed max-w-xl mt-5">
            Put your brain to the test! Solve banana number puzzles, beat the
            clock, earn points and climb the leaderboard.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 text-sm">
              <Target className="w-4 h-4 text-amber-300" />
              <span>Test your logic</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 text-sm">
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Beat the timer</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 text-sm">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Earn rewards</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode selection */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <Brain className="w-5 h-5 text-violet-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Choose your difficulty
            </h2>
            <p className="text-sm text-slate-500">
              Select the challenge that suits you.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {MODES.map((mode) => {
          const ModeIcon = mode.icon;
          const isSelected = selected === mode.key;

          return (
            <button
              key={mode.key}
              type="button"
              onClick={() => setSelected(mode.key)}
              className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                isSelected
                  ? `${mode.color} ${mode.selectedRing} ring-4 shadow-md`
                  : 'border-slate-200 bg-white hover:border-violet-200'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${mode.iconBg}`}>
                <ModeIcon className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold mb-1">{mode.label}</h3>
              <p className={`text-xs leading-relaxed min-h-9 ${
                isSelected ? 'opacity-80' : 'text-slate-500'
              }`}>
                {mode.description}
              </p>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-current/10">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <CircleHelp className="w-3.5 h-3.5" />
                  {mode.questions} questions
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <Clock3 className="w-3.5 h-3.5" />
                  {mode.timer}s
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected mode information */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm mb-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-1">
              Before you start
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Difficulty affects the timer length and number of questions, not
              puzzle complexity. All puzzles come from the same external
              Banana API. Speed bonuses and streak bonuses apply.
            </p>
          </div>
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={handleStart}
        disabled={loading}
        className="group w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-violet-200 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Starting your game...
          </>
        ) : (
          <>
            <Gamepad2 className="w-5 h-5" />
            Start {selectedMode?.label} Challenge
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-400 mt-4">
        Make sure you're ready before starting. The timer begins with your first puzzle.
      </p>
    </div>
  );
}

// ── Active game ───────────────────────────────────────────────────────────────

function GameScreen({ gameState, onAnswer, onHint, onNext, onFinish, onTimeout }) {
  const {
    gameId,
    mode,
    totalQuestions,
    timerSeconds,
    questionNumber,
    questionId,
    imageData,
    result,
  } = gameState;

  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [hintText, setHintText] = useState(null);
  const [hintUsed, setHintUsed] = useState(false);

  const answerRef = useRef(null);
  const toast = useToast();

  const {
  secondsLeft,
  isRunning,
  start,
  pause,
  reset,
} = useCountdown(timerSeconds, onTimeout);

  // Start the timer whenever a new question loads
useEffect(() => {
  reset(timerSeconds);
  start();

  return () => {
    pause();
  };
}, [questionId]);

  const timerPct = (secondsLeft / timerSeconds) * 100;
  const timerColor =
    secondsLeft <= 10
      ? 'bg-red-500'
      : secondsLeft <= 30
        ? 'bg-amber-400'
        : 'bg-emerald-500';

  const timerTextColor =
    secondsLeft <= 10
      ? 'text-red-600'
      : secondsLeft <= 30
        ? 'text-amber-600'
        : 'text-emerald-700';

  async function handleSubmit(e) {
    e.preventDefault();

    const num = parseInt(answer, 10);

    if (isNaN(num) || num < 0 || num > 9) {
      toast('Enter a single digit (0–9)', 'warning');
      return;
    }

    setSubmitting(true);

    try {
      await onAnswer(num, questionId);
      setAnswer('');
      setHintText(null);
      setHintUsed(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleHint() {
    if (hintUsed) return;

    try {
      const data = await onHint();
      setHintText(data.hint);
      setHintUsed(true);
      toast(`Hint used (–${data.penalty} pts if correct)`, 'warning');
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  async function handleNext() {
    setLoadingNext(true);

    try {
      await onNext();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoadingNext(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Game header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-600">
              Banana Brain Challenge
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-xs font-semibold text-slate-500 capitalize">
              {mode} mode
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            Solve the puzzle
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Find the missing digit and submit your answer.
          </p>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-3 self-start sm:self-auto px-5 py-3 rounded-2xl border ${
          secondsLeft <= 10
            ? 'bg-red-50 border-red-200'
            : secondsLeft <= 30
              ? 'bg-amber-50 border-amber-200'
              : 'bg-white border-slate-200'
        }`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            secondsLeft <= 10
              ? 'bg-red-100'
              : secondsLeft <= 30
                ? 'bg-amber-100'
                : 'bg-emerald-50'
          }`}>
            <Timer className={`w-5 h-5 ${timerTextColor}`} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
              Time remaining
            </p>
            <p className={`text-2xl font-extrabold tabular-nums ${timerTextColor}`}>
              {secondsLeft}s
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm mb-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <p className="text-sm font-bold text-slate-800">
              Question {questionNumber} of {totalQuestions}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Keep going — you've got this!
            </p>
          </div>
          <span className="text-sm font-extrabold text-violet-700">
            {Math.round((questionNumber / totalQuestions) * 100)}%
          </span>
        </div>

        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock3 className="w-3.5 h-3.5" />
            <span>Question timer</span>
          </div>
          <span className={`text-xs font-bold ${timerTextColor}`}>
            {secondsLeft}s left
          </span>
        </div>

        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
            style={{ width: `${timerPct}%` }}
          />
        </div>
      </div>

      {/* Puzzle image */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-7 shadow-sm mb-5">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Brain className="w-5 h-5 text-violet-700" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Your puzzle</h2>
              <p className="text-xs text-slate-400">
                Study the image carefully
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
            <Sparkles className="w-3.5 h-3.5" />
            Brain challenge
          </span>
        </div>

        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3 sm:p-5 min-h-52 flex items-center justify-center overflow-hidden">
          {imageData ? (
            <img
              src={imageData}
              alt="Banana number puzzle"
              className="w-full rounded-xl object-contain max-h-96"
              onError={(e) => {
                console.error('Puzzle image failed:', imageData);
                e.currentTarget.alt = 'Puzzle image failed to load. Check the browser console.';
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-slate-400 py-12">
              <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
              <p className="text-sm font-medium">Loading your puzzle...</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
          <CircleHelp className="w-4 h-4 text-violet-500 flex-shrink-0" />
          Find the missing digit. Your answer must be between 0 and 9.
        </div>
      </div>

      {/* Hint */}
      {hintText && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 mb-5 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-900 mb-1">
              Here's a hint!
            </p>
            <p className="text-sm text-amber-800 leading-relaxed">
              {hintText}
            </p>
          </div>
        </div>
      )}

      {/* Answer feedback */}
      {result && (
        <div className={`rounded-2xl border p-5 mb-5 flex items-start gap-3 ${
          result.isCorrect
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
            result.isCorrect ? 'bg-emerald-100' : 'bg-red-100'
          }`}>
            {result.isCorrect ? (
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
          </div>

          <div className="flex-1">
            <p className={`font-bold text-lg ${
              result.isCorrect ? 'text-emerald-800' : 'text-red-800'
            }`}>
              {result.isCorrect
                ? `Correct! +${result.pointsAwarded} points`
                : 'Not quite!'}
            </p>

            {!result.isCorrect && (
              <p className="text-sm text-red-700 mt-1">
                The correct answer was: <strong>{result.correctAnswer}</strong>
              </p>
            )}

            {result.isCorrect && (
              <p className="text-sm text-emerald-700 mt-1">
                Excellent work! Keep your momentum going.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Answer form or next action */}
      {!result ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-violet-700" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Enter your answer</h2>
              <p className="text-xs text-slate-400">
                Choose a single digit from 0 to 9
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label
                htmlFor="answer"
                className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2"
              >
                Your answer
              </label>
              <input
                ref={answerRef}
                id="answer"
                type="number"
                min={0}
                max={9}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full h-14 rounded-xl border-2 border-slate-200 bg-slate-50 px-4 text-center text-3xl font-extrabold text-slate-800 outline-none transition-all focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:opacity-60"
                placeholder="?"
                disabled={submitting}
                autoFocus
              />
            </div>

            <div className="flex sm:flex-col gap-2 sm:justify-end sm:min-w-36">
              <button
                type="submit"
                disabled={submitting || !answer}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-violet-200 transition-all hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Submit
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleHint}
                disabled={hintUsed}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-700 transition-all hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lightbulb className="w-4 h-4" />
                {hintUsed ? 'Hint used' : 'Get hint'}
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-3">
            Remember: using a hint applies a points penalty if your answer is correct.
          </p>
        </form>
      ) : result.gameComplete ? (
        <button
          onClick={onFinish}
          className="group w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 px-6 text-white font-bold shadow-lg shadow-violet-200 transition-all hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700"
        >
          <Trophy className="w-5 h-5 text-amber-300" />
          View Game Results
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      ) : (
        <button
          onClick={handleNext}
          disabled={loadingNext}
          className="group w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 px-6 text-white font-bold shadow-lg shadow-violet-200 transition-all hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-60"
        >
          {loadingNext ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading next puzzle...
            </>
          ) : (
            <>
              Next Puzzle
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

// ── Results screen ────────────────────────────────────────────────────────────

function ResultsScreen({ results, onPlayAgain, onDashboard }) {
  const {
    finalScore,
    correctAnswers,
    incorrectAnswers,
    unanswered,
    accuracy,
    durationSeconds,
  } = results;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Celebration header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-indigo-700 to-purple-900 p-7 sm:p-10 text-center text-white shadow-xl shadow-violet-200 mb-6">
        <div className="absolute -top-16 -right-12 w-52 h-52 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 -left-12 w-52 h-52 rounded-full bg-purple-400/20 blur-2xl" />

        <div className="relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-white/15 border border-white/20 flex items-center justify-center mx-auto mb-5">
            {accuracy >= 80 ? (
              <Trophy className="w-10 h-10 text-amber-300" />
            ) : accuracy >= 50 ? (
              <Medal className="w-10 h-10 text-amber-300" />
            ) : (
              <PartyPopper className="w-10 h-10 text-amber-300" />
            )}
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-3 py-1.5 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            CHALLENGE COMPLETED
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
            {accuracy >= 80
              ? 'Amazing work!'
              : accuracy >= 50
                ? 'Well played!'
                : 'Keep practising!'}
          </h1>

          <p className="text-violet-200 text-sm mb-6">
            You've completed your Banana Brain challenge.
          </p>

          <div className="inline-flex flex-col items-center rounded-2xl bg-white/10 border border-white/20 px-10 py-5">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-200 mb-1">
              Your final score
            </p>
            <p className="text-5xl sm:text-6xl font-extrabold text-white tabular-nums">
              {finalScore}
            </p>
            <p className="text-sm text-violet-200 mt-1">points earned</p>
          </div>
        </div>
      </div>

      {/* Performance summary */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-800 mb-1">
          Your performance
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Here's how you performed in this challenge.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-700">
              {correctAnswers}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Correct</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center mb-3">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-extrabold text-red-700">
              {incorrectAnswers}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Incorrect</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center mb-3">
              <Target className="w-5 h-5 text-violet-600" />
            </div>
            <p className="text-2xl font-extrabold text-violet-700">
              {accuracy}%
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Accuracy</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
              <Clock3 className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-extrabold text-amber-700">
              {durationSeconds
                ? `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`
                : '—'}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Duration</p>
          </div>
        </div>
      </div>

      {/* Accuracy summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="font-bold text-slate-800">Accuracy rate</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Your correct answers compared to the total.
            </p>
          </div>
          <span className="text-xl font-extrabold text-violet-700">
            {accuracy}%
          </span>
        </div>

        <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
            style={{ width: `${accuracy}%` }}
          />
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {correctAnswers} correct
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            {incorrectAnswers} incorrect
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            {unanswered} unanswered
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={onPlayAgain}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700"
        >
          <RotateCcw className="w-4 h-4" />
          Play Again
        </button>

        <button
          onClick={onDashboard}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition-all hover:border-violet-200 hover:bg-violet-50"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>

        <Link
          to="/leaderboard"
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition-all hover:border-amber-200 hover:bg-amber-50"
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          Leaderboard
        </Link>
      </div>
    </div>
  );
}

// ── Page orchestrator ─────────────────────────────────────────────────────────

export default function GamePage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [phase, setPhase] = useState('select'); // select | playing | results
  const [gameState, setGameState] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const startGame = useCallback(async (mode) => {
    setError(null);

    const data = await gameApi.start({ mode });

    setGameState({
      gameId: data.gameId,
      mode: data.mode,
      totalQuestions: data.totalQuestions,
      timerSeconds: data.timerSeconds,
      questionNumber: data.questionNumber,
      questionId: data.questionId,
      imageData: data.imageData,
      result: null,
    });

    setPhase('playing');
  }, []);

  const handleAnswer = useCallback(async (answer) => {
    const data = await gameApi.submitAnswer(gameState.gameId, {
      answer,
      elapsedMs: 0, // client-side timing; server validates with timestamps
    });

    setGameState((prev) => ({ ...prev, result: data }));
  }, [gameState]);

  const handleHint = useCallback(async () => {
    return await gameApi.useHint(gameState.gameId);
  }, [gameState]);

  const handleNext = useCallback(async () => {
    const data = await gameApi.nextQuestion(gameState.gameId);

    setGameState({
      ...gameState,
      questionNumber: data.questionNumber,
      questionId: data.questionId,
      imageData: data.imageData,
      result: null,
    });
  }, [gameState]);

  const handleFinish = useCallback(async () => {
    const data = await gameApi.finishGame(gameState.gameId);

    setResults(data);
    setPhase('results');

    toast('Game saved! Your score has been recorded.', 'success');
  }, [gameState, toast]);

  const handleTimeout = useCallback(async () => {
    toast('Time is up! Game ended.', 'warning');

    if (gameState) {
      try {
        const data = await gameApi.finishGame(gameState.gameId);
        setResults(data);
        setPhase('results');
      } catch (err) {
        setError(err.message);
      }
    }
  }, [gameState, toast]);

  const handlePlayAgain = useCallback(() => {
    setGameState(null);
    setResults(null);
    setPhase('select');
  }, []);

  return (
    <AppLayout>
      <div className="min-h-[70vh] py-2">
        {error && (
          <div className="max-w-lg mx-auto mb-6">
            <ErrorMessage message={error} onRetry={handlePlayAgain} />
          </div>
        )}

        {phase === 'select' && (
          <ModeSelector onStart={startGame} />
        )}

        {phase === 'playing' && gameState && (
          <GameScreen
            gameState={gameState}
            onAnswer={handleAnswer}
            onHint={handleHint}
            onNext={handleNext}
            onFinish={handleFinish}
            onTimeout={handleTimeout}
          />
        )}

        {phase === 'results' && results && (
          <ResultsScreen
            results={results}
            onPlayAgain={handlePlayAgain}
            onDashboard={() => navigate('/dashboard')}
          />
        )}
      </div>
    </AppLayout>
  );
}
