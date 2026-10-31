// AI assistance: Google Gemini (Antigravity) helped scaffold the profile/settings page.
import { useEffect, useState } from 'react';
import { User, Lock, LogOut } from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../hooks/useToast.jsx';
import { profileApi, authApi, statsApi } from '../services/api.js';
import { StatCard, SkeletonBlock } from '../components/ui/index.jsx';
import { Gamepad2, Trophy, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Section({ title, icon, children }) {
  return (
    <div className="card mb-6">
      <h2 className="flex items-center gap-2 font-semibold text-slate-800 mb-5">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const toast    = useToast();

  const [stats,         setStats]         = useState(null);
  const [displayName,   setDisplayName]   = useState(user?.displayName || '');
  const [saving,        setSaving]        = useState(false);
  const [pwdForm,       setPwdForm]       = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [pwdSaving,     setPwdSaving]     = useState(false);
  const [pwdError,      setPwdError]      = useState('');

  useEffect(() => {
    statsApi.getMe()
      .then(setStats)
      .catch(() => {});
  }, []);

  async function saveProfile(e) {
    e.preventDefault();
    if (!displayName.trim() || displayName.trim().length < 2) {
      toast('Display name must be at least 2 characters', 'warning');
      return;
    }
    setSaving(true);
    try {
      const updated = await profileApi.updateMe({ displayName: displayName.trim() });
      setUser((prev) => ({ ...prev, displayName: updated.displayName }));
      toast('Profile updated', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    setPwdError('');
    const { currentPassword, newPassword, confirmNewPassword } = pwdForm;
    if (!currentPassword || !newPassword) { setPwdError('Fill in all fields.'); return; }
    if (newPassword.length < 8) { setPwdError('New password must be at least 8 characters.'); return; }
    if (newPassword !== confirmNewPassword) { setPwdError('New passwords do not match.'); return; }
    setPwdSaving(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword, confirmNewPassword });
      toast('Password changed successfully', 'success');
      setPwdForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setPwdError(err.message);
    } finally {
      setPwdSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    toast('Logged out', 'success');
    navigate('/');
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">Profile & Settings</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats ? (
            <>
              <StatCard label="Games Played" value={stats.games_played || 0}  icon={<Gamepad2 className="w-5 h-5" />} />
              <StatCard label="Total Points" value={stats.total_points || 0}  icon={<Zap      className="w-5 h-5" />} colorClass="text-amber-500" />
              <StatCard label="Best Score"   value={stats.best_score   || 0}  icon={<Trophy   className="w-5 h-5" />} colorClass="text-emerald-600" />
              <StatCard label="Accuracy"     value={`${stats.avg_accuracy || 0}%`} icon={<Target className="w-5 h-5" />} />
            </>
          ) : (
            Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} className="h-20" />)
          )}
        </div>

        {/* Account info */}
        <Section title="Account Information" icon={<User className="w-4 h-4 text-slate-400" />}>
          <dl className="grid grid-cols-2 gap-y-4 text-sm">
            <dt className="text-slate-500">Username</dt>
            <dd className="font-medium text-slate-800">@{user?.username}</dd>
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium text-slate-800">{user?.email}</dd>
            <dt className="text-slate-500">Role</dt>
            <dd className="font-medium text-slate-800 capitalize">{user?.role}</dd>
            <dt className="text-slate-500">Member since</dt>
            <dd className="font-medium text-slate-800">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
            </dd>
          </dl>
        </Section>

        {/* Edit profile */}
        <Section title="Edit Profile" icon={<User className="w-4 h-4 text-slate-400" />}>
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="label">Display name</label>
              <input
                id="displayName" type="text" className="input"
                value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your public display name"
              />
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </Section>

        {/* Change password */}
        <Section title="Change Password" icon={<Lock className="w-4 h-4 text-slate-400" />}>
          <form onSubmit={changePassword} className="space-y-4">
            {pwdError && (
              <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl">
                {pwdError}
              </div>
            )}
            {['currentPassword', 'newPassword', 'confirmNewPassword'].map((field) => (
              <div key={field}>
                <label className="label" htmlFor={field}>
                  {field === 'currentPassword' ? 'Current password'
                    : field === 'newPassword' ? 'New password'
                    : 'Confirm new password'}
                </label>
                <input
                  id={field} type="password" className="input"
                  value={pwdForm[field]}
                  onChange={(e) => setPwdForm((p) => ({ ...p, [field]: e.target.value }))}
                />
              </div>
            ))}
            <button type="submit" disabled={pwdSaving} className="btn-primary">
              {pwdSaving ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </Section>

        {/* Logout */}
        <div className="card flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-800">Sign out</p>
            <p className="text-sm text-slate-500">End your current session.</p>
          </div>
          <button onClick={handleLogout} className="btn-danger">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

