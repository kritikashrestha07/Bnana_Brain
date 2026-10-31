// AI assistance: Google Gemini (Antigravity) helped scaffold this game page component.
// External puzzle API: http://marcconrad.com/uob/banana/api.php
// IMPORTANT: The Banana API returns the solution alongside the puzzle image. 
// We mitigate this by fetching on the backend only and never forwarding the solution to the client.
import { useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Gamepad2, Timer, CheckCircle, XCircle, Lightbulb, ArrowRight,
  RotateCcw, LayoutDashboard, Trophy, Loader2
} from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { gameApi } from '../services/api.js';
import { useCountdown } from '../hooks/useCountdown.js';
import { useToast } from '../hooks/useToast.jsx';
import { ErrorMessage, Badge } from '../components/ui/index.jsx';

// ── Mode selector ─────────────────────────────────────────────────────────────
const MODES = [
  { key: 'easy',   label: 'Easy',   questions: 5,  timer: 180, color: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
  { key: 'medium', label: 'Medium', questions: 10, timer: 120, color: 'border-violet-300 bg-violet-50 text-violet-800' },
  { key: 'hard',   label: 'Hard',   questions: 15, timer: 90,  color: 'border-red-300 bg-red-50 text-red-800' },
];

function ModeSelector({ onStart }) {
  const [selected, setSelected] = useState('medium');
  const [loading,  setLoading]  = useState(false);
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

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <Gamepad2 className="w-12 h-12 text-violet-600 mx-auto mb-3" />
        <h1 className="text-3xl font-bold text-slate-800">Banana Brain Challenge</h1>
        <p className="text-slate-500 mt-2">Decode banana puzzle images. Enter the missing digit (0–9).</p>
      </div>
      <div className="card">
        <h2 className="font-semibold text-slate-700 mb-4">Choose your mode</h2>
        <div className="space-y-3 mb-6">
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setSelected(m.key)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left
                ${selected === m.key ? m.color + ' border-2' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
            >
              <div>
                <p className="font-semibold">{m.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {m.questions} questions · {m.timer}s timer
                </p>
              </div>
              {selected === m.key && (
                <CheckCircle className="w-5 h-5 text-current flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 text-sm text-amber-800">
          <p className="font-medium mb-1">About the difficulty modes</p>
          <p>Difficulty here refers to timer length and question count — not puzzle complexity. All puzzles
            come from the same external Banana API. Speed bonuses and streak bonuses apply.</p>
        </div>
        <button
          onClick={handleStart}
          disabled={loading}
          className="btn-primary w-full py-3 text-base"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Starting…</> : <>Start Game <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );
}

// ── Active game ───────────────────────────────────────────────────────────────
function GameScreen({ gameState, onAnswer, onHint, onNext, onFinish, onTimeout }) {
  const { gameId, mode, totalQuestions, timerSeconds, questionNumber, questionId, imageData, result } = gameState;
  const [answer,     setAnswer]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [hintText,   setHintText]   = useState(null);
  const [hintUsed,   setHintUsed]   = useState(false);
  const answerRef = useRef(null);
  const toast = useToast();

  const { secondsLeft, isRunning, start } = useCountdown(timerSeconds, onTimeout);

  // Start timer when first rendered
  useState(() => { start(); });

  const timerPct = (secondsLeft / timerSeconds) * 100;
  const timerColor = secondsLeft <= 10 ? 'bg-red-500' : secondsLeft <= 30 ? 'bg-amber-400' : 'bg-emerald-500';

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
    <div className="max-w-2xl mx-auto">
      {/* Header strip */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Badge variant="info">Q {questionNumber}/{totalQuestions}</Badge>
          <span className="text-sm text-slate-500 capitalize">{mode} mode</span>
        </div>
        <div className={`flex items-center gap-2 text-sm font-semibold
          ${secondsLeft <= 10 ? 'text-red-600' : 'text-slate-700'}`}>
          <Timer className="w-4 h-4" />
          {secondsLeft}s
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Puzzle image */}
      <div className="card mb-4">
        <p className="text-xs text-slate-400 mb-3">
          Puzzle image — find the missing digit (0–9)
          <span className="ml-2 text-violet-400">
            (via marcconrad.com/uob/banana)
          </span>
        </p>

{imageData ? (
  <img
    src={imageData}
    alt="Banana number puzzle"
    className="w-full rounded-xl object-contain max-h-80"
    onError={(e) => {
      console.error('Puzzle image failed:', imageData);
      e.currentTarget.alt = 'Puzzle image failed to load. Check the browser console.';
    }}
  />
) : (
  <div className="bg-slate-50 rounded-xl h-48 flex items-center justify-center text-slate-400">
    Puzzle image loading…
  </div>
)}

      </div>

      {/* Hint */}
      {hintText && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-4 text-sm text-amber-800 flex items-start gap-2">
          <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{hintText}</span>
        </div>
      )}

      {/* Feedback after answer */}
      {result && (
        <div className={`rounded-xl px-5 py-4 mb-4 flex items-center gap-3
          ${result.isCorrect ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
          {result.isCorrect
            ? <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            : <XCircle     className="w-5 h-5 text-red-600 flex-shrink-0"     />}
          <div className="flex-1">
            <p className={`font-semibold ${result.isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
              {result.isCorrect ? `Correct! +${result.pointsAwarded} points` : 'Incorrect'}
            </p>
            {!result.isCorrect && (
              <p className="text-sm text-red-600 mt-0.5">The correct answer was: {result.correctAnswer}</p>
            )}
          </div>
        </div>
      )}

      {/* Answer form or Next / Finish */}
      {!result ? (
        <form onSubmit={handleSubmit} className="card flex gap-3">
          <div className="flex-1">
            <label htmlFor="answer" className="label">Your answer (0–9)</label>
            <input
              ref={answerRef}
              id="answer"
              type="number"
              min={0} max={9}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="input text-2xl font-bold text-center"
              placeholder="?"
              disabled={submitting}
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2 justify-end">
            <button type="submit" disabled={submitting || !answer} className="btn-primary py-2.5">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
            </button>
            <button type="button" onClick={handleHint} disabled={hintUsed}
              className="btn-secondary py-2.5 text-xs">
              <Lightbulb className="w-3 h-3" /> {hintUsed ? 'Used' : 'Hint'}
            </button>
          </div>
        </form>
      ) : result.gameComplete ? (
        <button onClick={onFinish} className="btn-primary w-full py-3 text-base">
          View Results <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <button onClick={handleNext} disabled={loadingNext} className="btn-primary w-full py-3">
          {loadingNext
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading next…</>
            : <>Next Puzzle <ArrowRight className="w-4 h-4" /></>}
        </button>
      )}
    </div>
  );
}

// ── Results screen ────────────────────────────────────────────────────────────
function ResultsScreen({ results, onPlayAgain, onDashboard }) {
  const { finalScore, correctAnswers, incorrectAnswers, unanswered, accuracy, durationSeconds } = results;
  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="card mb-6">
        <div className="text-6xl mb-4">{accuracy >= 80 ? '🏆' : accuracy >= 50 ? '🍌' : '😅'}</div>
        <h1 className="text-3xl font-bold text-slate-800 mb-1">{finalScore} points</h1>
        <p className="text-slate-500">Game complete!</p>

        <div className="grid grid-cols-2 gap-4 mt-6 text-left">
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-emerald-700">{correctAnswers}</p>
            <p className="text-xs text-emerald-600 mt-0.5">Correct</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-red-700">{incorrectAnswers}</p>
            <p className="text-xs text-red-600 mt-0.5">Incorrect</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-slate-700">{accuracy}%</p>
            <p className="text-xs text-slate-500 mt-0.5">Accuracy</p>
          </div>
          <div className="bg-violet-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-violet-700">
              {durationSeconds ? `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s` : '—'}
            </p>
            <p className="text-xs text-violet-600 mt-0.5">Duration</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-col sm:flex-row">
        <button onClick={onPlayAgain} className="btn-primary flex-1 py-3">
          <RotateCcw className="w-4 h-4" /> Play Again
        </button>
        <button onClick={onDashboard} className="btn-secondary flex-1 py-3">
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </button>
        <Link to="/leaderboard" className="btn-secondary flex-1 py-3 justify-center">
          <Trophy className="w-4 h-4" /> Leaderboard
        </Link>
      </div>
    </div>
  );
}

// ── Page orchestrator ─────────────────────────────────────────────────────────
export default function GamePage() {
  const navigate = useNavigate();
  const toast    = useToast();

  const [phase,     setPhase]     = useState('select'); // select | playing | results
  const [gameState, setGameState] = useState(null);
  const [results,   setResults]   = useState(null);
  const [error,     setError]     = useState(null);

  const startGame = useCallback(async (mode) => {
    setError(null);
    const data = await gameApi.start({ mode });
    setGameState({
      gameId:          data.gameId,
      mode:            data.mode,
      totalQuestions:  data.totalQuestions,
      timerSeconds:    data.timerSeconds,
      questionNumber:  data.questionNumber,
      questionId:      data.questionId,
      imageData:       data.imageData,
      result:          null,
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
      questionId:     data.questionId,
      imageData:      data.imageData,
      result:         null,
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
      {error && (
        <div className="max-w-lg mx-auto mb-6">
          <ErrorMessage message={error} onRetry={handlePlayAgain} />
        </div>
      )}
      {phase === 'select' && <ModeSelector onStart={startGame} />}
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
    </AppLayout>
  );
}

