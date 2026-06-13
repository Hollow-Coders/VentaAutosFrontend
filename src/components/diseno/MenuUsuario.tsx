"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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

export default function MenuUsuario({ user }: Readonly<PropsMenuUsuario>) {
  const [estaAbierto, setEstaAbierto] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [cargandoFoto, setCargandoFoto] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const { cerrarSesion, esAdministrador } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    if (!estaAbierto) return;

    const cerrarSiClickFuera = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setEstaAbierto(false);
      }
    };

    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setEstaAbierto(false);
      }
    };

    document.addEventListener("mousedown", cerrarSiClickFuera);
    document.addEventListener("keydown", cerrarConEscape);

    return () => {
      document.removeEventListener("mousedown", cerrarSiClickFuera);
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, [estaAbierto]);

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

  const nombreMostrar = user?.nombre_completo || user?.nombre || user?.correo?.split('@')[0] || 'U';
  const inicial = nombreMostrar?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-expanded={estaAbierto}
        aria-haspopup="true"
        onClick={() => setEstaAbierto(!estaAbierto)}
        className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
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
        <span className="text-slate-700 dark:text-slate-200 font-medium hidden sm:block truncate max-w-[140px] lg:max-w-[200px]">
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

      {estaAbierto && (
          <div className="absolute right-0 mt-2 w-56 surface-card py-1 z-50 shadow-md">
            <div className="py-2">
              <div className="px-4 py-2 border-b border-slate-200/70 dark:border-slate-700/60">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{nombreMostrar}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.correo || 'Sin correo'}</p>
              </div>

              <Link
                href="/dashboard"
                className="block px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-colors"
                onClick={() => setEstaAbierto(false)}
              >
                Mi Dashboard
              </Link>
              <Link
                href="/perfil"
                className="block px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-colors"
                onClick={() => setEstaAbierto(false)}
              >
                Mi Perfil
              </Link>
              <Link
                href="/mis-pujas"
                className="block px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-colors"
                onClick={() => setEstaAbierto(false)}
              >
                Mis Pujas
              </Link>
              <Link
                href="/mis-compras"
                className="block px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-colors"
                onClick={() => setEstaAbierto(false)}
              >
                Mis Compras
              </Link>
              {esAdministrador && (
                <Link
                  href="/administracion"
                  className="block px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-colors"
                  onClick={() => setEstaAbierto(false)}
                >
                  Administración
                </Link>
              )}

              <button
                onClick={toggleTheme}
                className="w-full px-4 py-2.5 text-sm text-left text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between"
              >
                <span>{isDarkMode ? "Modo claro" : "Modo oscuro"}</span>
                <span
                  className={`inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    isDarkMode ? "bg-red-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-slate-50 transition-transform ${
                      isDarkMode ? "translate-x-4" : "translate-x-1"
                    }`}
                  />
                </span>
              </button>
              
              <hr className="my-2 border-slate-200/70 dark:border-slate-700/60" />
              
              <button
                onClick={manejarCierreSesion}
                className="block w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
      )}
    </div>
  );
}
