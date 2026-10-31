
// Banana Brain - Redesigned Dashboard
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Gamepad2,
  Trophy,
  Target,
  Zap,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Crown,
  Medal
} from 'lucide-react';

import { AppLayout } from '../layouts/AppLayout.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { statsApi, gameApi } from '../services/api.js';
import {
  StatCard,
  SkeletonBlock,
  ErrorMessage,
  EmptyState,
  Badge
} from '../components/ui/index.jsx';

function formatDate(d) {
  if (!d) return '—';

  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
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

export default function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const [s, h] = await Promise.all([
        statsApi.getMe(),
        gameApi.getHistory(1, 5)
      ]);

      setStats(s);
      setHistory(h.games || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const displayName = user?.displayName || 'Player';

  return (
    <AppLayout>

      <div className="space-y-7">

        {/* Welcome banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 p-6 sm:p-9 text-white shadow-xl shadow-violet-200/50">

          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '30px 30px'
            }}
          />

          <div className="absolute -right-12 -top-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-40 -bottom-32 w-64 h-64 rounded-full bg-purple-400/20 blur-3xl" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">

            <div className="max-w-xl">

              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full text-xs font-semibold text-violet-100 mb-4">
                <Sparkles className="w-4 h-4 text-amber-300" />
                YOUR PERSONAL GAME DASHBOARD
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                Welcome back, {displayName}!
              </h1>

              <p className="text-violet-200 text-sm sm:text-base mt-3 leading-relaxed">
                Ready to challenge your mind? Solve puzzles, earn points
                and work your way up the leaderboard.
              </p>

              <Link
                to="/game"
                className="inline-flex items-center gap-2 mt-6 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5"
              >
                <Gamepad2 className="w-5 h-5" />
                Play Now
                <ArrowRight className="w-4 h-4" />
              </Link>

            </div>

            <div className="hidden sm:flex w-36 h-36 lg:w-44 lg:h-44 shrink-0 rounded-full bg-white/10 border border-white/15 items-center justify-center">

              <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-full bg-white/10 flex items-center justify-center">
                <BrainIcon />
              </div>

            </div>

          </div>

        </section>

        {/* Error message */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={loadData}
          />
        )}

        {/* Statistics heading */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">
              Your Performance
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              A snapshot of your gaming progress.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-full">
            <TrendingUp className="w-4 h-4" />
            Your statistics
          </div>
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">

          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBlock
                key={i}
                className="h-32 rounded-2xl"
              />
            ))
          ) : (
            <>
              <StatCard
                label="Games Played"
                value={stats?.games_played || 0}
                icon={<Gamepad2 className="w-6 h-6" />}
                colorClass="text-violet-600"
              />

              <StatCard
                label="Total Points"
                value={stats?.total_points || 0}
                icon={<Zap className="w-6 h-6" />}
                colorClass="text-amber-500"
              />

              <StatCard
                label="Best Score"
                value={stats?.best_score || 0}
                icon={<Trophy className="w-6 h-6" />}
                colorClass="text-emerald-600"
              />

              <StatCard
                label="Avg Accuracy"
                value={`${stats?.avg_accuracy || 0}%`}
                icon={<Target className="w-6 h-6" />}
                colorClass="text-blue-600"
              />
            </>
          )}

        </div>

        {/* Leaderboard position */}
        {!loading && stats?.rank && (
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-300 p-5 sm:p-7 shadow-lg shadow-amber-100">

            <div className="absolute -right-8 -top-12 w-48 h-48 rounded-full bg-white/20" />

            <div className="relative flex items-center justify-between gap-4">

              <div>
                <div className="flex items-center gap-2 text-amber-950/70 text-sm font-bold">
                  <Crown className="w-5 h-5" />
                  LEADERBOARD POSITION
                </div>

                <p className="text-4xl sm:text-5xl font-extrabold text-amber-950 mt-2">
                  #{stats.rank}
                </p>

                <p className="text-sm text-amber-950/70 mt-1">
                  Keep playing and climb the rankings!
                </p>

                <Link
                  to="/leaderboard"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-amber-950 hover:underline"
                >
                  View leaderboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/30 flex items-center justify-center shrink-0">
                <Trophy className="w-12 h-12 sm:w-14 sm:h-14 text-amber-950" />
              </div>

            </div>

          </section>
        )}

        {/* Recent activity */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          <div className="flex items-center justify-between gap-3 p-5 sm:p-6 border-b border-slate-100">

            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-violet-600" />
                </div>

                <h2 className="font-extrabold text-slate-800">
                  Recent Games
                </h2>
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Your latest gaming activity.
              </p>
            </div>

            <Link
              to="/history"
              className="inline-flex items-center gap-1 text-sm font-bold text-violet-700 hover:text-violet-900"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>

          </div>

          <div className="p-5 sm:p-6">

            {loading ? (

              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonBlock
                    key={i}
                    className="h-16 rounded-xl"
                  />
                ))}
              </div>

            ) : history.length === 0 ? (

              <EmptyState
                icon={<Gamepad2 className="w-12 h-12" />}
                title="No games played yet"
                description="Your gaming activity will appear here once you complete your first challenge."
                action={
                  <Link to="/game" className="btn-primary">
                    Start your first game
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                }
              />

            ) : (

              <div className="space-y-3">

                {history.map((g, index) => (

                  <div
                    key={g.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/40 transition-colors"
                  >

                    <div className="flex items-center gap-3">

                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        index === 0
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-violet-50 text-violet-600'
                      }`}>
                        {index === 0
                          ? <Medal className="w-5 h-5" />
                          : <Gamepad2 className="w-5 h-5" />
                        }
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          {statusBadge(g.status)}

                          <span className="text-sm font-bold text-slate-700 capitalize">
                            {g.mode} Mode
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 mt-1">
                          {formatDate(g.started_at)}
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-8">

                      <div className="text-left sm:text-right">
                        <p className="text-lg font-extrabold text-slate-800">
                          {g.final_score ?? '—'}
                          <span className="text-xs font-medium text-slate-400 ml-1">pts</span>
                        </p>

                        <p className="text-xs text-slate-400">
                          {g.correct_answers}/{g.total_questions} correct
                        </p>
                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </section>

        {/* Achievement card */}
        <section className="relative overflow-hidden bg-gradient-to-r from-white to-amber-50 border border-amber-100 rounded-2xl p-5 sm:p-6">

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
              <Award className="w-8 h-8 text-amber-600" />
            </div>

            <div className="flex-1">
              <h3 className="font-extrabold text-slate-800">
                Unlock Your Achievements
              </h3>

              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Complete games, improve your scores and earn recognition
                for your puzzle-solving skills.
              </p>
            </div>

            <Link
              to="/profile"
              className="btn-secondary self-start sm:self-auto whitespace-nowrap"
            >
              View Profile
              <ArrowRight className="w-4 h-4" />
            </Link>

          </div>

        </section>

      </div>

    </AppLayout>
  );
}

function BrainIcon() {
  return (
    <div className="relative">
      <Brain className="w-16 h-16 text-amber-300" />
      <Sparkles className="w-6 h-6 text-white absolute -top-3 -right-4" />
    </div>
  );
}
