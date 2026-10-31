
// Banana Brain - Redesigned Login Page
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Brain,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Trophy,
  Zap,
  Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../hooks/useToast.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const from = location.state?.from?.pathname || '/dashboard';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter your email/username and password.');
      return;
    }

    setLoading(true);

    try {
      const user = await login(identifier.trim(), password);
      toast(`Welcome back, ${user.displayName}!`, 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7fc] flex items-center justify-center p-4 sm:p-6 lg:p-10">

      <div className="w-full max-w-6xl min-h-[680px] bg-white rounded-[28px] shadow-2xl shadow-violet-100/70 overflow-hidden grid lg:grid-cols-2">

        {/* Left branding section */}
        <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-violet-700 via-purple-800 to-indigo-950 p-12 flex-col justify-between text-white">

          {/* Decorative background */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }}
          />

          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative z-10">

            <Link to="/home" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
                <Brain className="w-7 h-7 text-amber-300" />
              </div>

              <div>
                <p className="text-xl font-extrabold tracking-tight">
                  Banana Brain
                </p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-violet-200 font-semibold">
                  Think. Solve. Improve.
                </p>
              </div>
            </Link>

          </div>

          <div className="relative z-10 max-w-md">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm text-violet-100 mb-7">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Challenge your mind every day
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.15] tracking-tight">
              Think fast.
              <br />
              <span className="text-amber-300">Solve smart.</span>
            </h1>

            <p className="text-violet-200 mt-6 text-base leading-8">
              Test your problem-solving skills with visual number puzzles,
              challenge yourself against time and climb the leaderboard.
            </p>

            <div className="mt-10 space-y-5">

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <p className="font-semibold">Fast-paced challenges</p>
                  <p className="text-sm text-violet-200">Improve your speed and accuracy.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <p className="font-semibold">Compete with others</p>
                  <p className="text-sm text-violet-200">Earn points and climb the rankings.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <p className="font-semibold">Secure player accounts</p>
                  <p className="text-sm text-violet-200">Your account stays protected.</p>
                </div>
              </div>

            </div>
          </div>

          <div className="relative z-10 text-xs text-violet-300">
            © {new Date().getFullYear()} Banana Brain. All rights reserved.
          </div>

        </div>

        {/* Right login section */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">

          <div className="w-full max-w-md">

            {/* Mobile branding */}
            <div className="lg:hidden text-center mb-10">

              <Link to="/home" className="inline-flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-violet-700 flex items-center justify-center shadow-lg shadow-violet-200">
                  <Brain className="w-7 h-7 text-amber-300" />
                </div>

                <span className="text-2xl font-extrabold text-slate-900">
                  Banana <span className="text-violet-700">Brain</span>
                </span>
              </Link>

            </div>

            <div className="mb-9">

              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-50 mb-5">
                <Sparkles className="w-6 h-6 text-violet-600" />
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome back!
              </h2>

              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                Sign in to continue your puzzle journey and challenge your brain.
              </p>

            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {error && (
                <div
                  className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {/* Username or email */}
              <div>
                <label htmlFor="identifier" className="label">
                  Email or username
                </label>

                <input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  className="input py-3.5"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your email or username"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="label !mb-0">
                    Password
                  </label>
                </div>

                <div className="relative">

                  <input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="input py-3.5 pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-700 transition-colors"
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                  >
                    {showPwd
                      ? <EyeOff className="w-5 h-5" />
                      : <Eye className="w-5 h-5" />
                    }
                  </button>

                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-base rounded-xl mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-slate-400">
                  NEW TO BANANA BRAIN?
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-violet-700 hover:text-violet-900 transition-colors"
              >
                Create account
              </Link>
            </p>

            <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Secure account authentication
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
