"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import MenuUsuario from "./MenuUsuario";

const BarraNavegacion = () => {
  const ruta = usePathname();
  const { estaAutenticado, usuario, estaCargando } = useAuth();

  const enlacesPublicos = [
    { href: "/", label: "Inicio" },
    { href: "/catalogo", label: "Catálogo" },
    { href: "/subastas", label: "Subastas" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <div className="bg-white">
      {/* Navegación principal */}
      <nav className="bg-white border-b border-red-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Pagina Autos
                </span>
              </Link>
            </div>

            {/* Enlaces de navegación - SIEMPRE VISIBLES */}
            <div className="flex gap-8">
              {enlacesPublicos.map((enlace) => (
                <Link
                  key={enlace.href}
                  href={enlace.href}
                  className={`transition-colors rounded-full px-4 py-2 text-center font-medium text-sm
                    ${
                      ruta === enlace.href
                        ? "bg-red-700 text-white font-semibold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                  {enlace.label}
                </Link>
              ))}
            </div>

            {/* Área de autenticación */}
            <div className="flex items-center space-x-3">
              {estaCargando ? (
                // Estado de carga
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">Cargando...</span>
                </div>
              ) : estaAutenticado && usuario ? (
                // Usuario autenticado - Mostrar menú de usuario
                <MenuUsuario user={usuario} />
              ) : (
                // Usuario no autenticado - Mostrar botones de login/register
                <>
                  <Link
                    href="/login"
                    className="text-red-700 border border-red-700 bg-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/register"
                    className="bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-800 transition-colors"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default BarraNavegacion;