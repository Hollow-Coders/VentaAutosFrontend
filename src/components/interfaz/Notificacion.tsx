"use client";

import { useState, useCallback } from "react";

type TipoToast = "success" | "error";

interface Toast {
  id: number;
  mensaje: string;
  tipo: TipoToast;
}

let contadorId = 0;

export function usarToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const mostrar = useCallback((mensaje: string, tipo: TipoToast = "success") => {
    const id = contadorId++;
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const cerrar = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { mostrar, cerrar, toasts };
}

export function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: number) => void }) {
  return (
    <div className="fixed top-6 right-6 z-[9999] space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto min-w-[320px] max-w-md px-5 py-4 rounded-xl shadow-2xl border-l-4 flex items-start gap-3 animate-slide-in-right backdrop-blur-sm ${
            toast.tipo === "success"
              ? "bg-gradient-to-r from-green-50 to-green-100 border-green-500 text-green-900"
              : "bg-gradient-to-r from-red-50 to-red-100 border-red-500 text-red-900"
          }`}
        >
          <div className={`flex-shrink-0 mt-0.5 ${
            toast.tipo === "success" ? "text-green-600" : "text-red-600"
          }`}>
            {toast.tipo === "success" ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold leading-relaxed ${
              toast.tipo === "success" ? "text-green-800" : "text-red-800"
            }`}>
              {toast.mensaje}
            </p>
          </div>
          <button
            onClick={() => onClose(toast.id)}
            className={`flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity ${
              toast.tipo === "success" ? "text-green-700" : "text-red-700"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}

