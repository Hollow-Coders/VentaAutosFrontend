"use client";

import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { servicioPerfil, Perfil } from "../../../api";
import { servicioVehiculo, VehiculoDetalle } from "../../../api/vehicles";
import EncabezadoPerfil from "../../../components/perfil/EncabezadoPerfil";
import VehiculosPerfil from "../../../components/perfil/VehiculosPerfil";
import ResenasPerfil from "../../../components/perfil/ResenasPerfil";

function FilaInfo({
  icono,
  etiqueta,
  valor,
  hint,
}: {
  icono: React.ReactNode;
  etiqueta: string;
  valor: string;
  hint?: string;
}) {
  return (
    <div className="flex gap-3 py-3.5 border-b border-slate-200/70 dark:border-slate-700/50 last:border-0 last:pb-0 first:pt-0">
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-center">
        {icono}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {etiqueta}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-100 break-words">
          {valor}
        </p>
        {hint && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{hint}</p>
        )}
      </div>
    </div>
  );
}

export default function PerfilPage() {
  const { usuario, estaAutenticado, estaCargando } = useAuth();
  const router = useRouter();
  const [perfil, establecerPerfil] = useState<Perfil | null>(null);
  const [cargandoPerfil, establecerCargandoPerfil] = useState(true);
  const [vehiculos, establecerVehiculos] = useState<VehiculoDetalle[]>([]);
  const [cargandoVehiculos, establecerCargandoVehiculos] = useState(true);

  useEffect(() => {
    if (!estaCargando && !estaAutenticado) {
      router.push("/login");
    }
  }, [estaAutenticado, estaCargando, router]);

  useEffect(() => {
    const cargarPerfil = async () => {
      if (!usuario?.id) return;

      establecerCargandoPerfil(true);
      try {
        const perfilData = await servicioPerfil.getByUsuarioId(Number(usuario.id));
        establecerPerfil(perfilData);
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        establecerPerfil(null);
      } finally {
        establecerCargandoPerfil(false);
      }
    };

    if (estaAutenticado && usuario?.id) {
      cargarPerfil();
    }
  }, [usuario?.id, estaAutenticado]);

  useEffect(() => {
    const cargarVehiculos = async () => {
      if (!usuario?.id) return;

      establecerCargandoVehiculos(true);
      try {
        const vehiculosData = await servicioVehiculo.getByUsuario(Number(usuario.id));
        establecerVehiculos(vehiculosData);
      } catch (error) {
        console.error("Error al cargar vehículos:", error);
        establecerVehiculos([]);
      } finally {
        establecerCargandoVehiculos(false);
      }
    };

    if (estaAutenticado && usuario?.id) {
      cargarVehiculos();
    }
  }, [usuario?.id, estaAutenticado]);

  const manejarActualizarPerfil = (perfilActualizado: Perfil) => {
    establecerPerfil(perfilActualizado);
  };

  const estadisticas = useMemo(() => {
    const activos = vehiculos.filter((v) => {
      const e = v.estado.toLowerCase();
      return !e.includes("vendido") && !e.includes("sold") && !e.includes("rechazado");
    }).length;
    const vendidos = vehiculos.filter((v) => {
      const e = v.estado.toLowerCase();
      return e.includes("vendido") || e.includes("sold");
    }).length;
    return { total: vehiculos.length, activos, vendidos };
  }, [vehiculos]);

  if (estaCargando) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!estaAutenticado || !usuario) {
    return null;
  }

  const nombreMostrar =
    usuario?.nombre_completo || usuario?.nombre || usuario?.correo?.split("@")[0] || "Usuario";
  const valoraciones: never[] = [];

  return (
    <div className="min-h-screen py-6 sm:py-10">
      <div className="container mx-auto px-4 max-w-6xl space-y-6">
        {/* Encabezado */}
        <div className="surface-card overflow-hidden">
          <EncabezadoPerfil
            usuario={usuario}
            perfil={perfil}
            alActualizarPerfil={manejarActualizarPerfil}
            estadisticas={{
              totalVehiculos: estadisticas.total,
              vehiculosActivos: estadisticas.activos,
              vehiculosVendidos: estadisticas.vendidos,
            }}
          />
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Publicados", value: estadisticas.total, accent: "text-red-600 dark:text-red-400" },
            { label: "Activos", value: estadisticas.activos, accent: "text-emerald-600 dark:text-emerald-400" },
            { label: "Vendidos", value: estadisticas.vendidos, accent: "text-slate-600 dark:text-slate-300" },
            { label: "Valoraciones", value: 0, accent: "text-amber-500 dark:text-amber-400" },
          ].map((stat) => (
            <div key={stat.label} className="surface-card px-4 py-4 sm:px-5 sm:py-5 text-center sm:text-left">
              <p className={`text-2xl sm:text-3xl font-semibold tabular-nums ${stat.accent}`}>
                {cargandoVehiculos && stat.label !== "Valoraciones" ? "—" : stat.value}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="surface-card p-5 sm:p-6">
              <p className="section-label mb-1">Contacto</p>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Datos de tu cuenta
              </h2>

              {cargandoPerfil ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div>
                  <FilaInfo
                    icono={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                    etiqueta="Nombre"
                    valor={nombreMostrar}
                  />
                  <FilaInfo
                    icono={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                    etiqueta="Correo"
                    valor={usuario?.correo || "Sin correo"}
                    hint="Recibirás notificaciones y avisos de venta aquí."
                  />
                  <FilaInfo
                    icono={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    }
                    etiqueta="Teléfono"
                    valor={perfil?.telefono || "No especificado"}
                  />
                  <FilaInfo
                    icono={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    }
                    etiqueta="Ubicación"
                    valor={perfil?.ciudad || "No especificada"}
                    hint={perfil?.direccion || undefined}
                  />
                </div>
              )}
            </div>

            {perfil?.descripcion && (
              <div className="surface-card p-5 sm:p-6">
                <p className="section-label mb-1">Acerca de</p>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
                  Tu presentación
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {perfil.descripcion}
                </p>
              </div>
            )}

            <div className="surface-card p-5 sm:p-6">
              <p className="section-label mb-3">Acciones</p>
              <div className="flex flex-col gap-2">
                <Link href="/creacion-vehiculo" className="btn-primary w-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Vender vehículo
                </Link>
                <Link href="/catalogo" className="btn-secondary w-full">
                  Ver catálogo
                </Link>
                <Link href="/mis-compras" className="btn-ghost w-full justify-start">
                  Mis compras
                </Link>
              </div>
            </div>
          </aside>

          {/* Contenido */}
          <div className="lg:col-span-8 space-y-6">
            {cargandoVehiculos ? (
              <div className="surface-card flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <VehiculosPerfil vehicles={vehiculos} isOwner={true} />
            )}

            <ResenasPerfil valoraciones={valoraciones} promedio={null} />
          </div>
        </div>
      </div>
    </div>
  );
}
