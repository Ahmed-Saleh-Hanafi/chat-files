import { createContext, useCallback, useMemo, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

export const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, { type = "success", duration = 3500 } = {}) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      success: (msg, opts) => push(msg, { ...opts, type: "success" }),
      error: (msg, opts) => push(msg, { ...opts, type: "error" }),
      info: (msg, opts) => push(msg, { ...opts, type: "info" }),
      dismiss,
    }),
    [push, dismiss]
  );

  const icons = { success: CheckCircle2, error: XCircle, info: Info };
  const colors = {
    success: "border-emerald-600/40 bg-emerald-950/80 text-emerald-200",
    error: "border-red-600/40 bg-red-950/80 text-red-200",
    info: "border-accent-500/40 bg-base-800 text-base-100",
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex w-80 max-w-[90vw] flex-col gap-2">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className={`animate-in flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur ${colors[t.type]}`}
              role="status"
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <p className="flex-1 leading-snug">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="text-current opacity-60 hover:opacity-100"
                aria-label="Dismiss notification"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
