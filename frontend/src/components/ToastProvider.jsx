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
  success: 'border',
  error: 'border',
  info: 'border',
  warning: 'border',
};

const TOAST_COLORS = {
  success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', text: '#10B981', icon: '#10B981' },
  error:   { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.25)',  text: '#F87171', icon: '#EF4444' },
  info:    { bg: 'rgba(79,70,229,0.12)',   border: 'rgba(79,70,229,0.25)',  text: '#818CF8', icon: '#4F46E5' },
  warning: { bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)', text: '#FBBF24', icon: '#F59E0B' },
};

function Toast({ toast, onDismiss }) {
  const Icon = TOAST_ICONS[toast.type] || Info;
  const colors = TOAST_COLORS[toast.type] || TOAST_COLORS.info;

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-2xl animate-slide-up"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      }}
      role="alert"
    >
      <Icon size={16} className="flex-shrink-0 mt-0.5" style={{ color: colors.icon }} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold mb-0.5">{toast.title}</p>
        )}
        <p className="text-sm opacity-90">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-0.5 rounded hover:bg-white/10 transition-colors opacity-60 hover:opacity-100 cursor-pointer"
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
