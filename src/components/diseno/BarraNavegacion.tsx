"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import MenuUsuario from "./MenuUsuario";

const BarraNavegacion = () => {
  const ruta = usePathname();
  const { estaAutenticado, usuario, estaCargando } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const enlacesPublicos = [
    { href: "/", label: "Inicio" },
    { href: "/catalogo", label: "Catálogo" },
    { href: "/subastas", label: "Subastas" },
    { href: "/contacto", label: "Contacto" },
  ];

  const cerrarMenu = () => setMenuAbierto(false);

  const enlaceClassName = (href: string, mobile = false) =>
    `transition-colors text-sm font-medium ${
      mobile ? "block w-full px-4 py-3 rounded-xl" : "px-3 py-2 rounded-lg"
    } ${
      ruta === href
        ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10"
        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-slate-800/60"
    }`;

  const authSectionDesktop = () => {
    if (estaCargando) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Cargando...</span>
        </div>
      );
    }

    if (estaAutenticado && usuario) {
      return <MenuUsuario user={usuario} />;
    }

    return (
      <>
        <Link href="/login" className="btn-ghost text-red-600 dark:text-red-400">
          Iniciar sesión
        </Link>
        <Link href="/register" className="btn-primary">
          Registrarse
        </Link>
      </>
    );
  };

  const authSectionMobile = () => {
    if (estaCargando) {
      return (
        <div className="flex items-center justify-center py-3 text-sm text-gray-500 dark:text-gray-400">
          Cargando...
        </div>
      );
    }

    if (estaAutenticado && usuario) {
      return null;
    }

    return (
      <div className="flex flex-col gap-2">
        <Link href="/login" onClick={cerrarMenu} className="btn-secondary w-full text-center">
          Iniciar sesión
        </Link>
        <Link href="/register" onClick={cerrarMenu} className="btn-primary w-full text-center">
          Registrarse
        </Link>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-50/90 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 sm:py-3.5 gap-3">
          <Link href="/" className="flex items-center min-w-0 flex-shrink gap-2.5" onClick={cerrarMenu}>
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-50 truncate tracking-tight">
              Pagina Autos
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {enlacesPublicos.map((enlace) => (
              <Link key={enlace.href} href={enlace.href} className={enlaceClassName(enlace.href)}>
                {enlace.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-2">
              {authSectionDesktop()}
            </div>

            {estaAutenticado && usuario && !estaCargando && (
              <div className="lg:hidden">
                <MenuUsuario user={usuario} />
              </div>
            )}

            <button
              type="button"
              className="lg:hidden p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMenuAbierto((prev) => !prev)}
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuAbierto}
            >
              {menuAbierto ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {menuAbierto && (
          <>
            <button
              type="button"
              className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40 lg:hidden"
              onClick={cerrarMenu}
              aria-label="Cerrar menú"
            />
            <div className="lg:hidden relative z-50 border-t border-slate-200/70 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-4 space-y-1">
              {enlacesPublicos.map((enlace) => (
                <Link
                  key={enlace.href}
                  href={enlace.href}
                  onClick={cerrarMenu}
                  className={enlaceClassName(enlace.href, true)}
                >
                  {enlace.label}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-gray-100 dark:border-slate-800">
                {authSectionMobile()}
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default BarraNavegacion;
