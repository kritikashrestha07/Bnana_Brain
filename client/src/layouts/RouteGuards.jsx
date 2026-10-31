// AI assistance: Google Gemini (Antigravity) helped scaffold route protection components.
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { LoadingPage } from '../components/ui/index.jsx';

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingPage />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingPage />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export function RequireGuest({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingPage />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

