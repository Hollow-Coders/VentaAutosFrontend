"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { servicioPerfil } from "../../api";
import { useTheme } from "../../context/ThemeContext";

interface Usuario {
  id: number | string;
  nombre: string;
  apellido?: string;
  nombre_completo?: string;
  correo: string;
  avatar?: string;
}

interface PropsMenuUsuario {
  user: Usuario;
}

export default function UserMenu({ user }: Readonly<PropsMenuUsuario>) {
  const [estaAbierto, setEstaAbierto] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [cargandoFoto, setCargandoFoto] = useState(true);
  const { cerrarSesion } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  // Cargar foto de perfil
  useEffect(() => {
    const cargarFotoPerfil = async () => {
      if (!user?.id) {
        setCargandoFoto(false);
        return;
      }
      
      try {
        const perfil = await servicioPerfil.getByUsuarioId(Number(user.id));
        if (perfil.foto_perfil_url) {
          setFotoPerfil(perfil.foto_perfil_url);
        }
      } catch {
        // Si no hay perfil, no es error crítico
        console.log('No se encontró perfil o foto');
      } finally {
        setCargandoFoto(false);
      }
    };

    cargarFotoPerfil();
  }, [user?.id]);

  const manejarCierreSesion = () => {
    cerrarSesion();
    setEstaAbierto(false);
  };

  // Obtener nombre para mostrar (con validación)
  const nombreMostrar = user?.nombre_completo || user?.nombre || user?.correo?.split('@')[0] || 'U';
  const inicial = nombreMostrar?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="relative">
      <button
        onClick={() => setEstaAbierto(!estaAbierto)}
        className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center overflow-hidden">
          {fotoPerfil && !cargandoFoto ? (
            <img 
              src={fotoPerfil} 
              alt={`Foto de ${nombreMostrar}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-sm font-semibold">
              {inicial}
            </span>
          )}
        </div>
        <span className="text-gray-700 dark:text-gray-200 font-medium hidden sm:block">
          {nombreMostrar}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 dark:text-gray-300 transition-transform ${
            estaAbierto ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {estaAbierto && (
        <>
          {/* Overlay para cerrar el menú */}
          <button
            type="button"
            aria-label="Cerrar menú de usuario"
            className="fixed inset-0 z-10"
            onClick={() => setEstaAbierto(false)}
          />
          
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="py-2">
              {/* Información del usuario */}
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{nombreMostrar}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.correo || 'Sin correo'}</p>
              </div>

              {/* Enlaces del menú */}
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setEstaAbierto(false)}
              >
                Mi Dashboard
              </Link>
              <Link
                href="/perfil"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setEstaAbierto(false)}
              >
                Mi Perfil
              </Link>
              <Link
                href="/mis-pujas"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setEstaAbierto(false)}
              >
                Mis Pujas
              </Link>
              <Link
                href="/mis-compras"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setEstaAbierto(false)}
              >
                Mis Compras
              </Link>
              <Link
                href="/administracion"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setEstaAbierto(false)}
              >
                Administración
              </Link>

              <button
                onClick={toggleTheme}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
              >
                <span>{isDarkMode ? "Modo claro" : "Modo oscuro"}</span>
                <span
                  className={`inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    isDarkMode ? "bg-red-700" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${
                      isDarkMode ? "translate-x-4" : "translate-x-1"
                    }`}
                  />
                </span>
              </button>
              
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
              
              <button
                onClick={manejarCierreSesion}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
