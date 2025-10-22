import React from 'react'

function Carta_v() {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 transform">
      {/* Imagen del vehículo */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <div className="text-6xl text-gray-400">🚗</div>
      </div>

      {/* Contenido de la carta */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Toyota Supra MK4 | 2020</h2>
        
        <div className="mb-3">
          <p className="text-lg font-bold text-red-600 mb-1">Precio $350,000</p>
          <p className="text-sm text-gray-600">Ubicación Tijuana B.C</p>
        </div>

        <button className="w-full bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 font-medium">
          <span>🚗</span>
          Ver detalles
        </button>
      </div>
    </div>
  )
}

export default Carta_v