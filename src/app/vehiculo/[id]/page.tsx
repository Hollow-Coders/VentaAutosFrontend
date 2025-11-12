"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { servicioVehiculo, VehiculoDetalle } from "@/api/vehicles";
import BidButton from "@/components/vehicle/BidButton";
import BuyButton from "@/components/vehicle/BuyButton";

export default function VehicleDetailPage() {
  const params = useParams();
  const idParam = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const vehiculoId = Number(idParam);
  const [vehiculo, setVehiculo] = useState<VehiculoDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagenActiva, setImagenActiva] = useState(0);

  useEffect(() => {
    if (!vehiculoId || Number.isNaN(vehiculoId)) {
      setError("Identificador de vehículo inválido.");
      setCargando(false);
      return;
    }

    const cargarVehiculo = async () => {
      setCargando(true);
      setError(null);
      try {
        const data = await servicioVehiculo.getById(vehiculoId);
        setVehiculo(data);
        setImagenActiva(0);
      } catch (err) {
        console.error("Error al cargar vehículo:", err);
        setError(err instanceof Error ? err.message : "No se pudo cargar la información del vehículo.");
      } finally {
        setCargando(false);
      }
    };

    cargarVehiculo();
  }, [vehiculoId]);

  const fotos = useMemo(() => {
    if (!vehiculo?.fotos) return [];
    return vehiculo.fotos
      .map((foto) => {
        if (!foto) return null;
        if (typeof foto === "string") return foto;
        return foto.url_imagen_url ?? foto.url_imagen ?? null;
      })
      .filter((url): url is string => Boolean(url));
  }, [vehiculo]);

  const precioFormateado = useMemo(() => {
    if (!vehiculo) return "";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(vehiculo.precio);
  }, [vehiculo]);

  const kilometrajeFormateado = useMemo(() => {
    if (!vehiculo?.kilometraje) return "No especificado";
    return new Intl.NumberFormat("es-MX").format(vehiculo.kilometraje) + " km";
  }, [vehiculo]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando información del vehículo...</div>
      </div>
    );
  }

  if (error || !vehiculo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Vehículo no disponible</h1>
          <p className="text-gray-600">{error ?? "El vehículo que buscas no existe o ha sido eliminado."}</p>
          <Link
            href="/catalogo"
            className="inline-block bg-red-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-800 transition-colors"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
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
                    src={fotos[imagenActiva]}
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
                        onClick={() => setImagenActiva(index)}
                        className={`h-20 w-32 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                          imagenActiva === index ? "border-red-600" : "border-transparent"
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
                  <p className="text-3xl font-bold text-red-600">{precioFormateado}</p>
                  <p className="text-sm text-gray-600">{vehiculo.ubicacion}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Kilometraje</div>
                  <div className="text-lg font-semibold text-gray-900">{kilometrajeFormateado}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Combustible</div>
                  <div className="text-lg font-semibold text-gray-900 capitalize">{vehiculo.tipo_combustible}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Estado</div>
                  <div className="text-lg font-semibold text-gray-900 capitalize">{vehiculo.estado.replace("_", " ")}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Publicado</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {new Date(vehiculo.fecha_publicacion).toLocaleDateString("es-MX")}
                  </div>
                </div>
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
                <BidButton vehicle={vehiculo} />
                <BuyButton vehicle={vehiculo} />
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
