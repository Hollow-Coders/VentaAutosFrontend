"use client"; // Necesario si usas hooks o navegación cliente

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/Catalogo", label: "Catalogo" },
    { href: "/Subastas", label: "Subastas" },
    { href: "/Contacto", label: "Contacto"}
  ];

  return (
    <nav className=" bg-white text-black p-4 flex gap-12 justify-center-safe border-b-4 border-b-red-800">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`hover:text-white transition-colors hover:bg-red-800 w-20 text-center rounded-2xl ${
            pathname === link.href ? "text-white bg-red-800 font-semibold" : ""
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
