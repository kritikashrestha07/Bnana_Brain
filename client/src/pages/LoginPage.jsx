// AI assistance: Google Gemini (Antigravity) helped scaffold this login page.
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Brain, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../hooks/useToast.jsx';

export default function LoginPage() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();
  const toast        = useToast();

  const from = location.state?.from?.pathname || '/dashboard';

  const [identifier, setIdentifier] = useState('');
  const [password,   setPassword]   = useState('');
  const [showPwd,    setShowPwd]    = useState(false);
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);

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
      // Generic message — don't reveal whether email or password was wrong
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-violet-700 font-bold text-2xl">
            <Brain className="w-7 h-7 text-amber-400" />
            Banana Brain
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 mt-4">Sign in to your account</h1>
          <p className="text-slate-500 text-sm mt-1">
            New here?{' '}
            <Link to="/register" className="text-violet-600 font-medium hover:underline">Create account</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5" noValidate>
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl" role="alert">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="identifier" className="label">Email or username</label>
            <input
              id="identifier" type="text" autoComplete="username"
              className="input" value={identifier} onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com or username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="label">Password</label>
            <div className="relative">
              <input
                id="password" type={showPwd ? 'text' : 'password'} autoComplete="current-password"
                className="input pr-10" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPwd ? 'Hide password' : 'Show password'}>
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

