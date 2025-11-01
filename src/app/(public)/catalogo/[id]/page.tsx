'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { servicioVehiculo, VehiculoDetalle } from '@/api/vehicles'
import BidButton from '@/components/vehicle/BidButton'
import BuyButton from '@/components/vehicle/BuyButton'

export default function DetalleVehiculo() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id ? parseInt(params.id as string) : null
  
  const [vehiculo, setVehiculo] = useState<VehiculoDetalle | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imagenActual, setImagenActual] = useState(0)

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el vehículo')
        console.error('Error cargando vehículo:', err)
      } finally {
        setCargando(false)
      }
    }
    cargarVehiculo()
  }, [id])

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Botón de volver */}
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <Link
          href="/catalogo"
          className="text-red-700 hover:text-red-800 font-medium flex items-center gap-2"
        >
          <span>←</span> Volver al catálogo
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Galería de imágenes */}
          <div>
            {vehiculo.fotos && vehiculo.fotos.length > 0 ? (
              <>
                <div className="mb-4">
                  <img
                    src={vehiculo.fotos[imagenActual]}
                    alt={`${vehiculo.marca_nombre} ${vehiculo.modelo_nombre}`}
                    className="w-full h-96 object-cover rounded-lg shadow-lg"
                  />
                </div>
                {vehiculo.fotos.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {vehiculo.fotos.map((foto, index) => (
                      <button
                        key={index}
                        onClick={() => setImagenActual(index)}
                        className={`w-full h-24 rounded-lg overflow-hidden border-2 ${
                          imagenActual === index
                            ? 'border-red-700'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                      >
                        <img
                          src={foto}
                          alt={`Vista ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-6xl text-gray-400">🚗</div>
              </div>
            )}
          </div>

          {/* Información del vehículo */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {vehiculo.marca_nombre} {vehiculo.modelo_nombre} {vehiculo.año}
              </h1>
              
              <div className="mb-6">
                <p className="text-3xl font-bold text-red-600 mb-2">
                  {formatearPrecio(vehiculo.precio)}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>📍 {vehiculo.ubicacion}</span>
                  <span>📅 Publicado: {formatearFecha(vehiculo.fecha_publicacion)}</span>
                </div>
              </div>

              {/* Información técnica */}
              <div className="border-t border-b border-gray-200 py-6 my-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Especificaciones</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Marca</p>
                    <p className="font-semibold text-gray-800">{vehiculo.marca_nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Modelo</p>
                    <p className="font-semibold text-gray-800">{vehiculo.modelo_nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Año</p>
                    <p className="font-semibold text-gray-800">{vehiculo.año}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kilometraje</p>
                    <p className="font-semibold text-gray-800">
                      {formatearKilometraje(vehiculo.kilometraje)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Transmisión</p>
                    <p className="font-semibold text-gray-800">
                      {vehiculo.tipo_transmision || 'No especificado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Combustible</p>
                    <p className="font-semibold text-gray-800">
                      {vehiculo.tipo_combustible || 'No especificado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estado</p>
                    <p className="font-semibold text-gray-800 capitalize">{vehiculo.estado}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vendedor</p>
                    <p className="font-semibold text-gray-800">{vehiculo.usuario_nombre}</p>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {vehiculo.descripcion && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Descripción</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{vehiculo.descripcion}</p>
                </div>
              )}

              {/* Documentos */}
              {vehiculo.total_documentos > 0 && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    📄 Este vehículo cuenta con {vehiculo.total_documentos} documento(s) disponible(s)
                  </p>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4">
                <BuyButton vehicle={vehiculo} />
                <BidButton vehicle={vehiculo} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

