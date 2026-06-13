
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import TarjetaVehiculo from '../../../components/vehiculo/TarjetaVehiculo'
import { servicioVehiculo, Vehiculo } from '@/api/vehicles'
import { servicioMarca, Marca } from '@/api/brands'
import { servicioModelo, Modelo } from '@/api/models'
function Catalogo() {
  const router = useRouter()
  const [vehiculosBase, setVehiculosBase] = useState<Vehiculo[]>([])
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [modelos, setModelos] = useState<Modelo[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')

  const [marcaFiltro, setMarcaFiltro] = useState('')
  const [mostrarSugerenciasMarca, setMostrarSugerenciasMarca] = useState(false)
  const [modeloSeleccionado, setModeloSeleccionado] = useState('')
  const [añoMin, setAñoMin] = useState('')
  const [añoMax, setAñoMax] = useState('')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [ubicacionFiltro, setUbicacionFiltro] = useState('')
  const [mostrarFiltrosMobile, setMostrarFiltrosMobile] = useState(false)

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

  useEffect(() => {
    const cargarVehiculos = async () => {
      setCargando(true)
      setError(null)
      try {
        const data = await servicioVehiculo.getAll()
        setVehiculosBase(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar vehículos')
        console.error('Error cargando vehículos:', err)
      } finally {
        setCargando(false)
      }
    }
    cargarVehiculos()
  }, [])

  const marcaCoincidente = useMemo(() => {
    const texto = marcaFiltro.trim().toLowerCase()
    if (!texto) return null
    return marcas.find((m) => m.nombre.toLowerCase() === texto) ?? null
  }, [marcaFiltro, marcas])

  const marcasSugeridas = useMemo(() => {
    const texto = marcaFiltro.trim().toLowerCase()
    if (!texto) return marcas.slice(0, 8)
    return marcas
      .filter((m) => m.nombre.toLowerCase().includes(texto))
      .slice(0, 8)
  }, [marcaFiltro, marcas])

  const marcaId = marcaCoincidente?.id ?? null

  const modelosFiltrados = useMemo(() => {
    if (!marcaId) return modelos
    return modelos.filter((m) => m.marca === marcaId)
  }, [marcaId, modelos])

  const vehiculos = useMemo(() => {
    const textoBusqueda = busqueda.trim().toLowerCase()
    const textoMarca = marcaFiltro.trim().toLowerCase()
    const textoUbicacion = ubicacionFiltro.trim().toLowerCase()
    const minAño = añoMin ? Number.parseInt(añoMin, 10) : null
    const maxAño = añoMax ? Number.parseInt(añoMax, 10) : null
    const minPrecio = precioMin ? Number.parseFloat(precioMin) : null
    const maxPrecio = precioMax ? Number.parseFloat(precioMax) : null

    return vehiculosBase.filter((vehiculo) => {
      if (textoBusqueda) {
        const textoCompleto = [
          vehiculo.nombre,
          vehiculo.marca_nombre,
          vehiculo.modelo_nombre,
          vehiculo.ubicacion,
          String(vehiculo.año),
        ]
          .join(' ')
          .toLowerCase()
        if (!textoCompleto.includes(textoBusqueda)) return false
      }

      if (textoMarca && !vehiculo.marca_nombre.toLowerCase().includes(textoMarca)) {
        return false
      }

      if (modeloSeleccionado && vehiculo.modelo_nombre !== modeloSeleccionado) {
        return false
      }

      if (minAño !== null && !Number.isNaN(minAño) && vehiculo.año < minAño) return false
      if (maxAño !== null && !Number.isNaN(maxAño) && vehiculo.año > maxAño) return false
      if (minPrecio !== null && !Number.isNaN(minPrecio) && vehiculo.precio < minPrecio) return false
      if (maxPrecio !== null && !Number.isNaN(maxPrecio) && vehiculo.precio > maxPrecio) return false
      if (textoUbicacion && !vehiculo.ubicacion.toLowerCase().includes(textoUbicacion)) return false

      return true
    })
  }, [
    vehiculosBase,
    busqueda,
    marcaFiltro,
    modeloSeleccionado,
    añoMin,
    añoMax,
    precioMin,
    precioMax,
    ubicacionFiltro,
  ])

  const hayFiltrosActivos = Boolean(
    busqueda.trim() ||
    marcaFiltro.trim() ||
    modeloSeleccionado ||
    añoMin ||
    añoMax ||
    precioMin ||
    precioMax ||
    ubicacionFiltro.trim()
  )

  const handleVerDetalles = (id: number) => {
    router.push(`/catalogo/${id}`)
  }

  const limpiarFiltros = () => {
    setMarcaFiltro('')
    setModeloSeleccionado('')
    setAñoMin('')
    setAñoMax('')
    setPrecioMin('')
    setPrecioMax('')
    setUbicacionFiltro('')
    setBusqueda('')
    setMostrarFiltrosMobile(false)
    setMostrarSugerenciasMarca(false)
  }

  const seleccionarMarca = (nombre: string) => {
    setMarcaFiltro(nombre)
    setModeloSeleccionado('')
    setMostrarSugerenciasMarca(false)
  }

  const inputFiltroClass = 'input-field py-3'

  const panelFiltros = (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Filtros</h3>
          {hayFiltrosActivos && (
            <button
              type="button"
              onClick={limpiarFiltros}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 font-medium"
            >
              Limpiar
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="filtro-marca" className="form-label">
              Marca
            </label>
            <div className="relative">
              <input
                id="filtro-marca"
                type="text"
                value={marcaFiltro}
                onChange={(e) => {
                  setMarcaFiltro(e.target.value)
                  setModeloSeleccionado('')
                  setMostrarSugerenciasMarca(true)
                }}
                onFocus={() => setMostrarSugerenciasMarca(true)}
                onBlur={() => setTimeout(() => setMostrarSugerenciasMarca(false), 200)}
                placeholder="Escribe la marca (ej. Toyota)"
                className={inputFiltroClass}
                autoComplete="off"
              />
              {mostrarSugerenciasMarca && marcasSugeridas.length > 0 && (
                <div className="dropdown-panel">
                  {marcasSugeridas.map((marca) => (
                    <button
                      key={marca.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => seleccionarMarca(marca.nombre)}
                      className="dropdown-item"
                    >
                      {marca.nombre}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="filtro-modelo" className="form-label">
              Modelo
            </label>
            <select
              id="filtro-modelo"
              value={modeloSeleccionado}
              onChange={(e) => setModeloSeleccionado(e.target.value)}
              className={inputFiltroClass}
              disabled={!marcaFiltro.trim()}
            >
              <option value="">Todos los modelos</option>
              {modelosFiltrados.map((modelo) => (
                <option key={modelo.id} value={modelo.nombre}>
                  {modelo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Año mín."
              value={añoMin}
              onChange={(e) => setAñoMin(e.target.value)}
              className={inputFiltroClass}
            />
            <input
              type="number"
              placeholder="Año máx."
              value={añoMax}
              onChange={(e) => setAñoMax(e.target.value)}
              className={inputFiltroClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Precio mín."
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
              className={inputFiltroClass}
            />
            <input
              type="number"
              placeholder="Precio máx."
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              className={inputFiltroClass}
            />
          </div>

          <input
            type="text"
            placeholder="Ubicación"
            value={ubicacionFiltro}
            onChange={(e) => setUbicacionFiltro(e.target.value)}
            className={inputFiltroClass}
          />

          <p className="form-hint">
            Los resultados se actualizan mientras escribes.
          </p>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-80 border-r border-slate-200/70 dark:border-slate-800 p-4 sm:p-6 hidden lg:block flex-shrink-0">
          {panelFiltros}
        </div>

        {mostrarFiltrosMobile && (
          <>
            <button
              type="button"
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMostrarFiltrosMobile(false)}
              aria-label="Cerrar filtros"
            />
            <div className="fixed inset-y-0 left-0 z-50 w-full max-w-sm surface-card rounded-none border-r p-4 sm:p-6 overflow-y-auto lg:hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Filtros</h2>
                <button
                  type="button"
                  onClick={() => setMostrarFiltrosMobile(false)}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Cerrar filtros"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {panelFiltros}
            </div>
          </>
        )}

        <div className="flex-1 p-4 sm:p-6 min-w-0">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
              <h1 className="page-title">Catálogo de Vehículos</h1>
              <button
                type="button"
                onClick={() => setMostrarFiltrosMobile(true)}
                className="lg:hidden flex-shrink-0 btn-primary px-3 sm:px-4 py-2 text-sm"
              >
                Filtros
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Busca por marca, modelo o ubicación..."
                className="input-field py-3 pr-10"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Limpiar búsqueda"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {!cargando && (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                {vehiculos.length} vehículo{vehiculos.length !== 1 ? 's' : ''} encontrado{vehiculos.length !== 1 ? 's' : ''}
                {hayFiltrosActivos ? ' con los filtros actuales' : ''}
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 alert-error">{error}</div>
          )}

          {cargando ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-slate-500 dark:text-slate-400">Cargando vehículos...</div>
            </div>
          ) : vehiculos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-slate-600 dark:text-slate-300 mb-4">No se encontraron vehículos</p>
              {hayFiltrosActivos && (
                <button type="button" onClick={limpiarFiltros} className="btn-secondary">
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehiculos.map((vehiculo) => (
                <TarjetaVehiculo
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
