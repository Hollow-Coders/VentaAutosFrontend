"use client";

import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { servicioPerfil, Perfil } from "../../../api";

export default function PerfilPage() {
  const { usuario, estaAutenticado, estaCargando } = useAuth();
  const router = useRouter();
  const [perfil, establecerPerfil] = useState<Perfil | null>(null);
  const [cargandoPerfil, establecerCargandoPerfil] = useState(true);
  const [mostrarModal, establecerMostrarModal] = useState(false);
  const [guardando, establecerGuardando] = useState(false);
  const [error, establecerError] = useState("");
  const [fotoSeleccionada, establecerFotoSeleccionada] = useState<File | null>(null);
  const [vistaPreviaFoto, establecerVistaPreviaFoto] = useState<string | null>(null);
  
  // Datos del formulario de edición
  const [datosFormulario, establecerDatosFormulario] = useState({
    descripcion: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    foto_perfil: "",
  });

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
        // Llenar formulario con datos existentes
        establecerDatosFormulario({
          descripcion: perfilData.descripcion || "",
          telefono: perfilData.telefono || "",
          direccion: perfilData.direccion || "",
          ciudad: perfilData.ciudad || "",
          foto_perfil: perfilData.foto_perfil || "",
        });
        // Establecer vista previa si hay foto
        if (perfilData.foto_perfil_url) {
          establecerVistaPreviaFoto(perfilData.foto_perfil_url);
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        // Si no existe perfil, crear uno vacío para mostrar
        establecerPerfil(null);
      } finally {
        establecerCargandoPerfil(false);
      }
    };

    if (estaAutenticado && usuario?.id) {
      cargarPerfil();
    }
  }, [usuario?.id, estaAutenticado]);

  const abrirModal = () => {
    establecerMostrarModal(true);
    establecerError("");
  };

  const cerrarModal = () => {
    establecerMostrarModal(false);
    establecerError("");
    // Restaurar datos originales
    if (perfil) {
      establecerDatosFormulario({
        descripcion: perfil.descripcion || "",
        telefono: perfil.telefono || "",
        direccion: perfil.direccion || "",
        ciudad: perfil.ciudad || "",
        foto_perfil: perfil.foto_perfil || "",
      });
      // Restaurar vista previa
      if (perfil.foto_perfil_url) {
        establecerVistaPreviaFoto(perfil.foto_perfil_url);
      } else {
        establecerVistaPreviaFoto(null);
      }
      establecerFotoSeleccionada(null);
    }
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    establecerDatosFormulario({
      ...datosFormulario,
      [e.target.name]: e.target.value,
    });
  };

  const manejarGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    establecerGuardando(true);
    establecerError("");

    try {
      if (!perfil) {
        // Crear nuevo perfil si no existe
        if (!usuario?.id) {
          throw new Error("Usuario no disponible");
        }
        
        let nuevoPerfil: Perfil;
        // Si hay foto seleccionada, subirla
        if (fotoSeleccionada) {
          // Primero crear el perfil sin foto
          nuevoPerfil = await servicioPerfil.create({
            usuario: Number(usuario.id),
            descripcion: datosFormulario.descripcion,
            telefono: datosFormulario.telefono,
            direccion: datosFormulario.direccion,
            ciudad: datosFormulario.ciudad,
          });
          // Luego subir la foto
          nuevoPerfil = await servicioPerfil.uploadFotoPerfil(nuevoPerfil.id, fotoSeleccionada);
        } else {
          nuevoPerfil = await servicioPerfil.create({
            usuario: Number(usuario.id),
            ...datosFormulario,
          });
        }
        establecerPerfil(nuevoPerfil);
        if (nuevoPerfil.foto_perfil_url) {
          establecerVistaPreviaFoto(nuevoPerfil.foto_perfil_url);
        }
      } else {
        // Actualizar perfil existente
        let perfilActualizado: Perfil;
        
        // Si hay foto seleccionada, subirla primero
        if (fotoSeleccionada) {
          perfilActualizado = await servicioPerfil.uploadFotoPerfil(perfil.id, fotoSeleccionada);
          // Luego actualizar otros campos
          const { foto_perfil, ...restoDatos } = datosFormulario;
          perfilActualizado = await servicioPerfil.partialUpdate(perfil.id, restoDatos);
        } else {
          const { foto_perfil, ...restoDatos } = datosFormulario;
          perfilActualizado = await servicioPerfil.partialUpdate(perfil.id, restoDatos);
        }
        establecerPerfil(perfilActualizado);
        if (perfilActualizado.foto_perfil_url) {
          establecerVistaPreviaFoto(perfilActualizado.foto_perfil_url);
        }
      }
      establecerFotoSeleccionada(null);
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      establecerError(error instanceof Error ? error.message : "Error al guardar el perfil");
    } finally {
      establecerGuardando(false);
    }
  };

  const manejarSeleccionarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) {
      // Validar tipo de archivo
      if (!archivo.type.startsWith('image/')) {
        establecerError('Por favor selecciona un archivo de imagen válido');
        return;
      }
      // Validar tamaño (max 5MB)
      if (archivo.size > 5 * 1024 * 1024) {
        establecerError('La imagen no debe superar los 5MB');
        return;
      }
      
      establecerFotoSeleccionada(archivo);
      establecerError("");
      
      // Crear vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        establecerVistaPreviaFoto(reader.result as string);
      };
      reader.readAsDataURL(archivo);
    }
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
  const inicial = nombreMostrar?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header del perfil */}
          <div className="bg-gradient-to-r from-red-700 to-red-800 px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden">
                {perfil?.foto_perfil_url ? (
                  <img 
                    src={perfil.foto_perfil_url} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-red-700 text-4xl font-bold">
                    {inicial}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {nombreMostrar}
                </h1>
                <p className="text-red-100">{usuario?.correo || 'Sin correo'}</p>
              </div>
            </div>
          </div>

          {/* Contenido del perfil */}
          <div className="p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Información Personal</h2>
                <button
                  onClick={abrirModal}
                  className="px-4 py-2 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 transition-colors"
                >
                  Editar Perfil
                </button>
              </div>
              
              {cargandoPerfil ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo
                      </label>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">{nombreMostrar}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo Electrónico
                      </label>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">{usuario?.correo || 'Sin correo'}</p>
                      </div>
                    </div>
                  </div>

                  {usuario.apellido && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido
                      </label>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">{usuario.apellido}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900">{perfil?.telefono || 'No especificado'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900">{perfil?.direccion || 'No especificada'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900">{perfil?.ciudad || 'No especificada'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[100px]">
                      <p className="text-gray-900 whitespace-pre-wrap">{perfil?.descripcion || 'Sin descripción'}</p>
                    </div>
                  </div>

                  {perfil?.foto_perfil_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Foto de Perfil
                      </label>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <img 
                          src={perfil.foto_perfil_url} 
                          alt="Foto de perfil" 
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID de Usuario
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900">#{usuario?.id || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="flex flex-wrap gap-4">
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
            </div>
          </div>

          {/* Modal de Edición */}
          {mostrarModal && (
            <>
              {/* Overlay */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={cerrarModal}
              />
              
              {/* Modal */}
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">Editar Perfil</h3>
                      <button
                        onClick={cerrarModal}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {error && (
                      <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <form onSubmit={manejarGuardar} className="space-y-4">
                      <div>
                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono
                        </label>
                        <input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          value={datosFormulario.telefono}
                          onChange={manejarCambio}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Ej: +52 664 123 4567"
                        />
                      </div>

                      <div>
                        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección
                        </label>
                        <input
                          id="direccion"
                          name="direccion"
                          type="text"
                          value={datosFormulario.direccion}
                          onChange={manejarCambio}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Ej: Av. Revolución 123"
                        />
                      </div>

                      <div>
                        <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-2">
                          Ciudad
                        </label>
                        <input
                          id="ciudad"
                          name="ciudad"
                          type="text"
                          value={datosFormulario.ciudad}
                          onChange={manejarCambio}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Ej: Tijuana, B.C."
                        />
                      </div>

                      <div>
                        <label htmlFor="foto_perfil" className="block text-sm font-medium text-gray-700 mb-2">
                          Foto de Perfil
                        </label>
                        <input
                          id="foto_perfil"
                          name="foto_perfil"
                          type="file"
                          accept="image/*"
                          onChange={manejarSeleccionarFoto}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        {vistaPreviaFoto && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                            <img 
                              src={vistaPreviaFoto} 
                              alt="Vista previa" 
                              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                            />
                          </div>
                        )}
                        <p className="mt-2 text-sm text-gray-500">
                          Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
                        </p>
                      </div>

                      <div>
                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                          Descripción
                        </label>
                        <textarea
                          id="descripcion"
                          name="descripcion"
                          rows={4}
                          value={datosFormulario.descripcion}
                          onChange={manejarCambio}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Escribe una breve descripción sobre ti..."
                        />
                      </div>

                      <div className="flex justify-end gap-4 pt-4">
                        <button
                          type="button"
                          onClick={cerrarModal}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={guardando}
                          className="px-6 py-2 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {guardando ? "Guardando..." : "Guardar Cambios"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

