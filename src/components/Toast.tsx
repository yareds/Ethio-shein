import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastType = 'error' | 'success' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'error', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto-dismiss toast after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notifications Overlay Container */}
      <div className="fixed top-5 right-5 z-[200] flex flex-col space-y-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start space-x-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-fadeIn ${
              toast.type === 'error' || toast.type === 'warning'
                ? 'bg-ivory border-terracotta/40 text-espresso shadow-terracotta/10'
                : toast.type === 'success'
                ? 'bg-ivory border-forest/40 text-espresso shadow-forest/10'
                : 'bg-ivory border-espresso/20 text-espresso shadow-espresso/10'
            }`}
            id={`toast-banner-${toast.id}`}
          >
            {toast.type === 'error' || toast.type === 'warning' ? (
              <div className="p-2 bg-terracotta/15 text-terracotta rounded-xl shrink-0">
                <AlertTriangle className="w-5 h-5 text-terracotta" />
              </div>
            ) : toast.type === 'success' ? (
              <div className="p-2 bg-forest/15 text-forest rounded-xl shrink-0">
                <CheckCircle2 className="w-5 h-5 text-forest" />
              </div>
            ) : (
              <div className="p-2 bg-espresso/10 text-espresso rounded-xl shrink-0">
                <Info className="w-5 h-5 text-espresso" />
              </div>
            )}

            <div className="flex-1 min-w-0 pt-0.5">
              {toast.title && (
                <h4 className="text-xs font-bold font-fraunces uppercase tracking-wider text-espresso mb-0.5">
                  {toast.title}
                </h4>
              )}
              <p className="text-xs font-medium text-espresso-soft leading-snug break-words">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-espresso-soft hover:text-espresso p-1 rounded-lg hover:bg-black/5 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: (msg: string) => console.log('Toast:', msg),
    };
  }
  return context;
}
