
// AI assistance: Google Gemini (Antigravity) helped scaffold game history page.
import { useEffect, useState } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  Gamepad2,
  Trophy,
  Target,
  Zap,
  CalendarDays,
  Timer,
  History,
  Sparkles,
} from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { gameApi } from '../services/api.js';
import {
  SkeletonBlock,
  ErrorMessage,
  EmptyState,
  Pagination,
  Badge,
} from '../components/ui/index.jsx';
import { Link } from 'react-router-dom';

function formatDate(d) {
  if (!d) return '—';

  return new Date(d).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusBadge(status) {
  if (status === 'completed') {
    return <Badge variant="success">Completed</Badge>;
  }

  if (status === 'abandoned') {
    return <Badge variant="error">Abandoned</Badge>;
  }

  return <Badge variant="warning">Active</Badge>;
}

function modeBadge(mode) {
  const variants = {
    easy: 'success',
    medium: 'info',
    hard: 'error',
  };

  return (
    <Badge
      variant={variants[mode] || 'neutral'}
      className="capitalize"
    >
      {mode}
    </Badge>
  );
}

function SummaryCard({ label, value, icon: Icon, color, background }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${background}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>

      <p className="text-2xl font-extrabold text-slate-800 mt-4">
        {value}
      </p>

      <p className="text-xs font-medium text-slate-400 mt-1">
        {label}
      </p>
    </div>
  );
}

export default function HistoryPage() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load(p) {
    setLoading(true);
    setError(null);

    try {
      const res = await gameApi.getHistory(p, 15);
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(page);
  }, [page]);

  const games = data?.games || [];

  const completedGames = games.filter(
    (game) => game.status === 'completed'
  ).length;

  const totalPoints = games.reduce(
    (sum, game) => sum + (Number(game.final_score) || 0),
    0
  );

  const averageAccuracy = games.length
    ? Math.round(
        games.reduce((sum, game) => {
          const accuracy = game.total_questions > 0
            ? (game.correct_answers / game.total_questions) * 100
            : 0;

          return sum + accuracy;
        }, 0) / games.length
      )
    : 0;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Page heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-violet-600 text-xs font-bold uppercase tracking-wider mb-2">
              <History className="w-4 h-4" />
              Your activity
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Game History
            </h1>

            <p className="text-slate-500 text-sm mt-2">
              Review your previous games, scores and performance.
            </p>
          </div>

          <Link
            to="/game"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-md shadow-violet-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Gamepad2 className="w-4 h-4" />
            Play New Game
          </Link>
        </div>

        {/* Summary cards */}
        {!loading && !error && games.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              label="Games on this page"
              value={games.length}
              icon={Gamepad2}
              color="text-violet-600"
              background="bg-violet-50"
            />

            <SummaryCard
              label="Completed games"
              value={completedGames}
              icon={CheckCircle}
              color="text-emerald-600"
              background="bg-emerald-50"
            />

            <SummaryCard
              label="Points on this page"
              value={totalPoints}
              icon={Zap}
              color="text-amber-500"
              background="bg-amber-50"
            />

            <SummaryCard
              label="Average accuracy"
              value={`${averageAccuracy}%`}
              icon={Target}
              color="text-blue-600"
              background="bg-blue-50"
            />
          </div>
        )}

        {/* Loading summary placeholders */}
        {loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Error message */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => load(page)}
          />
        )}

        {/* History section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-800">
                Previous Games
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your recorded game sessions.
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-violet-600" />
            </div>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonBlock
                  key={i}
                  className="h-24 rounded-xl"
                />
              ))}
            </div>
          ) : data?.games?.length === 0 ? (
            <div className="py-12 px-5">
              <EmptyState
                icon={<Gamepad2 className="w-12 h-12" />}
                title="No games yet"
                description="Your game history will appear here after you play your first game."
                action={
                  <Link to="/game" className="btn-primary">
                    Play now
                  </Link>
                }
              />
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="text-left px-5 py-4">Game date</th>
                      <th className="text-left px-4 py-4">Difficulty</th>
                      <th className="text-left px-4 py-4">Status</th>
                      <th className="text-right px-4 py-4">Score</th>
                      <th className="text-right px-4 py-4">Correct</th>
                      <th className="text-right px-4 py-4">Accuracy</th>
                      <th className="text-right px-5 py-4">Duration</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {games.map((g) => {
                      const accuracy = g.total_questions > 0
                        ? Math.round(
                            (g.correct_answers / g.total_questions) * 100
                          )
                        : 0;

                      const dur = g.duration_seconds
                        ? `${Math.floor(g.duration_seconds / 60)}m ${g.duration_seconds % 60}s`
                        : '—';

                      return (
                        <tr
                          key={g.id}
                          className="hover:bg-violet-50/40 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                                <CalendarDays className="w-4 h-4 text-violet-600" />
                              </div>
                              <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
                                {formatDate(g.started_at)}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            {modeBadge(g.mode)}
                          </td>

                          <td className="px-4 py-4">
                            {statusBadge(g.status)}
                          </td>

                          <td className="px-4 py-4 text-right font-extrabold text-slate-800">
                            {g.final_score ?? '—'}
                          </td>

                          <td className="px-4 py-4 text-right">
                            <span className="text-emerald-600 font-bold">
                              {g.correct_answers ?? '—'}
                            </span>
                            <span className="text-slate-300"> / </span>
                            <span className="text-slate-400">
                              {g.total_questions}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-right">
                            <span className="text-slate-700 font-semibold">
                              {accuracy}%
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right text-slate-500 text-xs whitespace-nowrap">
                            {dur}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile and tablet game cards */}
              <div className="lg:hidden divide-y divide-slate-100">
                {games.map((g) => {
                  const accuracy = g.total_questions > 0
                    ? Math.round(
                        (g.correct_answers / g.total_questions) * 100
                      )
                    : 0;

                  const dur = g.duration_seconds
                    ? `${Math.floor(g.duration_seconds / 60)}m ${g.duration_seconds % 60}s`
                    : '—';

                  return (
                    <div
                      key={g.id}
                      className="p-5 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                            <Gamepad2 className="w-5 h-5 text-violet-600" />
                          </div>

                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 text-sm">
                              {g.mode?.charAt(0).toUpperCase() + g.mode?.slice(1) || 'Game'} Mode
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {formatDate(g.started_at)}
                            </p>
                          </div>
                        </div>

                        {statusBadge(g.status)}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">
                            Score
                          </p>
                          <p className="text-lg font-extrabold text-slate-800 mt-1">
                            {g.final_score ?? '—'}
                          </p>
                        </div>

                        <div className="bg-emerald-50 rounded-xl p-3">
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">
                            Correct
                          </p>
                          <p className="text-lg font-extrabold text-emerald-600 mt-1">
                            {g.correct_answers ?? '—'}
                            <span className="text-xs text-slate-400 font-medium">
                              {' / '}{g.total_questions}
                            </span>
                          </p>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-3">
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">
                            Accuracy
                          </p>
                          <p className="text-lg font-extrabold text-blue-600 mt-1">
                            {accuracy}%
                          </p>
                        </div>

                        <div className="bg-amber-50 rounded-xl p-3">
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">
                            Duration
                          </p>
                          <p className="text-lg font-extrabold text-amber-600 mt-1">
                            {dur}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {modeBadge(g.mode)}
                        <span className="text-xs text-slate-400">
                          Game #{g.id}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center">
          <Pagination
            page={page}
            totalPages={data?.pagination?.totalPages || 1}
            onPageChange={setPage}
          />
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pb-4">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          Keep playing to build your gaming history.
        </div>

      </div>
    </AppLayout>
  );
}
