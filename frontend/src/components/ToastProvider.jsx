import React, { createContext, useContext, useState, useCallback, useRef, useMemo } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const TOAST_STYLES = {
  success: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
  error: 'bg-red-500/15 border-red-500/30 text-red-300',
  info: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
  warning: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
};

const TOAST_ICON_COLORS = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  info: 'text-blue-400',
  warning: 'text-amber-400',
};

function Toast({ toast, onDismiss }) {
  const Icon = TOAST_ICONS[toast.type] || Info;
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
  const iconColor = TOAST_ICON_COLORS[toast.type] || TOAST_ICON_COLORS.info;

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-2xl shadow-black/30 animate-slide-up ${style}`}
      role="alert"
    >
      <Icon size={16} className={`flex-shrink-0 mt-0.5 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold mb-0.5">{toast.title}</p>
        )}
        <p className="text-sm opacity-90">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-0.5 rounded hover:bg-white/10 transition-colors opacity-60 hover:opacity-100"
      >
        <X size={12} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const addToast = useCallback(({ type = 'info', message, title, duration = 4000 }) => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev, { id, type, message, title }]);

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useMemo(() => ({
    success: (message, title) => addToast({ type: 'success', message, title }),
    error: (message, title) => addToast({ type: 'error', message, title }),
    info: (message, title) => addToast({ type: 'info', message, title }),
    warning: (message, title) => addToast({ type: 'warning', message, title }),
  }), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, dismissToast, toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast toast={t} onDismiss={dismissToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Return a no-op if not inside provider (graceful degradation)
    return {
      addToast: () => {},
      dismissToast: () => {},
      toast: {
        success: () => {},
        error: () => {},
        info: () => {},
        warning: () => {},
      },
    };
  }
  return ctx;
}
