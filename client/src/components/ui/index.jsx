// AI assistance: Google Gemini (Antigravity) helped scaffold these reusable UI components.
import { Loader2 } from 'lucide-react';

export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <Loader2
      className={`animate-spin text-violet-600 ${sizes[size] || sizes.md} ${className}`}
      aria-label="Loading"
    />
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-slate-500 text-sm">Loading…</p>
      </div>
    </div>
  );
}

export function SkeletonBlock({ className = '' }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} aria-hidden="true" />
  );
}

export function StatCard({ label, value, icon, colorClass = 'text-violet-600' }) {
  return (
    <div className="card flex items-center gap-4">
      {icon && (
        <div className={`w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center ${colorClass}`}>
          {icon}
        </div>
      )}
      <div>
        <p className="text-2xl font-bold text-slate-800">{value ?? '—'}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-16 px-4">
      {icon && <div className="text-slate-300 flex justify-center mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      {description && <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700 flex items-start gap-3">
      <span className="mt-0.5">⚠️</span>
      <div className="flex-1">
        <p className="font-medium">Something went wrong</p>
        <p className="mt-0.5 text-red-600">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-red-700 underline font-medium text-xs hover:text-red-900"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

export function Badge({ children, variant = 'info' }) {
  const classes = {
    success: 'badge-success',
    error:   'badge-error',
    warning: 'badge-warning',
    info:    'badge-info',
    neutral: 'badge-neutral',
  };
  return <span className={classes[variant] || classes.info}>{children}</span>;
}

export function ConfirmDialog({ open, title, description, onConfirm, onCancel, danger = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        <div className="flex gap-3 mt-6 justify-end">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-2 justify-center mt-6">
      <button
        className="btn-secondary px-3 py-1.5 text-xs"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className="text-sm text-slate-600">
        Page {page} of {totalPages}
      </span>
      <button
        className="btn-secondary px-3 py-1.5 text-xs"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}

