// AI assistance: Google Gemini (Antigravity) helped scaffold this registration page.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../hooks/useToast.jsx';

function FormField({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate      = useNavigate();
  const toast         = useToast();

  const [form, setForm] = useState({
    username: '', displayName: '', email: '', password: '', confirmPassword: ''
  });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required';
    else if (!/^[a-zA-Z0-9_]{3,30}$/.test(form.username))
      e.username = 'Username: 3–30 characters, letters, numbers, underscores only';
    if (!form.displayName.trim()) e.displayName = 'Display name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
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
        err.details.forEach(({ field, message }) => { fieldErrors[field] = message; });
        setErrors(fieldErrors);
      } else {
        toast(err.message || 'Registration failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-violet-700 font-bold text-2xl">
            <Brain className="w-7 h-7 text-amber-400" />
            Banana Brain
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 mt-4">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">
            Already have one?{' '}
            <Link to="/login" className="text-violet-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5" noValidate>
          <FormField label="Username" id="username" error={errors.username}>
            <input
              id="username" name="username" type="text" autoComplete="username"
              className="input" value={form.username} onChange={handleChange}
              placeholder="e.g. puzzle_master"
              aria-describedby={errors.username ? 'username-err' : undefined}
            />
          </FormField>

          <FormField label="Display name" id="displayName" error={errors.displayName}>
            <input
              id="displayName" name="displayName" type="text" autoComplete="name"
              className="input" value={form.displayName} onChange={handleChange}
              placeholder="e.g. Banana King"
            />
          </FormField>

          <FormField label="Email address" id="email" error={errors.email}>
            <input
              id="email" name="email" type="email" autoComplete="email"
              className="input" value={form.email} onChange={handleChange}
              placeholder="you@example.com"
            />
          </FormField>

          <FormField label="Password" id="password" error={errors.password}>
            <div className="relative">
              <input
                id="password" name="password" type={showPwd ? 'text' : 'password'}
                autoComplete="new-password" className="input pr-10"
                value={form.password} onChange={handleChange}
                placeholder="At least 8 characters"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPwd ? 'Hide password' : 'Show password'}>
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </FormField>

          <FormField label="Confirm password" id="confirmPassword" error={errors.confirmPassword}>
            <input
              id="confirmPassword" name="confirmPassword"
              type={showPwd ? 'text' : 'password'} autoComplete="new-password"
              className="input" value={form.confirmPassword} onChange={handleChange}
              placeholder="Repeat your password"
            />
          </FormField>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          By registering you agree that this is a student project and not a commercial service.
        </p>
      </div>
    </div>
  );
}

