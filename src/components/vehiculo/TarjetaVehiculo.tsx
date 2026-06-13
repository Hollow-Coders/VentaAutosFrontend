import React from 'react'
import { Vehiculo } from '@/api/vehicles'

interface TarjetaVehiculoProps {
  vehicle: Vehiculo
  onVerDetalles?: (id: number) => void
  onEditar?: () => void
}

function TarjetaVehiculo({ vehicle, onVerDetalles, onEditar }: TarjetaVehiculoProps) {
  const fotoPrincipal = vehicle.foto_principal ?? null

  const formatearPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(precio)
  }

  const handleClick = () => {
    if (onVerDetalles) {
      onVerDetalles(vehicle.id)
    }
  }

  return (
    <div className="surface-card-hover overflow-hidden flex flex-col h-full group">
      <div className="h-44 bg-gray-100 dark:bg-slate-700/50 flex items-center justify-center overflow-hidden">
        {fotoPrincipal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fotoPrincipal}
            alt={`Foto de ${vehicle.nombre}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700">
            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 leading-snug">
          {vehicle.nombre}
        </h2>

        <div className="mb-4 space-y-1">
          <p className="text-lg font-semibold text-red-600 dark:text-red-400 tracking-tight">
            {formatearPrecio(vehicle.precio)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{vehicle.ubicacion}</p>
        </div>

        <div className="mt-auto space-y-2">
          {onEditar && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditar();
              }}
              className="w-full btn-secondary text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              Editar vehículo
            </button>
          )}
          <button
            onClick={handleClick}
            className="w-full btn-primary"
          >
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  )
}

export default TarjetaVehiculo
