import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
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
          <Navbar />
          <main>{children}</main>
          <Footer/>
        </ProveedorAutenticacion>
      </body>
    </html>
  );
}
