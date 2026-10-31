
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Brain,
  LayoutDashboard,
  Gamepad2,
  Trophy,
  Clock,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../hooks/useToast.jsx';

const navLinks = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    to: '/game',
    label: 'Play Game',
    icon: Gamepad2
  },
  {
    to: '/leaderboard',
    label: 'Leaderboard',
    icon: Trophy
  },
  {
    to: '/history',
    label: 'Game History',
    icon: Clock
  }
];

function Brand({ light = false, to = '/dashboard' }) {
  return (
    <Link
      className="flex items-center gap-3 group"
    >
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center shadow-lg shadow-violet-200 group-hover:scale-105 transition-transform">
        <Brain className="w-6 h-6 text-white" />
      </div>

      <div className="leading-tight">
        <span className={`block text-lg font-extrabold tracking-tight ${
          light ? 'text-white' : 'text-slate-900'
        }`}>
          Banana <span className="text-violet-600">Brain</span>
        </span>

        <span className={`text-[10px] font-semibold tracking-[0.16em] uppercase ${
          light ? 'text-violet-200' : 'text-slate-400'
        }`}>
          Think. Solve. Improve.
        </span>
      </div>
    </Link>
  );
}

function NavigationLinks({ onNavigate, user }) {
  return (
    <>
      {navLinks.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-violet-50 text-violet-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-violet-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-[19px] h-[19px] ${
                  isActive
                    ? 'text-violet-600'
                    : 'text-slate-400 group-hover:text-violet-600'
                }`} />

                <span>{item.label}</span>

                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto text-violet-500" />
                )}
              </>
            )}
          </NavLink>
        );
      })}

      {user?.role === 'admin' && (
        <NavLink
          to="/admin"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              isActive
                ? 'bg-amber-50 text-amber-700'
                : 'text-amber-600 hover:bg-amber-50'
            }`
          }
        >
          <Sparkles className="w-[19px] h-[19px]" />
          Administration
        </NavLink>
      )}
    </>
  );
}

export function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

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

  const displayName = user?.displayName || 'Player';

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f7f7fc]">

      {/* Desktop and mobile header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100">

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-[76px] flex items-center justify-between">

            {/* Brand */}
            <Brand />

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-1">

              <NavigationLinks user={user} />

            </nav>

            {/* User profile and actions */}
            <div className="hidden md:flex items-center gap-3">

              <Link
                to="/profile"
                className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-violet-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center border border-violet-100">
                  <span className="text-violet-700 font-bold">
                    {initial}
                  </span>
                </div>

                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800 group-hover:text-violet-700 transition-colors">
                    {displayName}
                  </p>

                  <p className="text-xs text-slate-400">
                    {user?.role === 'admin' ? 'Administrator' : 'Player'}
                  </p>
                </div>
              </Link>

              <div className="h-9 w-px bg-slate-200 mx-1" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-[17px] h-[17px]" />
                <span>Logout</span>
              </button>

            </div>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen
                ? <X className="w-5 h-5" />
                : <Menu className="w-5 h-5" />
              }
            </button>

          </div>

        </div>

        {/* Mobile navigation */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white shadow-xl">

            <div className="px-4 py-4 space-y-1">

              <div className="px-4 py-3 mb-3 bg-violet-50 rounded-xl flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-violet-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-violet-700" />
                </div>

                <div>
                  <p className="font-bold text-sm text-slate-800">
                    {displayName}
                  </p>

                  <p className="text-xs text-slate-500">
                    {user?.role === 'admin' ? 'Administrator' : 'Player'}
                  </p>
                </div>

              </div>

              <NavigationLinks
                user={user}
                onNavigate={() => setMobileOpen(false)}
              />

              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-violet-700"
              >
                <User className="w-5 h-5" />
                My Profile
              </Link>

              <div className="border-t border-slate-100 my-3" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>

            </div>

          </div>
        )}

      </header>

      {/* Main page content */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        <div className="page-enter">
          {children}
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">

        <div className="border-t border-slate-200 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Banana Brain. All rights reserved.
          </p>

          <p className="text-xs text-slate-400 flex items-center gap-1">
            Made for curious minds
            <span className="text-amber-500">✦</span>
          </p>

        </div>

      </footer>

    </div>
  );
}

export function PublicLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f7f7fc]">

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100">

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between">

          <Brand />

          <nav className="flex items-center gap-2 sm:gap-4">

            <Link
              to="/leaderboard"
              className="hidden sm:block text-sm font-semibold text-slate-500 hover:text-violet-700 transition-colors px-3 py-2"
            >
              Leaderboard
            </Link>

            {user ? (

              <Link to="/dashboard" className="btn-primary">
                Go to Dashboard
              </Link>

            ) : (

              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-600 hover:text-violet-700 px-3 py-2 transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </>

            )}

          </nav>

        </div>

      </header>

      {children}

    </div>
  );
}
