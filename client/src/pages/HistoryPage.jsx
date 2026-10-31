// AI assistance: Google Gemini (Antigravity) helped scaffold game history page.
import { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { gameApi } from '../services/api.js';
import { SkeletonBlock, ErrorMessage, EmptyState, Pagination, Badge } from '../components/ui/index.jsx';
import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function statusBadge(status) {
  if (status === 'completed') return <Badge variant="success">Completed</Badge>;
  if (status === 'abandoned') return <Badge variant="error">Abandoned</Badge>;
  return <Badge variant="warning">Active</Badge>;
}

function modeBadge(mode) {
  const v = { easy: 'success', medium: 'info', hard: 'error' };
  return <Badge variant={v[mode] || 'neutral'} className="capitalize">{mode}</Badge>;
}

export default function HistoryPage() {
  const [data,    setData]    = useState(null);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

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

  useEffect(() => { load(page); }, [page]);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Clock className="w-7 h-7 text-violet-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Game History</h1>
            <p className="text-slate-500 text-sm">Your personal record of every game played.</p>
          </div>
        </div>

        {error && <ErrorMessage message={error} onRetry={() => load(page)} />}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonBlock key={i} className="h-20" />)}
          </div>
        ) : data?.games?.length === 0 ? (
          <EmptyState
            icon={<Gamepad2 className="w-12 h-12" />}
            title="No games yet"
            description="Your game history will appear here after you play."
            action={<Link to="/game" className="btn-primary">Play now</Link>}
          />
        ) : (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-left px-4 py-3">Mode</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Score</th>
                    <th className="text-right px-4 py-3">Correct</th>
                    <th className="text-right px-4 py-3">Accuracy</th>
                    <th className="text-right px-4 py-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.games.map((g) => {
                    const accuracy = g.total_questions > 0
                      ? Math.round((g.correct_answers / g.total_questions) * 100)
                      : 0;
                    const dur = g.duration_seconds
                      ? `${Math.floor(g.duration_seconds / 60)}m ${g.duration_seconds % 60}s`
                      : '—';
                    return (
                      <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 text-slate-600">{formatDate(g.started_at)}</td>
                        <td className="px-4 py-4">{modeBadge(g.mode)}</td>
                        <td className="px-4 py-4">{statusBadge(g.status)}</td>
                        <td className="px-4 py-4 text-right font-bold text-slate-800">{g.final_score ?? '—'}</td>
                        <td className="px-4 py-4 text-right text-slate-600">
                          <span className="text-emerald-600">{g.correct_answers ?? '—'}</span>
                          {' / '}
                          <span className="text-slate-400">{g.total_questions}</span>
                        </td>
                        <td className="px-4 py-4 text-right text-slate-600">{accuracy}%</td>
                        <td className="px-4 py-4 text-right text-slate-500">{dur}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Pagination
          page={page}
          totalPages={data?.pagination?.totalPages || 1}
          onPageChange={setPage}
        />
      </div>
    </AppLayout>
  );
}

