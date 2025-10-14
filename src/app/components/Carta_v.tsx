import React from 'react'

function Carta_v() {
  return (
     <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 hover:shadow-md transition-all duration-200 max-w-sm">
      <h2 className="text-xl font-semibold text-gray-800">Chevrolet Camaro SS</h2>
      <p className="text-sm text-gray-500 mb-2">Marca: Chevrolet</p>

      <div className="flex flex-col gap-1 text-sm text-gray-600 mb-3">
        <p><span className="font-medium text-gray-700">Año:</span> 2022</p>
        <p><span className="font-medium text-gray-700">Color:</span> Rojo</p>
        <p className="text-gray-500">
          Potente motor V8 con diseño icónico y excelente desempeño deportivo.
        </p>
      </div>

      <div className="flex justify-between items-center mt-3">
        <span className="text-lg font-bold text-red-600">$890,000</span>
        <button className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition">
          Ver detalles
        </button>
      </div>
    </div>
  )
}

export default Carta_v