
 // AI assistance: Google Gemini (Antigravity) helped scaffold this landing page component.
import { Link } from 'react-router-dom';
import {
  Brain,
  Zap,
  Trophy,
  Shield,
  ArrowRight,
  Star,
  Gamepad2,
  Target,
  Clock3,
  Sparkles,
  CheckCircle,
  Medal,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import { PublicLayout } from '../layouts/AppLayout.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

const features = [
  {
    icon: Brain,
    title: 'Visual Number Puzzles',
    desc: 'Decode banana-themed image puzzles powered by the University of Bedfordshire API.',
    color: 'bg-violet-100 text-violet-700',
  },
  {
    icon: Zap,
    title: 'Speed Scoring',
    desc: 'Answer faster for speed bonuses. Build streaks for multiplier rewards.',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    icon: Trophy,
    title: 'Global Leaderboard',
    desc: 'Compete for the top spot on a real-time PostgreSQL-backed leaderboard.',
    color: 'bg-indigo-100 text-indigo-700',
  },
  {
    icon: Shield,
    title: 'Secure Accounts',
    desc: 'Session-based authentication with hashed passwords and role-based access.',
    color: 'bg-emerald-100 text-emerald-700',
  },
];

const howToPlay = [
  {
    step: '01',
    icon: Shield,
    title: 'Create an account',
    desc: 'Register with a username and password in under 30 seconds.',
  },
  {
    step: '02',
    icon: Gamepad2,
    title: 'Start a game',
    desc: 'Choose Easy, Medium, or Hard and begin your timed challenge.',
  },
  {
    step: '03',
    icon: Brain,
    title: 'Solve the puzzle',
    desc: 'Look at the banana image and enter the missing digit (0–9).',
  },
  {
    step: '04',
    icon: Trophy,
    title: 'Climb the ranks',
    desc: 'Your verified score is saved and compared on the global leaderboard.',
  },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <PublicLayout>
      <main className="overflow-hidden bg-slate-50">

        {/* ── Hero section ─────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-800 via-indigo-800 to-slate-950 text-white">

          {/* Background decoration */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '36px 36px',
            }}
          />

          <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

              {/* Hero content */}
              <div className="text-center lg:text-left">

                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-medium text-violet-100 mb-7">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  THE ULTIMATE NUMBER PUZZLE CHALLENGE
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
                  Banana
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300">
                    Brain.
                  </span>
                </h1>

                <p className="mt-5 text-xl sm:text-2xl font-semibold text-violet-200">
                  Think Fast. Solve Smart.
                </p>

                <p className="mt-6 text-base sm:text-lg leading-relaxed text-violet-100/90 max-w-xl mx-auto lg:mx-0">
                  Challenge your mind with exciting visual number puzzles.
                  Beat the clock, earn points, build your streak and prove
                  yourself on the global leaderboard.
                </p>

                {/* Hero buttons */}
                <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">

                  {user ? (
                    <Link
                      to="/game"
                      className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 px-8 py-4 font-bold text-slate-900 shadow-xl shadow-amber-900/20 transition-all hover:-translate-y-1 hover:from-amber-300 hover:to-orange-300"
                    >
                      <Gamepad2 className="w-5 h-5" />
                      Play Now
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 px-8 py-4 font-bold text-slate-900 shadow-xl shadow-amber-900/20 transition-all hover:-translate-y-1 hover:from-amber-300 hover:to-orange-300"
                      >
                        Get Started Free
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </Link>

                      <Link
                        to="/login"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md px-8 py-4 font-semibold text-white transition-all hover:bg-white/20"
                      >
                        Sign In
                      </Link>
                    </>
                  )}

                </div>

                {/* Small highlights */}
                <div className="mt-9 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-violet-200">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-300" />
                    Free to play
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-300" />
                    Multiple difficulty levels
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-300" />
                    Track your scores
                  </span>
                </div>
              </div>

              {/* Puzzle preview */}
              <div className="relative max-w-md mx-auto w-full">

                <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-violet-400/20 to-amber-300/10 blur-2xl" />

                <div className="relative rounded-3xl border border-white/20 bg-white p-5 sm:p-7 shadow-2xl shadow-black/30">

                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
                        Banana Brain
                      </p>
                      <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                        Ready to play?
                      </h2>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
                      <Brain className="w-7 h-7 text-violet-700" />
                    </div>
                  </div>

                  {/* Puzzle placeholder */}
                  <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-violet-50 via-white to-amber-50 p-6 sm:p-8">

                    <div className="flex justify-between items-center mb-5">
                      <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                        PUZZLE PREVIEW
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                        <Clock3 className="w-3.5 h-3.5" />
                        Timed challenge
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center py-5">
                      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-200 flex items-center justify-center shadow-inner">
                        <span className="text-6xl">🍌</span>
                      </div>

                      <p className="text-2xl font-black text-slate-800 mt-5">
                        Think. Calculate.
                      </p>
                      <p className="text-sm text-slate-500 mt-1 text-center">
                        Find the missing number!
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm font-semibold text-violet-700">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      Every puzzle is a new challenge
                    </div>
                  </div>

                  {/* Preview footer */}
                  <div className="flex items-center justify-between gap-3 mt-5">
                    <div>
                      <p className="text-xs text-slate-400">Your next challenge</p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">
                        Brain training starts here
                      </p>
                    </div>

                    <div className="flex -space-x-2">
                      <div className="w-9 h-9 rounded-full bg-violet-100 border-2 border-white flex items-center justify-center">
                        <Brain className="w-4 h-4 text-violet-600" />
                      </div>
                      <div className="w-9 h-9 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center">
                        <Zap className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="w-9 h-9 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Floating label */}
                <div className="absolute -bottom-5 -left-5 sm:-left-8 rounded-2xl border border-white/20 bg-white px-4 py-3 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Medal className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Your goal</p>
                    <p className="text-sm font-extrabold text-slate-800">
                      Reach the top!
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── Features section ─────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24">

          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-violet-700 mb-4">
              <Sparkles className="w-4 h-4" />
              Why Banana Brain?
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Everything you need to
              <span className="text-violet-700"> compete.</span>
            </h2>

            <p className="text-slate-500 mt-4 leading-relaxed">
              More than just puzzles. Challenge your thinking, improve your
              speed and compete with other players.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/60"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${feature.color}`}>
                    <FeatureIcon className="w-7 h-7" />
                  </div>

                  <span className="text-xs font-bold tracking-widest text-slate-300">
                    0{index + 1}
                  </span>

                  <h3 className="font-bold text-lg text-slate-800 mt-2 mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-500 leading-relaxed">
                    {feature.desc}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs font-bold text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Built for your challenge
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── How to play ──────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-white border-y border-slate-200">

          <div className="absolute -right-32 top-0 w-80 h-80 rounded-full bg-violet-50 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24">

            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-4">
                <Gamepad2 className="w-4 h-4" />
                Getting started
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                How to play
              </h2>

              <p className="text-slate-500 mt-4">
                Four simple steps stand between you and the leaderboard.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {howToPlay.map((item, index) => {
                const StepIcon = item.icon;

                return (
                  <div key={item.step} className="relative text-center">

                    <div className="relative inline-flex mb-5">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-violet-200">
                        <StepIcon className="w-7 h-7" />
                      </div>

                      <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-xs font-extrabold text-slate-900">
                        {item.step.slice(1)}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-800 text-lg mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                      {item.desc}
                    </p>

                    {index !== howToPlay.length - 1 && (
                      <div className="hidden lg:flex absolute top-8 -right-5 w-10 items-center justify-center text-violet-200">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Final call to action ─────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24">

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-indigo-700 to-purple-900 px-6 py-14 sm:px-12 sm:py-16 text-center shadow-xl shadow-violet-200">

            <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-purple-400/20 blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-8 h-8 text-amber-300" />
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-violet-200">
                Your next challenge awaits
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
                Ready to test your brain?
              </h2>

              <p className="text-violet-100 mt-4 leading-relaxed">
                Join the challenge, solve exciting puzzles and work your way
                towards the top of the leaderboard.
              </p>

              {user ? (
                <Link
                  to="/game"
                  className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 px-9 py-4 mt-8 font-bold text-slate-900 shadow-lg transition-all hover:-translate-y-1 hover:from-amber-300 hover:to-orange-300"
                >
                  <Gamepad2 className="w-5 h-5" />
                  Play Now
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 px-9 py-4 mt-8 font-bold text-slate-900 shadow-lg transition-all hover:-translate-y-1 hover:from-amber-300 hover:to-orange-300"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer className="bg-slate-950 text-slate-400">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-10 border-b border-white/10">

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white">
                      Banana Brain
                    </h3>
                    <p className="text-xs text-slate-500">
                      Think Fast. Solve Smart.
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed max-w-sm">
                  Challenge your mind with visual number puzzles, improve
                  your speed and compete for the top spot.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-4">
                  Quick links
                </h3>

                <div className="flex flex-col gap-3 text-sm">
                  <Link to="/" className="hover:text-violet-300 transition-colors">
                    Home
                  </Link>
                  {user ? (
                    <>
                      <Link to="/game" className="hover:text-violet-300 transition-colors">
                        Play Game
                      </Link>
                      <Link to="/dashboard" className="hover:text-violet-300 transition-colors">
                        Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/register" className="hover:text-violet-300 transition-colors">
                        Create Account
                      </Link>
                      <Link to="/login" className="hover:text-violet-300 transition-colors">
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-4">
                  Puzzle technology
                </h3>

                <p className="text-sm leading-relaxed mb-4">
                  Our visual puzzle experience is powered by the University
                  of Bedfordshire Banana API.
                </p>

                <a
                  href="http://marcconrad.com/uob/banana/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-violet-300 hover:text-violet-200 transition-colors"
                >
                  Explore the Banana API
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-7 text-xs text-slate-500">
              <p>
                © {new Date().getFullYear()} Banana Brain. All rights reserved.
              </p>

              <p className="text-center sm:text-right">
                CIS046-3 Software For Enterprise Assignment
                <span className="mx-2 text-slate-700">·</span>
                University of Bedfordshire
              </p>
            </div>

          </div>
        </footer>

      </main>
    </PublicLayout>
  );
}
