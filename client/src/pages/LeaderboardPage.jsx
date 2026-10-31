// AI assistance: Google Gemini (Antigravity) helped scaffold the leaderboard page.
import { useEffect, useState } from 'react';
import { Trophy, Medal } from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { leaderboardApi } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { SkeletonBlock, ErrorMessage, EmptyState, Pagination } from '../components/ui/index.jsx';

function RankIcon({ rank }) {
  if (rank === 1) return <span className="text-lg">🥇</span>;
  if (rank === 2) return <span className="text-lg">🥈</span>;
  if (rank === 3) return <span className="text-lg">🥉</span>;
  return <span className="text-sm font-bold text-slate-500">#{rank}</span>;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [data,    setData]    = useState(null);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

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

  useEffect(() => { load(page); }, [page]);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-8 h-8 text-amber-400" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Global Leaderboard</h1>
            <p className="text-slate-500 text-sm">Ranked by total verified points, then best score.</p>
          </div>
        </div>

        {/* User's rank callout */}
        {data?.userRank && (
          <div className="card bg-gradient-to-r from-violet-600 to-indigo-600 text-white mb-6 flex items-center justify-between">
            <div>
              <p className="text-violet-200 text-sm">Your global rank</p>
              <p className="text-3xl font-bold">#{data.userRank}</p>
            </div>
            <Medal className="w-10 h-10 text-amber-300" />
          </div>
        )}

        {error && <ErrorMessage message={error} onRetry={() => load(page)} />}

        <div className="card overflow-hidden p-0">
          {/* Table header */}
          <div className="grid grid-cols-[3rem_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-slate-50
            border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <span>Rank</span>
            <span>Player</span>
            <span className="text-right">Points</span>
            <span className="text-right">Best</span>
            <span className="text-right">Accuracy</span>
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 10 }).map((_, i) => <SkeletonBlock key={i} className="h-12" />)}
            </div>
          ) : data?.entries?.length === 0 ? (
            <EmptyState
              icon={<Trophy className="w-12 h-12" />}
              title="No rankings yet"
              description="Complete a game to appear on the leaderboard."
            />
          ) : (
            <div className="divide-y divide-slate-50">
              {data?.entries?.map((entry) => {
                const isMe = user && entry.username === user.username;
                return (
                  <div
                    key={entry.id}
                    className={`grid grid-cols-[3rem_1fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 transition-colors
                      ${isMe ? 'bg-violet-50' : 'hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center justify-center">
                      <RankIcon rank={parseInt(entry.rank)} />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${isMe ? 'text-violet-700' : 'text-slate-800'}`}>
                        {entry.display_name}
                        {isMe && <span className="ml-2 text-xs text-violet-500">(you)</span>}
                      </p>
                      <p className="text-xs text-slate-400">@{entry.username}</p>
                    </div>
                    <p className="text-right font-bold text-slate-800">{entry.total_points}</p>
                    <p className="text-right text-slate-600">{entry.best_score}</p>
                    <p className="text-right text-slate-600">{entry.avg_accuracy}%</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Pagination
          page={page}
          totalPages={data?.pagination?.totalPages || 1}
          onPageChange={setPage}
        />
      </div>
    </AppLayout>
  );
}

