
import { Loader2, AlertCircle, CheckCircle2, X, ChevronLeft, ChevronRight } from 'lucide-react';

/* Loading spinner */

export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  };

  return (
    <Loader2
      className={`animate-spin text-violet-600 ${sizes[size] || sizes.md} ${className}`}
      aria-label="Loading"
    />
  );
}

/* Full page loading */

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7fc]">

      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-violet-100/50 p-10 text-center max-w-sm w-full mx-4">

        <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-5">
          <Spinner size="lg" />
        </div>

        <h2 className="text-lg font-bold text-slate-800">
          Getting things ready
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Please wait while we prepare your experience...
        </p>

      </div>

    </div>
  );
}

/* Skeleton loading block */

export function SkeletonBlock({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 rounded-xl ${className}`}
      aria-hidden="true"
    />
  );
}

/* Dashboard statistic card */

export function StatCard({
  label,
  value,
  icon,
  colorClass = 'text-violet-600'
}) {
  return (
    <div className="group bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg hover:shadow-violet-100/50 hover:-translate-y-1 transition-all duration-200">

      <div className="flex items-center justify-between gap-3">

        <div className="min-w-0">

          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2 tracking-tight">
            {value ?? '—'}
          </p>

        </div>

        {icon && (
          <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-violet-50 flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform duration-200`}>
            {icon}
          </div>
        )}

      </div>

      <div className="h-1 w-10 bg-gradient-to-r from-violet-500 to-purple-300 rounded-full mt-5 group-hover:w-16 transition-all duration-300" />

    </div>
  );
}

/* Empty state */

export function EmptyState({
  icon,
  title,
  description,
  action
}) {
  return (
    <div className="bg-white border border-dashed border-slate-200 rounded-2xl text-center py-14 px-5">

      {icon && (
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-400">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-bold text-slate-800">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}

    </div>
  );
}

/* Error message */

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="rounded-2xl bg-red-50 border border-red-100 p-5 flex items-start gap-3">

      <div className="w-9 h-9 shrink-0 rounded-xl bg-red-100 flex items-center justify-center">
        <AlertCircle className="w-5 h-5 text-red-600" />
      </div>

      <div className="flex-1 min-w-0">

        <p className="font-bold text-sm text-red-800">
          Something went wrong
        </p>

        <p className="mt-1 text-sm text-red-600 leading-relaxed">
          {message}
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 inline-flex items-center text-sm font-bold text-red-700 hover:text-red-900 underline underline-offset-4"
          >
            Try again
          </button>
        )}

      </div>

    </div>
  );
}

/* Status badge */

export function Badge({ children, variant = 'info' }) {
  const classes = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    error: 'bg-red-50 text-red-700 border-red-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    info: 'bg-violet-50 text-violet-700 border-violet-100',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200'
  };

  const icons = {
    success: CheckCircle2,
  };

  const Icon = icons[variant];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${classes[variant] || classes.info}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}

/* Confirmation dialog */

export function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  danger = false
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full animate-[dialogEnter_0.2s_ease-out]"
      >

        <button
          onClick={onCancel}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
          danger ? 'bg-red-50 text-red-600' : 'bg-violet-50 text-violet-600'
        }`}>
          {danger
            ? <AlertCircle className="w-6 h-6" />
            : <CheckCircle2 className="w-6 h-6" />
          }
        </div>

        <h3
          id="confirm-dialog-title"
          className="text-xl font-extrabold text-slate-800 pr-8"
        >
          {title}
        </h3>

        {description && (
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 justify-end">

          <button
            className="btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className={danger ? 'btn-danger' : 'btn-primary'}
            onClick={onConfirm}
          >
            Confirm
          </button>

        </div>

      </div>

      <style>{`
        @keyframes dialogEnter {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

    </div>
  );
}

/* Pagination */

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-8">

      <button
        className="btn-secondary px-4 py-2.5"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex items-center gap-2 text-sm">

        <span className="font-bold text-violet-700 bg-violet-50 px-3 py-2 rounded-lg">
          {page}
        </span>

        <span className="text-slate-400">
          of
        </span>

        <span className="font-semibold text-slate-600">
          {totalPages}
        </span>

      </div>

      <button
        className="btn-secondary px-4 py-2.5"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>

    </div>
  );
}
