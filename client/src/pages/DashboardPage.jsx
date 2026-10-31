// AI assistance: Google Gemini (Antigravity) helped scaffold the dashboard page.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Trophy, Target, Zap, Clock, Award, ArrowRight } from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { statsApi, gameApi } from '../services/api.js';
import { StatCard, SkeletonBlock, ErrorMessage, EmptyState, Badge } from '../components/ui/index.jsx';

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDuration(s) {
  if (!s && s !== 0) return '—';
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function statusBadge(status) {
  if (status === 'completed') return <Badge variant="success">Completed</Badge>;
  if (status === 'abandoned') return <Badge variant="error">Abandoned</Badge>;
  return <Badge variant="warning">Active</Badge>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats,   setStats]   = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [s, h] = await Promise.all([
        statsApi.getMe(),
        gameApi.getHistory(1, 5),
      ]);
      setStats(s);
      setHistory(h.games || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {user?.displayName}! 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">Here's your Banana Brain overview.</p>
        </div>
        <Link to="/game" className="btn-accent self-start sm:self-auto">
          <Gamepad2 className="w-4 h-4" /> Play Now
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadData} />}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} className="h-24" />)
        ) : (
          <>
            <StatCard label="Games Played"  value={stats?.games_played    || 0} icon={<Gamepad2 className="w-5 h-5" />} />
            <StatCard label="Total Points"  value={stats?.total_points    || 0} icon={<Zap      className="w-5 h-5" />} colorClass="text-amber-500" />
            <StatCard label="Best Score"    value={stats?.best_score      || 0} icon={<Trophy   className="w-5 h-5" />} colorClass="text-emerald-600" />
            <StatCard label="Avg Accuracy"  value={`${stats?.avg_accuracy || 0}%`} icon={<Target className="w-5 h-5" />} />
          </>
        )}
      </div>

      {/* Rank card */}
      {!loading && stats?.rank && (
        <div className="card bg-gradient-to-r from-violet-600 to-indigo-600 text-white mb-8 flex items-center justify-between">
          <div>
            <p className="text-violet-200 text-sm">Leaderboard Position</p>
            <p className="text-3xl font-bold mt-1">#{stats.rank}</p>
          </div>
          <Trophy className="w-12 h-12 text-amber-300 opacity-80" />
        </div>
      )}

      {/* Recent games */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" /> Recent Games
          </h2>
          <Link to="/history" className="text-sm text-violet-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonBlock key={i} className="h-14" />)}
          </div>
        ) : history.length === 0 ? (
          <EmptyState
            icon={<Gamepad2 className="w-12 h-12" />}
            title="No games yet"
            description="Start your first game to see your history here."
            action={<Link to="/game" className="btn-primary">Play your first game</Link>}
          />
        ) : (
          <div className="divide-y divide-slate-50">
            {history.map((g) => (
              <div key={g.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="flex items-center gap-2">
                    {statusBadge(g.status)}
                    <span className="text-sm font-medium text-slate-700 capitalize">{g.mode}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDate(g.started_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">{g.final_score ?? '—'} pts</p>
                  <p className="text-xs text-slate-400">{g.correct_answers}/{g.total_questions} correct</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievement teaser */}
      <div className="card mt-4 flex items-center gap-4">
        <Award className="w-8 h-8 text-amber-400 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold text-slate-800">Achievements</p>
          <p className="text-sm text-slate-500">Complete games to unlock achievements and earn bonus recognition.</p>
        </div>
        <Link to="/profile" className="btn-secondary text-xs">View</Link>
      </div>
    </AppLayout>
  );
}

