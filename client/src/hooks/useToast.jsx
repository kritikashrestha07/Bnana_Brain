// AI assistance: Google Gemini (Antigravity) helped scaffold this toast context.
import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx.addToast;
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error:   <XCircle    className="w-5 h-5 text-red-500"     />,
  warning: <AlertCircle className="w-5 h-5 text-amber-500"  />,
  info:    <AlertCircle className="w-5 h-5 text-violet-500" />,
};

const bgClass = {
  success: 'border-emerald-200 bg-emerald-50',
  error:   'border-red-200 bg-red-50',
  warning: 'border-amber-200 bg-amber-50',
  info:    'border-violet-200 bg-violet-50',
};

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 p-4 rounded-xl border shadow-md ${bgClass[t.type] || bgClass.info} animate-in slide-in-from-right-5`}
        >
          {icons[t.type] || icons.info}
          <p className="flex-1 text-sm text-slate-800">{t.message}</p>
          <button
            onClick={() => onRemove(t.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

