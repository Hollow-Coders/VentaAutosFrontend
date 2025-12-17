"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Carta_v from "../vehicle/Carta_v";
import { VehiculoDetalle } from "../../api/vehicles";

interface ProfileVehiclesProps {
  vehicles: VehiculoDetalle[];
  isOwner: boolean;
}

export default function ProfileVehicles({ vehicles, isOwner }: ProfileVehiclesProps) {
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
      return { text: 'Vendido', color: 'bg-gray-100 text-gray-600' };
    }
    if (estadoLower.includes('rechazado') || estadoLower.includes('rejected')) {
      return { text: 'Rechazado', color: 'bg-red-100 text-red-700' };
    }
    if (estadoLower.includes('revision') || estadoLower.includes('en_revision') || estadoLower.includes('pendiente') || estadoLower.includes('pending')) {
      return { text: 'Revisión', color: 'bg-yellow-100 text-yellow-700' };
    }
    return { text: 'Activo', color: 'bg-green-100 text-green-700' };
  };

  const handleVerDetalles = (id: number) => {
    router.push(`/catalogo/${id}`);
  };

  const handleEditarVehiculo = (id: number) => {
    router.push(`/editar-vehiculo/${id}`);
  };

  // Convertir VehiculoDetalle a formato Vehiculo para Carta_v
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
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8">
      {/* Header con filtros y botones */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isOwner ? 'Mis Vehículos' : 'Vehículos de este vendedor'}
          </h2>
          <p className="text-gray-600 text-sm">
            {filteredVehicles.length} vehículo{filteredVehicles.length !== 1 ? 's' : ''} {filter !== 'all' ? `(${filter === 'disponible' ? 'Activos' : filter === 'vendido' ? 'Vendidos' : filter === 'revision' ? 'Revisión' : filter === 'rechazado' ? 'Rechazados' : filter})` : ''}
          </p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap mt-4 md:mt-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
              filter === 'all' 
                ? 'bg-red-700 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('disponible')}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
              filter === 'disponible' 
                ? 'bg-red-700 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Activos
          </button>
          <button
            onClick={() => setFilter('vendido')}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
              filter === 'vendido' 
                ? 'bg-red-700 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Vendidos
          </button>
          {isOwner && (
            <>
              <button
                onClick={() => setFilter('revision')}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                  filter === 'revision' 
                    ? 'bg-red-700 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Revisión
              </button>
              <button
                onClick={() => setFilter('rechazado')}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                  filter === 'rechazado' 
                    ? 'bg-red-700 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Rechazados
              </button>
            </>
          )}
        </div>

        {/* Botón para agregar vehículo (solo propietario) */}
        {isOwner && (
          <div className="mt-4 md:mt-0">
            <Link
              href="/creacion_vehiculo"
              className="inline-flex items-center px-6 py-3 bg-red-700 text-white rounded-full font-semibold hover:bg-red-800 transition-colors text-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar Vehículo
            </Link>
          </div>
        )}
      </div>

      {/* Grid de vehículos */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-semibold mb-2">
            {isOwner ? 'No tienes vehículos' : 'Este vendedor no tiene vehículos'}
          </p>
          <p className="text-gray-500 text-sm">
            {isOwner ? 'Comienza agregando tu primer vehículo' : 'Intenta con otro vendedor'}
          </p>
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
                <Carta_v
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
