"use client";

import Link from "next/link";

interface AuthPromptProps {
  onClose: () => void;
  action: string;
}

export default function SolicitudAutenticacion({ onClose, action }: AuthPromptProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Inicia Sesión Requerido
          </h3>

          <p className="text-gray-600 mb-6">
            Necesitas iniciar sesión para {action}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="flex-1 bg-red-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-800 transition-colors text-center"
              onClick={onClose}
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="flex-1 border border-red-700 text-red-700 px-6 py-3 rounded-full font-semibold hover:bg-red-50 transition-colors text-center"
              onClick={onClose}
            >
              Registrarse
            </Link>
          </div>

          <button
            onClick={onClose}
            className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
