"use client";

import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface VehiculoEnRevision {
  id: number;
  usuario: number;
  usuario_nombre: string;
  marca: number;
  marca_nombre: string;
  modelo: number;
  modelo_nombre: string;
  año: number;
  precio: number;
  tipo_transmision: string;
  tipo_combustible: string;
  tipo_vehiculo: string;
  kilometraje?: number;
  descripcion?: string;
  estado: "en_revision";
  ubicacion: string;
  fecha_solicitud: string;
  fotos?: string[];
}

export default function AdministracionPage() {
  const { usuario, estaAutenticado, estaCargando } = useAuth();
  const router = useRouter();
  const [vehiculosEnRevision, establecerVehiculosEnRevision] = useState<VehiculoEnRevision[]>([]);
  const [cargando, establecerCargando] = useState(true);

  // Datos de ejemplo (mock) - Simulando vehículos en revisión
  useEffect(() => {
    // Simular carga de datos
    const cargarVehiculosEnRevision = () => {
      establecerCargando(true);
      
      // Datos de ejemplo - Estructura basada en el formulario de creación
      const vehiculosMock: VehiculoEnRevision[] = [
        {
          id: 1,
          usuario: 5,
          usuario_nombre: "Juan Pérez",
          marca: 1,
          marca_nombre: "Toyota",
          modelo: 3,
          modelo_nombre: "Corolla",
          año: 2020,
          precio: 250000,
          tipo_transmision: "Automatica",
          tipo_combustible: "Gasolina",
          tipo_vehiculo: "Sedán",
          kilometraje: 45000,
          descripcion: "Vehículo en excelente estado, único dueño, sin accidentes. Mantenimiento completo en agencia, todas las revisiones al día. Interior impecable, sin olores ni manchas. Ideal para familia.",
          estado: "en_revision",
          ubicacion: "Ciudad de México",
          fecha_solicitud: "2024-11-15T10:30:00Z",
          fotos: []
        },
        {
          id: 2,
          usuario: 8,
          usuario_nombre: "María González",
          marca: 2,
          marca_nombre: "Honda",
          modelo: 5,
          modelo_nombre: "Civic",
          año: 2019,
          precio: 280000,
          tipo_transmision: "Manual",
          tipo_combustible: "Gasolina",
          tipo_vehiculo: "Sedán",
          kilometraje: 52000,
          descripcion: "Automóvil bien mantenido, servicio completo al día. Equipamiento completo, sistema de audio premium, asientos de cuero. Perfecto estado mecánico.",
          estado: "en_revision",
          ubicacion: "Guadalajara",
          fecha_solicitud: "2024-11-16T14:20:00Z",
          fotos: []
        },
        {
          id: 3,
          usuario: 12,
          usuario_nombre: "Carlos Rodríguez",
          marca: 3,
          marca_nombre: "Nissan",
          modelo: 7,
          modelo_nombre: "Sentra",
          año: 2021,
          precio: 320000,
          tipo_transmision: "CVT",
          tipo_combustible: "Hibrido",
          tipo_vehiculo: "Sedán",
          kilometraje: 30000,
          descripcion: "Vehículo seminuevo, garantía de agencia disponible. Tecnología avanzada, cámara de reversa, sensores de estacionamiento. Excelente opción.",
          estado: "en_revision",
          ubicacion: "Monterrey",
          fecha_solicitud: "2024-11-17T09:15:00Z",
          fotos: []
        },
        {
          id: 4,
          usuario: 15,
          usuario_nombre: "Ana Martínez",
          marca: 4,
          marca_nombre: "Ford",
          modelo: 12,
          modelo_nombre: "Ranger",
          año: 2022,
          precio: 450000,
          tipo_transmision: "Automatica",
          tipo_combustible: "Diesel",
          tipo_vehiculo: "Pickup",
          kilometraje: 25000,
          descripcion: "Camioneta en perfecto estado, 4x4, doble cabina. Ideal para trabajo y aventura. Equipada con llantas nuevas, sistema de sonido premium.",
          estado: "en_revision",
          ubicacion: "Puebla",
          fecha_solicitud: "2024-11-18T11:45:00Z",
          fotos: []
        },
        {
          id: 5,
          usuario: 20,
          usuario_nombre: "Roberto Sánchez",
          marca: 5,
          marca_nombre: "Volkswagen",
          modelo: 15,
          modelo_nombre: "Jetta",
          año: 2020,
          precio: 290000,
          tipo_transmision: "Automatica",
          tipo_combustible: "Gasolina",
          tipo_vehiculo: "Sedán",
          kilometraje: 48000,
          descripcion: "Sedán alemán en excelente condición. Motor turbo, transmisión automática de 8 velocidades. Interior espacioso y cómodo.",
          estado: "en_revision",
          ubicacion: "Querétaro",
          fecha_solicitud: "2024-11-19T16:30:00Z",
          fotos: []
        },
        {
          id: 6,
          usuario: 22,
          usuario_nombre: "Laura Fernández",
          marca: 6,
          marca_nombre: "Chevrolet",
          modelo: 18,
          modelo_nombre: "Equinox",
          año: 2021,
          precio: 380000,
          tipo_transmision: "Automatica",
          tipo_combustible: "Gasolina",
          tipo_vehiculo: "SUV",
          kilometraje: 35000,
          descripcion: "SUV familiar, 7 pasajeros, excelente para viajes largos. Sistema de seguridad avanzado, cámara 360°, asientos de cuero.",
          estado: "en_revision",
          ubicacion: "Toluca",
          fecha_solicitud: "2024-11-20T08:00:00Z",
          fotos: []
        }
      ];

      setTimeout(() => {
        establecerVehiculosEnRevision(vehiculosMock);
        establecerCargando(false);
      }, 500);
    };

    cargarVehiculosEnRevision();
  }, []);

  useEffect(() => {
    if (!estaCargando && !estaAutenticado) {
      router.push("/login");
    }
  }, [estaAutenticado, estaCargando, router]);

  const manejarAceptar = (id: number) => {
    // TODO: Implementar lógica de aceptación
    console.log(`Aceptar vehículo ${id}`);
    alert(`Vehículo ${id} aceptado (funcionalidad pendiente)`);
  };

  const manejarRechazar = (id: number) => {
    // TODO: Implementar lógica de rechazo
    console.log(`Rechazar vehículo ${id}`);
    alert(`Vehículo ${id} rechazado (funcionalidad pendiente)`);
  };

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(precio);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (estaCargando || cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Administración</h1>
          <p className="text-gray-600">
            Revisa y gestiona los vehículos pendientes de aprobación para el catálogo
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En Revisión</p>
                <p className="text-2xl font-bold text-gray-900">{vehiculosEnRevision.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de vehículos en revisión */}
        {vehiculosEnRevision.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No hay vehículos en revisión
            </h2>
            <p className="text-gray-600">
              Todos los vehículos han sido procesados
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {vehiculosEnRevision.map((vehiculo) => (
              <div
                key={vehiculo.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Imágenes del vehículo */}
                    <div className="lg:w-64 flex-shrink-0">
                      {vehiculo.fotos && vehiculo.fotos.length > 0 ? (
                        <div className="space-y-2">
                          <div className="h-48 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center overflow-hidden">
                            <img
                              src={vehiculo.fotos[0]}
                              alt={`${vehiculo.marca_nombre} ${vehiculo.modelo_nombre}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {vehiculo.fotos.length > 1 && (
                            <div className="flex gap-2">
                              {vehiculo.fotos.slice(1, 3).map((foto, index) => (
                                <div key={index} className="h-20 flex-1 bg-gray-100 rounded-lg overflow-hidden">
                                  <img
                                    src={foto}
                                    alt={`${vehiculo.marca_nombre} ${vehiculo.modelo_nombre} ${index + 2}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                          <svg className="w-20 h-20 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Información del vehículo */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {vehiculo.marca_nombre} {vehiculo.modelo_nombre} {vehiculo.año}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {vehiculo.ubicacion}
                            </span>
                            {vehiculo.kilometraje && (
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                {vehiculo.kilometraje.toLocaleString("es-MX")} km
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                          En Revisión
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-2xl font-bold text-red-600 mb-4">
                          {formatearPrecio(vehiculo.precio)}
                        </p>
                        
                        {/* Información técnica del vehículo */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Transmisión</p>
                            <p className="text-sm font-semibold text-gray-900">{vehiculo.tipo_transmision}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Combustible</p>
                            <p className="text-sm font-semibold text-gray-900">{vehiculo.tipo_combustible}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Tipo de Vehículo</p>
                            <p className="text-sm font-semibold text-gray-900">{vehiculo.tipo_vehiculo}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Kilometraje</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {vehiculo.kilometraje ? `${vehiculo.kilometraje.toLocaleString("es-MX")} km` : "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Descripción */}
                        {vehiculo.descripcion && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-gray-700 mb-1">Descripción</p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {vehiculo.descripcion}
                            </p>
                          </div>
                        )}

                        {/* Información del vendedor y fecha */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Vendedor</p>
                            <p className="text-sm font-medium text-gray-900">{vehiculo.usuario_nombre}</p>
                            <p className="text-xs text-gray-400">ID: {vehiculo.usuario}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Fecha de solicitud</p>
                            <p className="text-sm font-medium text-gray-900">{formatearFecha(vehiculo.fecha_solicitud)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => manejarAceptar(vehiculo.id)}
                          className="flex-1 min-w-[140px] bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Aceptar y Publicar
                        </button>
                        <button
                          onClick={() => manejarRechazar(vehiculo.id)}
                          className="flex-1 min-w-[140px] bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

