'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };

  const getColor = (type: ToastType) => {
    switch (type) {
      case 'success': return 'from-green-500/20 to-green-500/5 border-green-500/30 text-green-400';
      case 'error': return 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400';
      case 'warning': return 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 text-yellow-400';
      default: return 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl bg-gradient-to-r ${getColor(toast.type)} shadow-lg animate-slide-in min-w-[300px]`}
          >
            <span className="material-symbols-outlined text-xl">{getIcon(toast.type)}</span>
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="hover:opacity-70 transition-opacity"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
