import type { Metadata } from "next";
import "./globals.css";
import BarraNavegacion from "../components/diseno/BarraNavegacion";
import PiePagina from "../components/diseno/PiePagina";
import { ProveedorAutenticacion } from "../context/AuthContext";

export const metadata: Metadata = {
  title: "Mi Sitio con Next.js",
  description: "Hola yo soy paco",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <ProveedorAutenticacion>
          <BarraNavegacion />
          <main>{children}</main>
          <PiePagina/>
        </ProveedorAutenticacion>
      </body>
    </html>
  );
}
