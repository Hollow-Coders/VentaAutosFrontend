"use client";

import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { servicioPerfil, Perfil } from "../../../api";
import { servicioVehiculo, VehiculoDetalle } from "../../../api/vehicles";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import ProfileVehicles from "../../../components/profile/ProfileVehicles";
import ProfileReviews from "../../../components/profile/ProfileReviews";

export default function PerfilPage() {
  const { usuario, estaAutenticado, estaCargando } = useAuth();
  const router = useRouter();
  const [perfil, establecerPerfil] = useState<Perfil | null>(null);
  const [cargandoPerfil, establecerCargandoPerfil] = useState(true);
  const [vehiculos, establecerVehiculos] = useState<VehiculoDetalle[]>([]);
  const [cargandoVehiculos, establecerCargandoVehiculos] = useState(true);

  useEffect(() => {
    if (!estaCargando && !estaAutenticado) {
      router.push("/login");
    }
  }, [estaAutenticado, estaCargando, router]);

  // Cargar perfil cuando el usuario esté disponible
  useEffect(() => {
    const cargarPerfil = async () => {
      if (!usuario?.id) return;
      
      establecerCargandoPerfil(true);
      try {
        const perfilData = await servicioPerfil.getByUsuarioId(Number(usuario.id));
        establecerPerfil(perfilData);
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        establecerPerfil(null);
      } finally {
        establecerCargandoPerfil(false);
      }
    };

    if (estaAutenticado && usuario?.id) {
      cargarPerfil();
    }
  }, [usuario?.id, estaAutenticado]);

  // Cargar vehículos del usuario
  useEffect(() => {
    const cargarVehiculos = async () => {
      if (!usuario?.id) return;
      
      establecerCargandoVehiculos(true);
      try {
        const vehiculosData = await servicioVehiculo.getByUsuario(Number(usuario.id));
        establecerVehiculos(vehiculosData);
      } catch (error) {
        console.error("Error al cargar vehículos:", error);
        establecerVehiculos([]);
      } finally {
        establecerCargandoVehiculos(false);
      }
    };

    if (estaAutenticado && usuario?.id) {
      cargarVehiculos();
    }
  }, [usuario?.id, estaAutenticado]);

  // Callback para actualizar el perfil después de guardar
  const manejarActualizarPerfil = (perfilActualizado: Perfil) => {
    establecerPerfil(perfilActualizado);
  };

  if (estaCargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!estaAutenticado || !usuario) {
    return null;
  }

  // Obtener nombre para mostrar (con validación)
  const nombreMostrar = usuario?.nombre_completo || usuario?.nombre || usuario?.correo?.split('@')[0] || 'Usuario';

  // Datos de reviews (por ahora vacío, se puede implementar cuando haya API)
  const reviews: any[] = [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header del perfil */}
          <ProfileHeader 
            usuario={usuario} 
            perfil={perfil} 
            onPerfilUpdate={manejarActualizarPerfil}
          />

          {/* Contenido del perfil */}
          <div className="p-8">
            {/* Información Personal */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-red-700/70 font-semibold mb-2">
                    Información Personal
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Resumen del perfil</h2>
                  <p className="mt-2 text-sm text-gray-600 max-w-2xl">
                    Aquí encontrarás los datos principales asociados a tu cuenta. Mantén esta información actualizada para generar confianza con los compradores.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-4 py-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  Datos sincronizados automáticamente
                </div>
              </div>

              {cargandoPerfil ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                  <div className="xl:col-span-2 space-y-4">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Nombre completo</p>
                      <p className="mt-2 text-lg font-semibold text-gray-900">{nombreMostrar}</p>
                      {usuario.apellido && (
                        <p className="text-sm text-gray-500 mt-1">Apellido registrado: {usuario.apellido}</p>
                      )}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Correo electrónico</p>
                      <p className="mt-2 text-lg font-semibold text-gray-900 break-words">{usuario?.correo || 'Sin correo'}</p>
                      <p className="text-xs text-gray-500 mt-2">Utiliza este correo para recibir notificaciones y gestionar tus ventas.</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Teléfono de contacto</p>
                      <p className="mt-2 text-lg font-semibold text-gray-900">{perfil?.telefono || 'No especificado'}</p>
                      <p className="text-xs text-gray-500 mt-2">Este número no se comparte públicamente a menos que tú lo indiques.</p>
                    </div>
                  </div>

                  <div className="xl:col-span-1 space-y-4">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Ubicación</p>
                      <p className="mt-2 text-lg font-semibold text-gray-900">{perfil?.ciudad || 'No especificada'}</p>
                      <p className="text-sm text-gray-500">{perfil?.direccion || 'Dirección no especificada'}</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">ID de usuario</p>
                      <p className="mt-2 text-lg font-semibold text-gray-900">#{usuario?.id || 'N/A'}</p>
                      <p className="text-xs text-gray-500 mt-2">Utiliza este identificador para recibir soporte más rápido.</p>
                    </div>

                    {perfil?.foto_perfil_url && (
                      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3">Foto de perfil</p>
                        <img
                          src={perfil.foto_perfil_url}
                          alt="Foto de perfil"
                          className="w-24 h-24 object-cover rounded-xl border border-gray-100 shadow-sm"
                        />
                      </div>
                    )}
                  </div>

                  <div className="xl:col-span-1 bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4 flex flex-col h-full">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Descripción</p>
                    <p className="mt-3 text-sm text-gray-700 leading-relaxed flex-1 whitespace-pre-wrap">
                      {perfil?.descripcion || 'Aún no has agregado una descripción. Cuenta a tus visitantes sobre tu experiencia como vendedor.'}
                    </p>
                    <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-red-600"></span>
                      Actualiza tu descripción desde el botón “Editar perfil”.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Vehículos del usuario */}
            {cargandoVehiculos ? (
              <div className="mb-8 flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <ProfileVehicles 
                vehicles={vehiculos} 
                isOwner={true} 
              />
            )}

            {/* Reviews del usuario */}
            <ProfileReviews reviews={reviews} />

            {/* Acciones */}
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Volver al Inicio
              </Link>
              <Link
                href="/catalogo"
                className="px-6 py-3 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 transition-colors"
              >
                Ver Catálogo
              </Link>
              <Link
                href="/creacion_vehiculo"
                className="px-6 py-3 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 transition-colors"
              >
                Vender Vehiculo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
