"use client";

import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { estaAutenticado, estaCargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!estaCargando && !estaAutenticado) {
      router.push("/login");
    }
  }, [estaAutenticado, estaCargando, router]);

  if (estaCargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!estaAutenticado) {
    return null;
  }

  return <>{children}</>;
}

