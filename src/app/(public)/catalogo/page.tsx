import React from 'react'
import Carta_v from '../../../components/vehicle/Carta_v'

function Catalogo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        
        {/* Barra lateral con filtros */}
        <div className="w-full lg:w-80 bg-white border-r border-gray-200 p-6 hidden lg:block">
          
          {/* Perfil del usuario */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xl">👤</span>
              </div>
              <span className="text-lg font-semibold text-gray-800">Alex Cárdenas</span>
            </div>
          </div>

          {/* Sección de filtros */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h3>
            <div className="space-y-3">
              
              {/* Filtro de Kilometraje */}
              <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-red-300 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transform hover:scale-105">
                <option>Kilometraje</option>
                <option>0 - 10,000 km</option>
                <option>10,000 - 50,000 km</option>
                <option>50,000 - 100,000 km</option>
                <option>100,000+ km</option>
              </select>

              {/* Filtro de Marca */}
              <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-red-300 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transform hover:scale-105">
                <option>Marca</option>
                <option>Toyota</option>
                <option>Chevrolet</option>
                <option>BMW</option>
                <option>Cadillac</option>
                <option>Porsche</option>
                <option>Infiniti</option>
              </select>

              {/* Filtro de Año */}
              <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-red-300 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transform hover:scale-105">
                <option>Año</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
                <option>2020</option>
                <option>2019</option>
              </select>

              {/* Filtro de Modelo */}
              <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-red-300 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transform hover:scale-105">
                <option>Modelo</option>
                <option>Supra</option>
                <option>Impala</option>
                <option>M3</option>
                <option>Escalade</option>
                <option>911</option>
                <option>Q50</option>
              </select>

              {/* Filtro de Transmisión */}
              <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-red-300 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transform hover:scale-105">
                <option>Transmisión</option>
                <option>Automática</option>
                <option>Manual</option>
                <option>CVT</option>
              </select>

              {/* Filtro de Tipo de vehículo */}
              <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-red-300 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transform hover:scale-105">
                <option>Tipo de vehículo</option>
                <option>Sedán</option>
                <option>SUV</option>
                <option>Deportivo</option>
                <option>Pickup</option>
                <option>Hatchback</option>
              </select>
            </div>
          </div>
        </div>

        {/* Área principal de contenido */}
        <div className="flex-1 p-6">
          
          {/* Título y barra de búsqueda */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Vehículos</h1>
              <button className="lg:hidden bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium">
                Filtros
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                placeholder="Busca tu auto" 
                className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-red-300 hover:shadow-md transition-all duration-300"
              />
              <button className="bg-red-700 text-white px-6 py-4 rounded-lg hover:bg-red-800 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium">
                Buscar
              </button>
            </div>
          </div>

          {/* Grid de vehículos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Carta_v />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Catalogo