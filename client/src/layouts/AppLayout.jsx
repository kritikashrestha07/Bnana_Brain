// AI assistance: Google Gemini (Antigravity) helped scaffold this navigation layout.
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Brain, LayoutDashboard, Gamepad2, Trophy, Clock, User,
  LogOut, Menu, X, ChevronDown
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../hooks/useToast.jsx';

const navLinks = [
  { to: '/dashboard',  label: 'Dashboard',   icon: <LayoutDashboard className="w-4 h-4" /> },
  { to: '/game',       label: 'Play',         icon: <Gamepad2        className="w-4 h-4" /> },
  { to: '/leaderboard',label: 'Leaderboard',  icon: <Trophy          className="w-4 h-4" /> },
  { to: '/history',    label: 'History',      icon: <Clock           className="w-4 h-4" /> },
];

export function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const toast            = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      toast('Logged out successfully', 'success');
      navigate('/');
    } catch {
      toast('Logout failed', 'error');
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      {/* Top navigation */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/dashboard" className="flex items-center gap-2 text-violet-700 font-bold text-xl">
            <Brain className="w-6 h-6 text-amber-400" />
            <span>Banana Brain</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                   ${isActive
                     ? 'bg-violet-50 text-violet-700'
                     : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
                }
              >
                {l.icon}
                {l.label}
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                   ${isActive ? 'bg-amber-50 text-amber-700' : 'text-amber-600 hover:bg-amber-50'}`
                }
              >
                Admin
              </NavLink>
            )}
          </nav>

          {/* User menu (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-violet-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                <User className="w-4 h-4 text-violet-600" />
              </div>
              <span className="font-medium">{user?.displayName}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-slate-100 bg-white px-4 py-3 flex flex-col gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                   ${isActive ? 'bg-violet-50 text-violet-700' : 'text-slate-700'}`
                }
              >
                {l.icon} {l.label}
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink to="/admin" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-amber-600">
                Admin
              </NavLink>
            )}
            <hr className="my-1 border-slate-100" />
            <Link to="/profile" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700">
              <User className="w-4 h-4" /> Profile
            </Link>
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 text-left">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </nav>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}

export function PublicLayout({ children }) {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-violet-700 font-bold text-xl">
            <Brain className="w-6 h-6 text-amber-400" />
            <span>Banana Brain</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/leaderboard" className="text-sm text-slate-600 hover:text-violet-700 px-3 py-2">
              Leaderboard
            </Link>
            {user ? (
              <Link to="/dashboard" className="btn-primary py-2">Dashboard</Link>
            ) : (
              <>
                <Link to="/login"    className="btn-secondary py-2">Login</Link>
                <Link to="/register" className="btn-primary  py-2">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

