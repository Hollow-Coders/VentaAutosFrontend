import React from 'react'
import { Vehiculo } from '@/api/vehicles'

interface CartaVProps {
  vehicle: Vehiculo
  onVerDetalles?: (id: number) => void
  onEditar?: () => void
}

function Carta_v({ vehicle, onVerDetalles, onEditar }: CartaVProps) {
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
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 transform flex flex-col h-full">
      {/* Imagen del vehículo */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {fotoPrincipal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fotoPrincipal}
            alt={`Foto de ${vehicle.nombre}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        )}
      </div>

      {/* Contenido de la carta */}
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">{vehicle.nombre}</h2>
        
        <div className="mb-3">
          <p className="text-lg font-bold text-red-600 mb-1">Precio {formatearPrecio(vehicle.precio)}</p>
          <p className="text-sm text-gray-600">Ubicación {vehicle.ubicacion}</p>
        </div>

        <div className="mt-auto space-y-2">
          {onEditar && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditar();
              }}
              className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-semibold text-sm flex items-center justify-center gap-2 shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Vehículo
            </button>
          )}
          <button 
            onClick={handleClick}
            className="w-full bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <span>🚗</span>
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  )
}

export default Carta_v