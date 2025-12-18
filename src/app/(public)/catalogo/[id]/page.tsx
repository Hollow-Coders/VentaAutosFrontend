'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { servicioVehiculo, VehiculoDetalle } from '@/api/vehicles'
import BotonPuja from '@/components/vehiculo/BotonPuja'
import BotonComprar from '@/components/vehiculo/BotonComprar'
import { useAuth } from '@/hooks/useAuth'

export default function DetalleVehiculo() {
  const params = useParams()
  const router = useRouter()
  const { usuario, estaAutenticado } = useAuth()
  const id = params?.id ? parseInt(params.id as string) : null
  
  const [vehiculo, setVehiculo] = useState<VehiculoDetalle | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imagenActual, setImagenActual] = useState(0)

  const fotos = useMemo(() => {
    if (!vehiculo?.fotos) return []
    return vehiculo.fotos
      .map((foto) => {
        if (!foto) return null
        if (typeof foto === 'string') return foto
        return foto.url_imagen_url ?? foto.url_imagen ?? null
      })
      .filter((url): url is string => Boolean(url))
  }, [vehiculo])

  useEffect(() => {
    if (!id || isNaN(id)) {
      setError('ID de vehículo inválido')
      setCargando(false)
      return
    }

    const cargarVehiculo = async () => {
      setCargando(true)
      setError(null)
      try {
        const data = await servicioVehiculo.getById(id)
        setVehiculo(data)
        setImagenActual(0)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el vehículo')
        console.error('Error cargando vehículo:', err)
      } finally {
        setCargando(false)
      }
    }
    cargarVehiculo()
  }, [id])

  useEffect(() => {
    if (imagenActual >= fotos.length && fotos.length > 0) {
      setImagenActual(0)
    }
  }, [imagenActual, fotos.length])

  const formatearPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(precio)
  }

  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatearKilometraje = (km?: number): string => {
    if (!km) return 'No especificado'
    return new Intl.NumberFormat('es-MX').format(km) + ' km'
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando vehículo...</div>
      </div>
    )
  }

  if (error || !vehiculo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error || 'Vehículo no encontrado'}</p>
          <Link
            href="/catalogo"
            className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  const nombreVehiculo = `${vehiculo.marca_nombre} ${vehiculo.modelo_nombre} ${vehiculo.año}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-red-600">
                  Inicio
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Link href="/catalogo" className="ml-1 text-sm font-medium text-gray-500 md:ml-2 hover:text-gray-700">
                    Catálogo
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{nombreVehiculo}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="h-96 bg-gray-100 flex items-center justify-center relative">
                {fotos.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={fotos[imagenActual]}
                    alt={nombreVehiculo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-40 h-40 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                )}
              </div>

              {fotos.length > 1 && (
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex gap-4 overflow-x-auto">
                    {fotos.map((foto, index) => (
                      <button
                        key={foto}
                        type="button"
                        onClick={() => setImagenActual(index)}
                        className={`h-20 w-32 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                          imagenActual === index ? "border-red-600" : "border-transparent"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={foto} alt={`Vista ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{nombreVehiculo}</h1>
                  <p className="text-gray-600 capitalize">{vehiculo.tipo_vehiculo} • {vehiculo.tipo_transmision}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-3xl font-bold text-red-600">{formatearPrecio(vehiculo.precio)}</p>
                  <p className="text-sm text-gray-600">{vehiculo.ubicacion}</p>
                </div>
              </div>

              {/* Especificaciones principales */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Marca</div>
                  <div className="text-lg font-semibold text-gray-900">{vehiculo.marca_nombre}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Modelo</div>
                  <div className="text-lg font-semibold text-gray-900">{vehiculo.modelo_nombre}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Año</div>
                  <div className="text-lg font-semibold text-gray-900">{vehiculo.año}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Tipo de Vehículo</div>
                  <div className="text-lg font-semibold text-gray-900 capitalize">{vehiculo.tipo_vehiculo}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Kilometraje</div>
                  <div className="text-lg font-semibold text-gray-900">{formatearKilometraje(vehiculo.kilometraje)}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Transmisión</div>
                  <div className="text-lg font-semibold text-gray-900 capitalize">{vehiculo.tipo_transmision}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Combustible</div>
                  <div className="text-lg font-semibold text-gray-900 capitalize">{vehiculo.tipo_combustible}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Ubicación</div>
                  <div className="text-lg font-semibold text-gray-900">{vehiculo.ubicacion}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Publicado</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatearFecha(vehiculo.fecha_publicacion)}
                  </div>
                </div>
                {vehiculo.total_documentos > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                    <div className="text-sm text-gray-600 mb-1">Documentos</div>
                    <div className="text-lg font-semibold text-blue-700">{vehiculo.total_documentos} disponible(s)</div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción</h2>
                <p className="text-gray-700 leading-relaxed">
                  {vehiculo.descripcion || "El vendedor no proporcionó una descripción detallada para este vehículo."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Opciones de Compra</h2>

              <div className="space-y-4">
                {/* Solo mostrar botón de puja si el vehículo no está vendido */}
                {vehiculo.estado && !vehiculo.estado.toLowerCase().includes('vendido') && !vehiculo.estado.toLowerCase().includes('sold') && (
                  <BotonPuja vehicle={vehiculo} />
                )}
                <BotonComprar 
                  vehicle={vehiculo} 
                  onCompraExitosa={async () => {
                    try {
                      const data = await servicioVehiculo.getById(id!)
                      setVehiculo(data)
                    } catch (err) {
                      console.error('Error recargando vehículo:', err)
                    }
                  }}
                />
                
                {/* Botón de chat */}
                {estaAutenticado && usuario && vehiculo && Number(usuario.id) !== vehiculo.usuario && (
                  <button
                    onClick={() => {
                      const compradorId = Number(usuario.id);
                      const vendedorId = vehiculo.usuario;
                      const vehiculoId = vehiculo.id;
                      router.push(`/chat?comprador=${compradorId}&vendedor=${vendedorId}&vehiculo=${vehiculoId}`);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chatear con el vendedor
                  </button>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {vehiculo.ubicacion}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Disponible ahora
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Vendedor</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {vehiculo.usuario_nombre?.charAt(0) ?? vehiculo.usuario.toString().charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {vehiculo.usuario_nombre || "Vendedor registrado"}
                    </p>
                    <p className="text-sm text-gray-600">Id usuario: {vehiculo.usuario}</p>
                  </div>
                </div>
                <Link
                  href={`/perfil/${vehiculo.usuario}`}
                  className="mt-4 inline-block text-sm text-red-700 hover:text-red-800 font-medium"
                >
                  Ver perfil del vendedor →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

