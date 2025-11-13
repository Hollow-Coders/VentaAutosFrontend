"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Perfil, servicioPerfil } from "../../../../api";
import { VehiculoDetalle, servicioVehiculo } from "../../../../api/vehicles";
import EncabezadoPerfil from "../../../../components/profile/ProfileHeader";
import ProfileVehicles from "../../../../components/profile/ProfileVehicles";
import ProfileReviews from "../../../../components/profile/ProfileReviews";

export default function PerfilPublicoPage() {
  const router = useRouter();
  const params = useParams<{ usuarioId: string }>();
  const usuarioId = Number(params?.usuarioId ?? Number.NaN);

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [vehiculos, setVehiculos] = useState<VehiculoDetalle[]>([]);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);
  const [cargandoVehiculos, setCargandoVehiculos] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const reviews: any[] = [];

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
              <ProfileVehicles vehicles={vehiculos} isOwner={false} />
            )}

            <ProfileReviews reviews={reviews} />

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


