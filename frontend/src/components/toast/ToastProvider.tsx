import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

type Kind = 'info' | 'success' | 'error';
type Toast = { id: string; kind: Kind; message: string };

type Ctx = {
  show: (message: string, kind?: Kind, opts?: { duration?: number }) => void;
};

const ToastContext = createContext<Ctx | null>(null);

// Keep it small and predictable; no external deps.
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, number>>({});

  const remove = useCallback((id: string) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    if (timers.current[id]) {
      window.clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const show = useCallback(
    (message: string, kind: Kind = 'info', opts?: { duration?: number }) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const toast: Toast = { id, kind, message };
      setToasts((list) => [toast, ...list]);
      const ms = opts?.duration ?? 4000;
      timers.current[id] = window.setTimeout(() => remove(id), ms);
    },
    [remove]
  );

  const value = useMemo<Ctx>(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 w-80 space-y-2">
        {toasts.map((t) => (
          <button
            key={t.id}
            onClick={() => remove(t.id)}
            className={`w-full rounded-xl border px-3 py-2 text-left shadow transition hover:brightness-95 ${
              t.kind === 'success'
                ? 'bg-green-50 text-green-800 border-green-200'
                : t.kind === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-gray-50 text-gray-800 border-gray-200'
            }`}
            aria-label="Dismiss notification"
          >
            {t.message}
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}