// AI assistance: Google Gemini (Antigravity) helped scaffold this landing page component.
import { Link } from 'react-router-dom';
import { Brain, Zap, Trophy, Shield, ArrowRight, Star } from 'lucide-react';
import { PublicLayout } from '../layouts/AppLayout.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

const features = [
  {
    icon: <Brain className="w-6 h-6 text-violet-600" />,
    title: 'Visual Number Puzzles',
    desc: 'Decode banana-themed image puzzles powered by the University of Bedfordshire API.',
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-500" />,
    title: 'Speed Scoring',
    desc: 'Answer faster for speed bonuses. Build streaks for multiplier rewards.',
  },
  {
    icon: <Trophy className="w-6 h-6 text-violet-600" />,
    title: 'Global Leaderboard',
    desc: 'Compete for the top spot on a real-time PostgreSQL-backed leaderboard.',
  },
  {
    icon: <Shield className="w-6 h-6 text-emerald-500" />,
    title: 'Secure Accounts',
    desc: 'Session-based authentication with hashed passwords and role-based access.',
  },
];

const howToPlay = [
  { step: '1', title: 'Create an account', desc: 'Register with a username and password in under 30 seconds.' },
  { step: '2', title: 'Start a game',       desc: 'Choose Easy, Medium, or Hard and begin your timed challenge.' },
  { step: '3', title: 'Solve the puzzle',   desc: 'Look at the banana image and enter the missing digit (0–9).' },
  { step: '4', title: 'Climb the ranks',    desc: 'Your verified score is saved and compared on the global leaderboard.' },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-700 to-indigo-800 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32 flex flex-col lg:flex-row items-center gap-16">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur">
              <Star className="w-4 h-4 text-amber-400" />
              Visual Number Puzzle Challenge
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight">
              Banana Brain
            </h1>
            <p className="mt-4 text-xl text-violet-200 font-medium">Think Fast. Solve Smart.</p>
            <p className="mt-6 text-violet-100 max-w-lg">
              Decode banana-themed image puzzles from the University of Bedfordshire, race
              against the clock, and prove your place on the global leaderboard.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
              {user ? (
                <Link to="/game" className="btn-accent text-base px-8 py-3">
                  Play Now <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-accent text-base px-8 py-3">
                    Get Started Free <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/login" className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30
                    text-white font-semibold text-base px-8 py-3 rounded-xl transition-colors">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Puzzle preview card */}
          <div className="flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-72 sm:w-80">
              <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wide">
                Live puzzle preview
              </p>
              <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 aspect-video flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-4xl mb-2">🍌</p>
                  <p className="text-slate-400 text-sm">Puzzle loads after login</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-3 text-center">
                Powered by University of Bedfordshire Banana API
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800">Everything you need to compete</h2>
          <p className="text-slate-500 mt-2">A full-stack puzzle game built for the challenge</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How to play */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">How to play</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howToPlay.map((h) => (
              <div key={h.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-violet-700 text-white flex items-center justify-center
                  text-xl font-bold mx-auto mb-4">
                  {h.step}
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{h.title}</h3>
                <p className="text-sm text-slate-500">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Ready to test your brain?</h2>
        <p className="text-slate-500 mb-8">Join players competing on the global leaderboard.</p>
        {user ? (
          <Link to="/game" className="btn-primary text-base px-10 py-3">
            Play Now <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link to="/register" className="btn-primary text-base px-10 py-3">
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center
          justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-violet-600" />
            <span className="font-semibold text-slate-700">Banana Brain</span>
            <span>— CIS046-3 Software For Enterprise Assignment</span>
          </div>
          <div className="text-center sm:text-right">
            <p>Puzzle API: <a href="http://marcconrad.com/uob/banana/" target="_blank" rel="noopener noreferrer"
              className="text-violet-600 hover:underline">marcconrad.com/uob/banana</a></p>
            <p className="mt-0.5">University of Bedfordshire · {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </PublicLayout>
  );
}

