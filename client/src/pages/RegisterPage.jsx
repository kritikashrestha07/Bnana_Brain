
// AI assistance: Google Gemini (Antigravity) helped scaffold this registration page.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Brain,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Sparkles,
  ShieldCheck,
  Gamepad2,
  Trophy,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../hooks/useToast.jsx';

function FormField({ label, id, error, icon: Icon, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700 mb-2"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        )}
        {children}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1.5">{error}</p>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const e = {};

    if (!form.username.trim()) {
      e.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_]{3,30}$/.test(form.username)) {
      e.username = 'Username: 3–30 characters, letters, numbers, underscores only';
    }

    if (!form.displayName.trim()) {
      e.displayName = 'Display name is required';
    }

    if (!form.email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email';
    }

    if (!form.password) {
      e.password = 'Password is required';
    } else if (form.password.length < 8) {
      e.password = 'Password must be at least 8 characters';
    }

    if (form.password !== form.confirmPassword) {
      e.confirmPassword = 'Passwords do not match';
    }

    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const clientErrors = validate();

    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);

    try {
      await register(form);
      toast('Account created! Welcome to Banana Brain 🎉', 'success');
      navigate('/dashboard');
    } catch (err) {
      if (err.details) {
        const fieldErrors = {};
        err.details.forEach(({ field, message }) => {
          fieldErrors[field] = message;
        });
        setErrors(fieldErrors);
      } else {
        toast(err.message || 'Registration failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-100';

  return (
    <div className="min-h-screen bg-[#f7f6ff] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl shadow-violet-900/10 overflow-hidden border border-white">

        {/* Left branding panel */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-violet-700 via-indigo-700 to-slate-900 text-white relative overflow-hidden">

          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-300/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                <Brain className="w-7 h-7 text-amber-300" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                Banana Brain
              </span>
            </Link>

            <div className="mt-20">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-violet-100 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Your brain training adventure starts here
              </div>

              <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
                Think faster.
                <br />
                Play smarter.
                <br />
                <span className="text-amber-300">Have fun.</span>
              </h1>

              <p className="mt-6 text-violet-100/80 leading-relaxed text-base max-w-md">
                Create your account and challenge yourself with exciting
                banana puzzles. Improve your thinking, track your progress
                and compete with other players.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-5 mt-16">

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <div className="w-11 h-11 rounded-xl bg-amber-400/20 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="font-bold text-sm">Fun brain challenges</p>
                <p className="text-xs text-violet-200 mt-1">
                  Test your logic with interactive puzzles.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <div className="w-11 h-11 rounded-xl bg-emerald-400/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="font-bold text-sm">Track your achievements</p>
                <p className="text-xs text-violet-200 mt-1">
                  Follow your scores and climb the leaderboard.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <div className="w-11 h-11 rounded-xl bg-sky-400/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-sky-300" />
              </div>
              <div>
                <p className="font-bold text-sm">Your own player profile</p>
                <p className="text-xs text-violet-200 mt-1">
                  Keep your gaming history in one place.
                </p>
              </div>
            </div>

          </div>

          <p className="relative z-10 text-xs text-violet-200/60 mt-12">
            © 2026 Banana Brain. Built for curious minds.
          </p>
        </div>

        {/* Right registration form */}
        <div className="p-6 sm:p-10 lg:p-12">

          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-violet-700 font-extrabold text-2xl">
              <Brain className="w-7 h-7 text-amber-400" />
              Banana Brain
            </Link>
          </div>

          <div className="max-w-md mx-auto">

            <div className="mb-8">
              <div className="inline-flex items-center gap-2 text-violet-600 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-4 h-4" />
                Get started for free
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Create your account
              </h2>

              <p className="text-slate-500 text-sm mt-2">
                Join Banana Brain and start challenging your mind.
              </p>

              <p className="text-sm text-slate-500 mt-4">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-violet-600 font-bold hover:text-violet-800 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              <FormField
                label="Username"
                id="username"
                error={errors.username}
                icon={User}
              >
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  className={inputClass}
                  value={form.username}
                  onChange={handleChange}
                  placeholder="e.g. puzzle_master"
                />
              </FormField>

              <FormField
                label="Display name"
                id="displayName"
                error={errors.displayName}
                icon={User}
              >
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  autoComplete="name"
                  className={inputClass}
                  value={form.displayName}
                  onChange={handleChange}
                  placeholder="e.g. Banana King"
                />
              </FormField>

              <FormField
                label="Email address"
                id="email"
                error={errors.email}
                icon={Mail}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </FormField>

              <FormField
                label="Password"
                id="password"
                error={errors.password}
                icon={Lock}
              >
                <input
                  id="password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`${inputClass} pr-12`}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                />

                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-violet-600 transition-colors"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              </FormField>

              <FormField
                label="Confirm password"
                id="confirmPassword"
                error={errors.confirmPassword}
                icon={Lock}
              >
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={inputClass}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                />
              </FormField>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            <div className="flex items-start gap-2.5 mt-6 p-3.5 rounded-xl bg-violet-50 border border-violet-100">
              <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 leading-relaxed">
                By registering, you acknowledge that Banana Brain is a
                student project and not a commercial service.
              </p>
            </div>

            <div className="text-center mt-8">
              <Link
                to="/"
                className="text-xs text-slate-400 hover:text-violet-600 transition-colors"
              >
                ← Back to homepage
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
