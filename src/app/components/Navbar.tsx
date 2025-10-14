"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/Catalogo", label: "Catalogo" },
    { href: "/Subastas", label: "Subastas" },
    { href: "/Contacto", label: "Contacto"}
  ];

  return (
    <nav className="bg-white text-black p-4 border-b-4 border-b-red-700 shadow-sm">
      <div className="container mx-auto flex justify-center md:justify-center gap-6 md:gap-12">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`transition-colors rounded-2xl px-4 py-2 text-center font-medium
              hover:bg-red-700 hover:text-white
              ${pathname === link.href ? "bg-red-700 text-white font-semibold border-1 border-red-900" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
