
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Carta_v from '../../../components/vehicle/Carta_v'
import { servicioVehiculo, Vehiculo, FiltrosCatalogo } from '@/api/vehicles'
import { servicioMarca, Marca } from '@/api/brands'
import { servicioModelo, Modelo } from '@/api/models'
import { useAuth } from '@/hooks/useAuth'

function Catalogo() {
  const router = useRouter()
  const { usuario } = useAuth()
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [modelos, setModelos] = useState<Modelo[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  
  // Estados de filtros del formulario
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('')
  const [modeloSeleccionado, setModeloSeleccionado] = useState('')
  const [añoMin, setAñoMin] = useState('')
  const [añoMax, setAñoMax] = useState('')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [ubicacionFiltro, setUbicacionFiltro] = useState('')

  // Cargar marcas y modelos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [marcasData, modelosData] = await Promise.all([
          servicioMarca.getAll(),
          servicioModelo.getAll(),
        ])
        setMarcas(marcasData)
        setModelos(modelosData)
      } catch (err) {
        console.error('Error cargando marcas/modelos:', err)
      }
    }
    cargarDatos()
  }, [])

  // Cargar vehículos inicialmente
  useEffect(() => {
    const cargarVehiculos = async () => {
      setCargando(true)
      setError(null)
      try {
        const data = await servicioVehiculo.getAll()
        setVehiculos(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar vehículos')
        console.error('Error cargando vehículos:', err)
      } finally {
        setCargando(false)
      }
    }
    cargarVehiculos()
  }, [])

  // Función para aplicar filtros manualmente
  const aplicarFiltros = async () => {
    const nuevosFiltros: FiltrosCatalogo = {}
    if (marcaSeleccionada) nuevosFiltros.marca = marcaSeleccionada
    if (modeloSeleccionado) nuevosFiltros.modelo = modeloSeleccionado
    if (añoMin) nuevosFiltros.año_min = Number.parseInt(añoMin, 10)
    if (añoMax) nuevosFiltros.año_max = Number.parseInt(añoMax, 10)
    if (precioMin) nuevosFiltros.precio_min = Number.parseFloat(precioMin)
    if (precioMax) nuevosFiltros.precio_max = Number.parseFloat(precioMax)
    if (ubicacionFiltro) nuevosFiltros.ubicacion = ubicacionFiltro
    
    setCargando(true)
    setError(null)
    try {
      const data = await servicioVehiculo.getAll(nuevosFiltros)
      setVehiculos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aplicar filtros')
      console.error('Error aplicando filtros:', err)
    } finally {
      setCargando(false)
    }
  }

  // Filtrar modelos por marca seleccionada
  const marcaId = marcaSeleccionada
    ? marcas.find(m => m.nombre === marcaSeleccionada)?.id
    : null
  const modelosFiltrados = marcaId
    ? modelos.filter(m => m.marca === marcaId)
    : modelos

  // Manejar búsqueda
  const manejarBusqueda = async () => {
    if (!busqueda.trim()) {
      // Si no hay búsqueda, aplicar filtros actuales
      await aplicarFiltros()
      return
    }
    
    setCargando(true)
    setError(null)
    try {
      const data = await servicioVehiculo.search(busqueda)
      setVehiculos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la búsqueda')
      console.error('Error en búsqueda:', err)
    } finally {
      setCargando(false)
    }
  }

  // Manejar ver detalles
  const handleVerDetalles = (id: number) => {
    router.push(`/catalogo/${id}`)
  }

  // Limpiar filtros y recargar vehículos
  const limpiarFiltros = async () => {
    setMarcaSeleccionada('')
    setModeloSeleccionado('')
    setAñoMin('')
    setAñoMax('')
    setPrecioMin('')
    setPrecioMax('')
    setUbicacionFiltro('')
    setBusqueda('')
    
    // Recargar todos los vehículos
    setCargando(true)
    setError(null)
    try {
      const data = await servicioVehiculo.getAll()
      setVehiculos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar vehículos')
      console.error('Error cargando vehículos:', err)
    } finally {
      setCargando(false)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        
        {/* Barra lateral con filtros */}
        <div className="w-full lg:w-80 bg-white border-r border-gray-200 p-6 hidden lg:block">
          
          {/* Perfil del usuario */}
          {usuario && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xl">
                    {usuario.nombre_completo?.charAt(0) || usuario.nombre?.charAt(0) || '👤'}
                  </span>
                </div>
                <span className="text-lg font-semibold text-gray-800">
                  {usuario.nombre_completo || usuario.nombre || 'Usuario'}
                </span>
              </div>
            </div>
          )}

          {/* Sección de filtros */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
              <button
                onClick={limpiarFiltros}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Limpiar
              </button>
            </div>
            <div className="space-y-3">
              
              {/* Filtro de Marca */}
              <select
                value={marcaSeleccionada}
                onChange={(e) => {
                  setMarcaSeleccionada(e.target.value)
                  setModeloSeleccionado('') // Resetear modelo cuando cambia la marca
                }}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-red-300 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Todas las marcas</option>
                {marcas.map((marca) => (
                  <option key={marca.id} value={marca.nombre}>
                    {marca.nombre}
                  </option>
                ))}
              </select>

              {/* Filtro de Modelo */}
              <select
                value={modeloSeleccionado}
                onChange={(e) => setModeloSeleccionado(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-red-300 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={!marcaSeleccionada}
              >
                <option value="">Todos los modelos</option>
                {modelosFiltrados.map((modelo) => (
                  <option key={modelo.id} value={modelo.nombre}>
                    {modelo.nombre}
                  </option>
                ))}
              </select>

              {/* Filtro de Año Mínimo */}
              <input
                type="number"
                placeholder="Año mínimo"
                value={añoMin}
                onChange={(e) => setAñoMin(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-red-300 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />

              {/* Filtro de Año Máximo */}
              <input
                type="number"
                placeholder="Año máximo"
                value={añoMax}
                onChange={(e) => setAñoMax(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-red-300 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />

              {/* Filtro de Precio Mínimo */}
              <input
                type="number"
                placeholder="Precio mínimo"
                value={precioMin}
                onChange={(e) => setPrecioMin(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-red-300 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />

              {/* Filtro de Precio Máximo */}
              <input
                type="number"
                placeholder="Precio máximo"
                value={precioMax}
                onChange={(e) => setPrecioMax(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-red-300 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />

              {/* Filtro de Ubicación */}
              <input
                type="text"
                placeholder="Ubicación"
                value={ubicacionFiltro}
                onChange={(e) => setUbicacionFiltro(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && aplicarFiltros()}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-red-300 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />

              {/* Botón de Filtrar */}
              <button
                onClick={aplicarFiltros}
                disabled={cargando}
                className="w-full bg-red-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-800 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {cargando ? 'Filtrando...' : 'Filtrar'}
              </button>
            </div>
          </div>
        </div>

        {/* Área principal de contenido */}
        <div className="flex-1 p-6">
          
          {/* Título y barra de búsqueda */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Catálogo de Vehículos</h1>
              <button className="lg:hidden bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium">
                Filtros
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && manejarBusqueda()}
                placeholder="Busca tu auto (marca, modelo, ubicación)" 
                className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-red-300 hover:shadow-md transition-all duration-300"
              />
              <button
                onClick={manejarBusqueda}
                disabled={cargando}
                className="bg-red-700 text-white px-6 py-4 rounded-lg hover:bg-red-800 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargando ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
    </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {/* Grid de vehículos */}
          {cargando ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-600">Cargando vehículos...</div>
            </div>
          ) : vehiculos.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-600">No se encontraron vehículos</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehiculos.map((vehiculo) => (
                <Carta_v
                  key={vehiculo.id}
                  vehicle={vehiculo}
                  onVerDetalles={handleVerDetalles}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Catalogo