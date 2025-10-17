"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/Catalogo", label: "Catálogo" },
    { href: "/Subastas", label: "Subastas" },
    { href: "/Contacto", label: "Contacto"}
  ];

  return (
    <div className="bg-white">
      {/* Navegación principal */}
      <nav className="bg-white border-b border-red-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>

            {/* Enlaces de navegación */}
            <div className="flex gap-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors rounded-full px-4 py-2 text-center font-medium text-sm
                    ${pathname === link.href 
                      ? "bg-red-700 text-white font-semibold" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Botones de inicio de sesion y registro */}
            <div className="flex items-center space-x-3">
              <button className="text-red-700 border border-red-700 bg-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-50 transition-colors">
                Sign In
              </button>
              <button className="bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-800 transition-colors">
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
