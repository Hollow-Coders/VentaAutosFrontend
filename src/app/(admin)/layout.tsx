"use client";

import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { estaAutenticado, estaCargando, esAdministrador } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!estaCargando) {
      if (!estaAutenticado) {
        router.push("/login");
        return;
      }

      // Verificar si el usuario es administrador (rol ID = 1)
      if (!esAdministrador) {
        router.push("/");
        return;
      }
    }
  }, [estaAutenticado, estaCargando, esAdministrador, router]);

  if (estaCargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  if (!estaAutenticado || !esAdministrador) {
    return null;
  }

  return <>{children}</>;
}

