
// AI assistance: Google Gemini (Antigravity) helped scaffold the leaderboard page.
import { useEffect, useState } from 'react';
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Target,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { leaderboardApi } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.jsx';
import {
  SkeletonBlock,
  ErrorMessage,
  EmptyState,
  Pagination,
} from '../components/ui/index.jsx';

function RankIcon({ rank }) {
  if (rank === 1) {
    return (
      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
        <span className="text-xl">🥇</span>
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
        <span className="text-xl">🥈</span>
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
        <span className="text-xl">🥉</span>
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
      <span className="text-sm font-bold text-slate-500">#{rank}</span>
    </div>
  );
}

function TopPlayerCard({ entry, position }) {
  const styles = {
    1: {
      card: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/20',
      icon: 'bg-white/20 text-white',
      label: 'CHAMPION',
    },
    2: {
      card: 'bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-slate-500/20',
      icon: 'bg-white/20 text-white',
      label: 'RUNNER UP',
    },
    3: {
      card: 'bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-orange-500/20',
      icon: 'bg-white/20 text-white',
      label: 'THIRD PLACE',
    },
  };

  const style = styles[position];

  return (
    <div className={`relative rounded-2xl p-5 shadow-lg overflow-hidden ${style.card} ${position === 1 ? 'sm:-translate-y-3' : ''}`}>
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <span className="text-[10px] font-extrabold tracking-widest opacity-80">
            {style.label}
          </span>
          {position === 1 ? (
            <Crown className="w-6 h-6" />
          ) : (
            <Medal className="w-6 h-6" />
          )}
        </div>

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-extrabold mb-4 ${style.icon}`}>
          {entry.display_name?.charAt(0)?.toUpperCase() || '?'}
        </div>

        <h3 className="font-extrabold text-lg truncate">
          {entry.display_name}
        </h3>

        <p className="text-xs opacity-75 mt-0.5 truncate">
          @{entry.username}
        </p>

        <div className="mt-5 pt-4 border-t border-white/20 flex items-center justify-between">
          <span className="text-xs font-medium opacity-80">Total points</span>
          <span className="text-xl font-extrabold">
            {entry.total_points}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load(p) {
    setLoading(true);
    setError(null);

    try {
      const res = await leaderboardApi.get(p, 20);
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

  const entries = data?.entries || [];
  const topThree = page === 1 ? entries.slice(0, 3) : [];
  const remainingEntries = page === 1 ? entries.slice(3) : entries;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Page heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-violet-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Trophy className="w-4 h-4" />
              Player rankings
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Global Leaderboard
            </h1>

            <p className="text-slate-500 text-sm mt-2">
              Compete with players and climb your way to the top.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-50 border border-violet-100 text-violet-700 text-xs font-bold w-fit">
            <TrendingUp className="w-4 h-4" />
            Global rankings
          </div>
        </div>

        {/* Personal ranking */}
        {data?.userRank && (
          <div className="relative bg-gradient-to-r from-violet-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-lg shadow-violet-900/10">
            <div className="absolute -right-12 -top-16 w-64 h-64 rounded-full bg-violet-400/20 blur-2xl" />
            <div className="absolute -bottom-16 left-1/3 w-52 h-52 rounded-full bg-amber-300/10 blur-2xl" />

            <div className="relative z-10 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-violet-200 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Your current position
                </div>

                <p className="text-4xl sm:text-5xl font-extrabold mt-3">
                  #{data.userRank}
                </p>

                <p className="text-violet-200 text-sm mt-2">
                  Keep playing to improve your global ranking!
                </p>
              </div>

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                <Medal className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300" />
              </div>
            </div>
          </div>
        )}

        {/* Ranking explanation */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">First priority</p>
              <p className="text-sm font-bold text-slate-800">Total points</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Second priority</p>
              <p className="text-sm font-bold text-slate-800">Best score</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Performance</p>
              <p className="text-sm font-bold text-slate-800">Accuracy</p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => load(page)}
          />
        )}

        {/* Top three players */}
        {!loading && !error && topThree.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Crown className="w-5 h-5 text-amber-500" />
              <div>
                <h2 className="font-bold text-slate-800">
                  Top performers
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  The highest-ranked players.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 items-end">
              {topThree.map((entry) => (
                <TopPlayerCard
                  key={entry.id}
                  entry={entry}
                  position={parseInt(entry.rank, 10)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800">
                Player Rankings
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {loading ? 'Loading player rankings...' : 'See how every player is performing.'}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-500" />
            </div>
          </div>

          {/* Desktop table header */}
          <div className="hidden md:grid grid-cols-[4rem_minmax(0,1.5fr)_1fr_1fr_1fr] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Rank</span>
            <span>Player</span>
            <span className="text-right">Points</span>
            <span className="text-right">Best score</span>
            <span className="text-right">Accuracy</span>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonBlock key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : data?.entries?.length === 0 ? (
            <EmptyState
              icon={<Trophy className="w-12 h-12" />}
              title="No rankings yet"
              description="Complete a game to appear on the leaderboard."
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {remainingEntries.map((entry) => {
                const isMe = user && entry.username === user.username;

                return (
                  <div
                    key={entry.id}
                    className={`grid grid-cols-[2.75rem_minmax(0,1fr)] md:grid-cols-[4rem_minmax(0,1.5fr)_1fr_1fr_1fr] gap-3 md:gap-4 items-center px-4 sm:px-6 py-4 transition-colors ${
                      isMe
                        ? 'bg-violet-50/80 border-l-4 border-l-violet-500'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <RankIcon rank={parseInt(entry.rank, 10)} />
                    </div>

                    <div className="min-w-0">
                      <p className={`font-bold text-sm truncate ${
                        isMe ? 'text-violet-700' : 'text-slate-800'
                      }`}>
                        {entry.display_name}
                        {isMe && (
                          <span className="ml-2 text-[10px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-bold">
                            YOU
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 truncate">
                        @{entry.username}
                      </p>

                      {/* Mobile-only player stats */}
                      <div className="flex md:hidden items-center gap-3 mt-2 text-xs">
                        <span className="font-bold text-slate-700">
                          {entry.total_points} pts
                        </span>
                        <span className="text-slate-400">
                          Best: {entry.best_score}
                        </span>
                        <span className="text-slate-400">
                          {entry.avg_accuracy}%
                        </span>
                      </div>
                    </div>

                    <p className="hidden md:block text-right font-extrabold text-slate-800">
                      {entry.total_points}
                    </p>

                    <p className="hidden md:block text-right text-sm font-medium text-slate-600">
                      {entry.best_score}
                    </p>

                    <p className="hidden md:block text-right text-sm font-semibold text-emerald-600">
                      {entry.avg_accuracy}%
                    </p>
                  </div>
                );
              })}
            </div>
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

        <p className="text-center text-xs text-slate-400 pb-4">
          Rankings are ordered by total verified points, then best score.
        </p>

      </div>
    </AppLayout>
  );
}
