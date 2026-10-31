
// AI assistance: Google Gemini (Antigravity) helped scaffold the profile/settings page.
import { useEffect, useState } from 'react';
import {
  User,
  Lock,
  LogOut,
  Gamepad2,
  Trophy,
  Target,
  Zap,
  Mail,
  CalendarDays,
  ShieldCheck,
  Settings,
  Save,
  KeyRound,
  Sparkles,
  Crown,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../hooks/useToast.jsx';
import { profileApi, authApi, statsApi } from '../services/api.js';
import { SkeletonBlock } from '../components/ui/index.jsx';

function Section({ title, description, icon, children }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
      <div className="flex items-start gap-3 px-6 py-5 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="font-bold text-slate-800">{title}</h2>
          {description && (
            <p className="text-xs text-slate-400 mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </section>
  );
}

function ProfileStat({ label, value, icon: Icon, color, background }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
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

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [stats, setStats] = useState(null);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);

  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState('');

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
      const updated = await profileApi.updateMe({
        displayName: displayName.trim(),
      });

      setUser((prev) => ({
        ...prev,
        displayName: updated.displayName,
      }));

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

    const {
      currentPassword,
      newPassword,
      confirmNewPassword,
    } = pwdForm;

    if (!currentPassword || !newPassword) {
      setPwdError('Fill in all fields.');
      return;
    }

    if (newPassword.length < 8) {
      setPwdError('New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPwdError('New passwords do not match.');
      return;
    }

    setPwdSaving(true);

    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      toast('Password changed successfully', 'success');

      setPwdForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
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

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-100';

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Page heading */}
        <div>
          <div className="flex items-center gap-2 text-violet-600 text-xs font-bold uppercase tracking-wider mb-2">
            <Settings className="w-4 h-4" />
            Account settings
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Profile & Settings
          </h1>

          <p className="text-slate-500 text-sm mt-2">
            Manage your personal information, account security and gaming activity.
          </p>
        </div>

        {/* Profile hero */}
        <div className="relative bg-gradient-to-r from-violet-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-lg shadow-violet-900/10">
          <div className="absolute -top-20 -right-16 w-72 h-72 bg-violet-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 w-64 h-64 bg-amber-300/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-inner shrink-0">
              <User className="w-10 h-10 text-amber-300" />
            </div>

            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-extrabold">
                  {user?.displayName || user?.username || 'Player'}
                </h2>

                {user?.role === 'admin' && (
                  <span className="inline-flex items-center gap-1 bg-amber-300/20 text-amber-200 border border-amber-300/30 px-2.5 py-1 rounded-full text-xs font-bold">
                    <Crown className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>

              <p className="text-violet-200 text-sm mt-1">
                @{user?.username}
              </p>

              <p className="text-violet-100/70 text-xs mt-3 flex items-center justify-center sm:justify-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Your Banana Brain player account
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Account
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-800">Your gaming overview</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your performance and activity statistics.
              </p>
            </div>
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats ? (
              <>
                <ProfileStat
                  label="Games Played"
                  value={stats.games_played || 0}
                  icon={Gamepad2}
                  color="text-violet-600"
                  background="bg-violet-50"
                />

                <ProfileStat
                  label="Total Points"
                  value={stats.total_points || 0}
                  icon={Zap}
                  color="text-amber-500"
                  background="bg-amber-50"
                />

                <ProfileStat
                  label="Best Score"
                  value={stats.best_score || 0}
                  icon={Trophy}
                  color="text-emerald-600"
                  background="bg-emerald-50"
                />

                <ProfileStat
                  label="Accuracy"
                  value={`${stats.avg_accuracy || 0}%`}
                  icon={Target}
                  color="text-blue-600"
                  background="bg-blue-50"
                />
              </>
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBlock key={i} className="h-32 rounded-2xl" />
              ))
            )}
          </div>
        </div>

        {/* Account information */}
        <Section
          title="Account Information"
          description="Your registered account details."
          icon={<User className="w-5 h-5" />}
        >
          <div className="grid sm:grid-cols-2 gap-5">

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-violet-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400">Username</p>
                <p className="text-sm font-semibold text-slate-800 mt-1 break-all">
                  @{user?.username}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400">Email address</p>
                <p className="text-sm font-semibold text-slate-800 mt-1 break-all">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Account role</p>
                <p className="text-sm font-semibold text-slate-800 mt-1 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <CalendarDays className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Member since</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—'}
                </p>
              </div>
            </div>

          </div>
        </Section>

        {/* Edit profile */}
        <Section
          title="Edit Profile"
          description="Update the name displayed on your player profile."
          icon={<User className="w-5 h-5" />}
        >
          <form onSubmit={saveProfile} className="space-y-5">
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Display name
              </label>

              <input
                id="displayName"
                type="text"
                className={inputClass}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your public display name"
              />

              <p className="text-xs text-slate-400 mt-2">
                This name will be visible on your player profile.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-md shadow-violet-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving changes...' : 'Save Changes'}
            </button>
          </form>
        </Section>

        {/* Change password */}
        <Section
          title="Change Password"
          description="Keep your account secure by using a strong password."
          icon={<Lock className="w-5 h-5" />}
        >
          <form onSubmit={changePassword} className="space-y-5">

            {pwdError && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{pwdError}</span>
              </div>
            )}

            {[
              {
                field: 'currentPassword',
                label: 'Current password',
                placeholder: 'Enter your current password',
              },
              {
                field: 'newPassword',
                label: 'New password',
                placeholder: 'Enter your new password',
              },
              {
                field: 'confirmNewPassword',
                label: 'Confirm new password',
                placeholder: 'Repeat your new password',
              },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label
                  className="block text-sm font-semibold text-slate-700 mb-2"
                  htmlFor={field}
                >
                  {label}
                </label>

                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    id={field}
                    type="password"
                    className={`${inputClass} pl-10`}
                    value={pwdForm[field]}
                    onChange={(e) =>
                      setPwdForm((p) => ({
                        ...p,
                        [field]: e.target.value,
                      }))
                    }
                    placeholder={placeholder}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            ))}

            <p className="text-xs text-slate-400">
              Your new password must contain at least 8 characters.
            </p>

            <button
              type="submit"
              disabled={pwdSaving}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-md shadow-violet-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <Lock className="w-4 h-4" />
              {pwdSaving ? 'Updating password...' : 'Update Password'}
            </button>
          </form>
        </Section>

        {/* Logout */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>

            <div>
              <p className="font-bold text-slate-800">
                Sign out of your account
              </p>
              <p className="text-sm text-slate-500 mt-1">
                End your current session on this device.
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

      </div>
    </AppLayout>
  );
}
