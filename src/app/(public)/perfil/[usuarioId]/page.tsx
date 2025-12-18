"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Perfil, servicioPerfil } from "../../../../api";
import { VehiculoDetalle, servicioVehiculo } from "../../../../api/vehicles";
import { servicioValoracion, Valoracion, PromedioVendedor } from "../../../../api/ratings";
import EncabezadoPerfil from "../../../../components/perfil/EncabezadoPerfil";
import VehiculosPerfil from "../../../../components/perfil/VehiculosPerfil";
import ResenasPerfil from "../../../../components/perfil/ResenasPerfil";

export default function PerfilPublicoPage() {
  const router = useRouter();
  const params = useParams<{ usuarioId: string }>();
  const usuarioId = Number(params?.usuarioId ?? Number.NaN);

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [vehiculos, setVehiculos] = useState<VehiculoDetalle[]>([]);
  const [valoraciones, setValoraciones] = useState<Valoracion[]>([]);
  const [todasLasValoraciones, setTodasLasValoraciones] = useState<Valoracion[]>([]);
  const [mostrarTodasValoraciones, setMostrarTodasValoraciones] = useState(false);
  const [promedio, setPromedio] = useState<PromedioVendedor | null>(null);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);
  const [cargandoVehiculos, setCargandoVehiculos] = useState(true);
  const [cargandoValoraciones, setCargandoValoraciones] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar todas las valoraciones cuando se hace clic en "Ver más"
  const cargarTodasValoraciones = async () => {
    if (todasLasValoraciones.length > 0) {
      // Si ya tenemos todas las valoraciones cargadas, solo mostrarlas
      setMostrarTodasValoraciones(true);
      setValoraciones(todasLasValoraciones);
    } else {
      // Si no las tenemos, cargarlas ahora
      setCargandoValoraciones(true);
      try {
        const valoracionesData = await servicioValoracion.getByVendedor(usuarioId);
        const valoracionesOrdenadas = valoracionesData.valoraciones
          .sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime());
        
        setTodasLasValoraciones(valoracionesOrdenadas);
        setValoraciones(valoracionesOrdenadas);
        setMostrarTodasValoraciones(true);
      } catch (err) {
        console.error("Error al cargar todas las valoraciones:", err);
      } finally {
        setCargandoValoraciones(false);
      }
    }
  };

  useEffect(() => {
    if (Number.isNaN(usuarioId)) {
      setError("Identificador de usuario no válido.");
      setCargandoPerfil(false);
      setCargandoVehiculos(false);
      return;
    }

    const cargarPerfil = async () => {
      setCargandoPerfil(true);
      try {
        const perfilData = await servicioPerfil.getByUsuarioId(usuarioId);
        setPerfil(perfilData);
        setError(null);
      } catch (err) {
        console.error("Error al cargar perfil público:", err);
        setError("No encontramos el perfil que buscas.");
        setPerfil(null);
      } finally {
        setCargandoPerfil(false);
      }
    };

    cargarPerfil();
  }, [usuarioId]);

  useEffect(() => {
    if (Number.isNaN(usuarioId)) {
      setVehiculos([]);
      setCargandoVehiculos(false);
      return;
    }

    const cargarVehiculos = async () => {
      setCargandoVehiculos(true);
      try {
        const vehiculosData = await servicioVehiculo.getByUsuario(usuarioId);
        setVehiculos(vehiculosData);
      } catch (err) {
        console.error("Error al cargar vehículos públicos:", err);
        setVehiculos([]);
      } finally {
        setCargandoVehiculos(false);
      }
    };

    cargarVehiculos();
  }, [usuarioId]);

  // Cargar valoraciones del vendedor
  useEffect(() => {
    if (Number.isNaN(usuarioId)) {
      setValoraciones([]);
      setTodasLasValoraciones([]);
      setMostrarTodasValoraciones(false);
      setCargandoValoraciones(false);
      return;
    }

    // Resetear estado al cambiar de usuario
    setMostrarTodasValoraciones(false);

    const cargarValoraciones = async () => {
      setCargandoValoraciones(true);
      try {
        // Cargar solo el promedio primero (más ligero, incluye el total)
        // Esto nos da el total de valoraciones sin necesidad de cargar todas
        const promedioData = await servicioValoracion.getPromedioVendedor(usuarioId);
        setPromedio(promedioData);
        
        // Solo cargar las valoraciones del vendedor si hay valoraciones
        // Si hay más de 10, solo procesaremos las primeras 10 inicialmente
        if (promedioData.total_valoraciones > 0) {
          const valoracionesData = await servicioValoracion.getByVendedor(usuarioId);
          
          // Ordenar por fecha descendente (más recientes primero)
          const valoracionesOrdenadas = valoracionesData.valoraciones
            .sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime());
          
          // Guardar todas las valoraciones para uso futuro
          setTodasLasValoraciones(valoracionesOrdenadas);
          
          // Mostrar solo las primeras 10 al inicio
          setValoraciones(valoracionesOrdenadas.slice(0, 10));
        } else {
          // Si no hay valoraciones, establecer arrays vacíos
          setValoraciones([]);
          setTodasLasValoraciones([]);
        }
      } catch (err) {
        console.error("Error al cargar valoraciones:", err);
        // Si hay error, simplemente no mostrar valoraciones
        setValoraciones([]);
        setTodasLasValoraciones([]);
        setPromedio(null);
      } finally {
        setCargandoValoraciones(false);
      }
    };

    cargarValoraciones();
  }, [usuarioId]);

  const usuarioPublico = useMemo(() => {
    if (!perfil) {
      return {
        id: usuarioId,
        nombre: "",
        apellido: "",
        nombre_completo: "",
        correo: "",
      };
    }

    const nombreCompleto =
      perfil.usuario_nombre || perfil.usuario_apellido
        ? `${perfil.usuario_nombre ?? ""} ${perfil.usuario_apellido ?? ""}`.trim()
        : perfil.usuario_correo?.split("@")[0];

    return {
      id: perfil.usuario ?? usuarioId,
      nombre: perfil.usuario_nombre ?? nombreCompleto ?? "",
      apellido: perfil.usuario_apellido ?? "",
      nombre_completo: nombreCompleto ?? "",
      correo: perfil.usuario_correo ?? "",
    };
  }, [perfil, usuarioId]);

  const nombreMostrar =
    usuarioPublico.nombre_completo ||
    usuarioPublico.nombre ||
    usuarioPublico.correo?.split("@")[0] ||
    "Vendedor";

  if (!cargandoPerfil && error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-red-100 text-red-700">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Perfil no disponible</h1>
            <p className="text-gray-600">{error}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Volver
            </button>
            <Link
              href="/catalogo"
              className="px-6 py-3 rounded-lg bg-red-700 text-white font-medium hover:bg-red-800 transition-colors"
            >
              Ir al catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <EncabezadoPerfil usuario={usuarioPublico} perfil={perfil} esPropietario={false} />

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Información del Vendedor</h2>

              {cargandoPerfil ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre
                      </label>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">{nombreMostrar}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo de contacto
                      </label>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">
                          {usuarioPublico.correo || "No disponible públicamente"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900">{perfil?.telefono || "No especificado"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad
                      </label>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">{perfil?.ciudad || "No especificada"}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección
                      </label>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">{perfil?.direccion || "No especificada"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sobre el vendedor
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[100px]">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {perfil?.descripcion || "Este vendedor aún no ha agregado una descripción."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {cargandoVehiculos ? (
              <div className="mb-8 flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <VehiculosPerfil vehicles={vehiculos} isOwner={false} />
            )}

            <ResenasPerfil 
              valoraciones={valoraciones} 
              promedio={promedio}
              cargando={cargandoValoraciones}
              totalValoraciones={todasLasValoraciones.length}
              mostrarTodas={mostrarTodasValoraciones}
              onVerMas={cargarTodasValoraciones}
            />

            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/catalogo"
                className="px-6 py-3 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 transition-colors"
              >
                Ver catálogo
              </Link>
              <Link
                href="/contacto"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Contactar soporte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


