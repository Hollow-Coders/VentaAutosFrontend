"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { servicioPerfil } from "../../api";

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

export default function UserMenu({ user }: PropsMenuUsuario) {
  const [estaAbierto, establecerEstadoAbierto] = useState(false);
  const [fotoPerfil, establecerFotoPerfil] = useState<string | null>(null);
  const [cargandoFoto, establecerCargandoFoto] = useState(true);
  const { cerrarSesion } = useAuth();

  // Cargar foto de perfil
  useEffect(() => {
    const cargarFotoPerfil = async () => {
      if (!user?.id) {
        establecerCargandoFoto(false);
        return;
      }
      
      try {
        const perfil = await servicioPerfil.getByUsuarioId(Number(user.id));
        if (perfil.foto_perfil_url) {
          establecerFotoPerfil(perfil.foto_perfil_url);
        }
      } catch (error) {
        // Si no hay perfil, no es error crítico
        console.log('No se encontró perfil o foto');
      } finally {
        establecerCargandoFoto(false);
      }
    };

    cargarFotoPerfil();
  }, [user?.id]);

  const manejarCierreSesion = () => {
    cerrarSesion();
    establecerEstadoAbierto(false);
  };

  // Obtener nombre para mostrar (con validación)
  const nombreMostrar = user?.nombre_completo || user?.nombre || user?.correo?.split('@')[0] || 'U';
  const inicial = nombreMostrar?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="relative">
      <button
        onClick={() => establecerEstadoAbierto(!estaAbierto)}
        className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors"
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
        <span className="text-gray-700 font-medium hidden sm:block">
          {nombreMostrar}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
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
          <div
            className="fixed inset-0 z-10"
            onClick={() => establecerEstadoAbierto(false)}
          />
          
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-2">
              {/* Información del usuario */}
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{nombreMostrar}</p>
                <p className="text-xs text-gray-500">{user?.correo || 'Sin correo'}</p>
              </div>

              {/* Enlaces del menú */}
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => establecerEstadoAbierto(false)}
              >
                Mi Dashboard
              </Link>
              <Link
                href="/perfil"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => establecerEstadoAbierto(false)}
              >
                Mi Perfil
              </Link>
              <Link
                href="/mis-pujas"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => establecerEstadoAbierto(false)}
              >
                Mis Pujas
              </Link>
              <Link
                href="/mis-compras"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => establecerEstadoAbierto(false)}
              >
                Mis Compras
              </Link>
              
              <hr className="my-2" />
              
              <button
                onClick={manejarCierreSesion}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
