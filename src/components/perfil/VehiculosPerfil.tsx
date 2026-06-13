"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TarjetaVehiculo from "../vehiculo/TarjetaVehiculo";
import { VehiculoDetalle } from "../../api/vehicles";

interface ProfileVehiclesProps {
  vehicles: VehiculoDetalle[];
  isOwner: boolean;
}

export default function VehiculosPerfil({ vehicles, isOwner }: ProfileVehiclesProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'disponible' | 'vendido' | 'revision' | 'rechazado'>('all');

  // Mapear estados del backend a estados del filtro
  const mapEstadoToFilter = (estado: string): 'disponible' | 'vendido' | 'revision' | 'rechazado' => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('vendido') || estadoLower.includes('sold')) return 'vendido';
    if (estadoLower.includes('rechazado') || estadoLower.includes('rejected')) return 'rechazado';
    if (estadoLower.includes('revision') || estadoLower.includes('en_revision') || estadoLower.includes('pendiente') || estadoLower.includes('pending')) return 'revision';
    return 'disponible';
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    if (filter === 'all') {
      // Si no es el propietario, excluir vehículos en revisión y rechazados de "Todos"
      if (!isOwner) {
        const vehicleFilter = mapEstadoToFilter(vehicle.estado);
        return vehicleFilter !== 'revision' && vehicleFilter !== 'rechazado';
      }
      return true;
    }
    const vehicleFilter = mapEstadoToFilter(vehicle.estado);
    return vehicleFilter === filter;
  });

  const getStatusBadge = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('vendido') || estadoLower.includes('sold')) {
      return { text: 'Vendido', color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' };
    }
    if (estadoLower.includes('rechazado') || estadoLower.includes('rejected')) {
      return { text: 'Rechazado', color: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' };
    }
    if (estadoLower.includes('revision') || estadoLower.includes('en_revision') || estadoLower.includes('pendiente') || estadoLower.includes('pending')) {
      return { text: 'Revisión', color: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300' };
    }
    return { text: 'Activo', color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' };
  };

  const handleVerDetalles = (id: number) => {
    router.push(`/catalogo/${id}`);
  };

  const handleEditarVehiculo = (id: number) => {
    router.push(`/editar-vehiculo/${id}`);
  };

  // Convertir VehiculoDetalle a formato Vehiculo para TarjetaVehiculo
  const convertirAVehiculo = (vehiculoDetalle: VehiculoDetalle) => {
    // Extraer la primera foto si existe
    let fotoPrincipal: string | null = null;
    if (vehiculoDetalle.fotos && vehiculoDetalle.fotos.length > 0) {
      const primeraFoto = vehiculoDetalle.fotos[0];
      // Si es un string (URL), usarlo directamente
      if (typeof primeraFoto === 'string') {
        fotoPrincipal = primeraFoto;
      } 
      // Si es un objeto VehiculoFoto, extraer la URL
      else if (primeraFoto && typeof primeraFoto === 'object' && 'url_imagen_url' in primeraFoto) {
        fotoPrincipal = primeraFoto.url_imagen_url || null;
      } else if (primeraFoto && typeof primeraFoto === 'object' && 'url_imagen' in primeraFoto) {
        // Si tiene url_imagen, construir la URL completa
        const urlImagen = primeraFoto.url_imagen;
        if (urlImagen) {
          fotoPrincipal = urlImagen.startsWith('http') ? urlImagen : `${process.env.NEXT_PUBLIC_API_URL || ''}${urlImagen}`;
        }
      }
    }

    return {
      id: vehiculoDetalle.id,
      nombre: `${vehiculoDetalle.marca_nombre} ${vehiculoDetalle.modelo_nombre} ${vehiculoDetalle.año}`,
      marca_nombre: vehiculoDetalle.marca_nombre,
      modelo_nombre: vehiculoDetalle.modelo_nombre,
      año: vehiculoDetalle.año,
      precio: vehiculoDetalle.precio,
      ubicacion: vehiculoDetalle.ubicacion,
      foto_principal: fotoPrincipal,
    };
  };

  return (
    <div className="surface-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start mb-6">
        <div className="min-w-0">
          <p className="section-label mb-1">Inventario</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100">
            {isOwner ? "Mis vehículos" : "Vehículos de este vendedor"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {filteredVehicles.length} vehículo{filteredVehicles.length !== 1 ? "s" : ""}
            {filter !== "all" &&
              ` · ${
                filter === "disponible"
                  ? "Activos"
                  : filter === "vendido"
                    ? "Vendidos"
                    : filter === "revision"
                      ? "En revisión"
                      : "Rechazados"
              }`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:flex-shrink-0">
          <div className="flex gap-1.5 flex-wrap">
            {(
              [
                ["all", "Todos"],
                ["disponible", "Activos"],
                ["vendido", "Vendidos"],
                ...(isOwner
                  ? ([
                      ["revision", "Revisión"],
                      ["rechazado", "Rechazados"],
                    ] as const)
                  : []),
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  filter === key
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {isOwner && (
            <Link href="/creacion-vehiculo" className="btn-primary whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar
            </Link>
          )}
        </div>
      </div>

      {/* Grid de vehículos */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-14 section-muted rounded-xl">
          <div className="w-16 h-16 bg-slate-200/60 dark:bg-slate-700/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <p className="text-slate-700 dark:text-slate-200 font-medium mb-1">
            {isOwner ? "Aún no tienes vehículos publicados" : "Este vendedor no tiene vehículos"}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
            {isOwner ? "Publica tu primer auto para empezar a vender" : "Intenta con otro vendedor"}
          </p>
          {isOwner && (
            <Link href="/creacion-vehiculo" className="btn-primary">
              Publicar vehículo
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => {
            const vehiculo = convertirAVehiculo(vehicle);
            const badge = getStatusBadge(vehicle.estado);
            const estadoFiltro = mapEstadoToFilter(vehicle.estado);
            // Solo mostrar botón de editar para vehículos rechazados
            const puedeEditar = isOwner && estadoFiltro === 'rechazado';
            
            return (
              <div key={vehicle.id} className="relative">
                {/* Badge de estado */}
                <div className="absolute top-3 right-3 z-20">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color} shadow-md`}>
                    {badge.text}
                  </span>
                </div>
                {/* Carta con botón de editar integrado */}
                <TarjetaVehiculo
                  vehicle={vehiculo}
                  onVerDetalles={handleVerDetalles}
                  onEditar={puedeEditar ? () => handleEditarVehiculo(vehicle.id) : undefined}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
