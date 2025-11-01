"use client";

import Link from "next/link";

interface Vehiculo {
  id: string;
  nombre: string;
  anio: string;
  precio: string;
  ubicacion?: string;
  imagen?: string;
  categoria?: string;
  kilometraje?: string;
  transmision?: string;
  combustible?: string;
}

interface TarjetaVehiculoProps {
  vehiculo: Vehiculo;
}

export default function VehicleCard({ vehiculo }: TarjetaVehiculoProps) {
  return (
    <Link href={`/vehiculo/${vehiculo.id}`}>
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 transform cursor-pointer">
        {/* Imagen del vehículo */}
        <div className="h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center relative overflow-hidden">
          {vehiculo.imagen ? (
            <img
              src={vehiculo.imagen}
              alt={vehiculo.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-20 h-20 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          )}
          
          {/* Categoría */}
          {vehiculo.categoria && (
            <div className="absolute top-3 left-3">
              <span className="bg-red-700 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {vehiculo.categoria}
              </span>
            </div>
          )}
        </div>

        {/* Contenido de la carta */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {vehiculo.nombre} | {vehiculo.anio}
          </h2>
          
          <div className="mb-3 space-y-1">
            <p className="text-xl font-bold text-red-600">
              {vehiculo.precio}
            </p>
            {vehiculo.ubicacion && (
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {vehiculo.ubicacion}
              </p>
            )}
          </div>

          {/* Información adicional */}
          {(vehiculo.kilometraje || vehiculo.transmision || vehiculo.combustible) && (
            <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-500">
              {vehiculo.kilometraje && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {vehiculo.kilometraje}
                </span>
              )}
              {vehiculo.transmision && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {vehiculo.transmision}
                </span>
              )}
              {vehiculo.combustible && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {vehiculo.combustible}
                </span>
              )}
            </div>
          )}

          <button className="w-full bg-red-700 text-white px-4 py-3 rounded-lg hover:bg-red-800 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Ver detalles</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

