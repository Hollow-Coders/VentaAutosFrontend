"use client";

import { useState, useEffect } from "react";
import { servicioPerfil, Perfil } from "../../api";

interface Usuario {
  id: number | string;
  nombre: string;
  apellido?: string;
  nombre_completo?: string;
  correo: string;
}

interface EncabezadoPerfilPropiedades {
  usuario: Usuario;
  perfil: Perfil | null;
  alActualizarPerfil?: (perfil: Perfil) => void;
  esPropietario?: boolean;
}

export default function EncabezadoPerfil({ usuario, perfil, alActualizarPerfil, esPropietario = true }: EncabezadoPerfilPropiedades) {
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

  // Inicializar formulario cuando cambia el perfil
  useEffect(() => {
    if (perfil) {
      establecerDatosFormulario({
        descripcion: perfil.descripcion || "",
        telefono: perfil.telefono || "",
        direccion: perfil.direccion || "",
        ciudad: perfil.ciudad || "",
        foto_perfil: perfil.foto_perfil || "",
      });
      if (perfil.foto_perfil_url) {
        establecerVistaPreviaFoto(perfil.foto_perfil_url);
      }
    }
  }, [perfil]);

  const puedeEditar = esPropietario;

  useEffect(() => {
    if (!puedeEditar && mostrarModal) {
      establecerMostrarModal(false);
    }
  }, [puedeEditar, mostrarModal]);

  const abrirModal = () => {
    if (!puedeEditar) {
      return;
    }
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
    if (!puedeEditar || !alActualizarPerfil) {
      establecerError("No tienes permiso para editar este perfil.");
      return;
    }

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
        alActualizarPerfil(nuevoPerfil);
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
        alActualizarPerfil(perfilActualizado);
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

  // Obtener nombre para mostrar (con validación)
  const nombreMostrar = usuario?.nombre_completo || usuario?.nombre || usuario?.correo?.split('@')[0] || 'Usuario';
  const inicial = nombreMostrar?.charAt(0)?.toUpperCase() || 'U';

  return (
    <>
      {/* Header del perfil - Rediseñado */}
      <div className="relative bg-gradient-to-br from-red-700 via-red-800 to-red-900 px-8 py-16 overflow-hidden">
        {/* Patrón de fondo decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Avatar con efecto hover */}
            <div className="relative group">
              <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-2xl ring-4 ring-white/20 transition-transform group-hover:scale-105">
                {perfil?.foto_perfil_url ? (
                  <img 
                    src={perfil.foto_perfil_url} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-red-700 text-5xl font-bold">
                    {inicial}
                  </span>
                )}
              </div>
              {/* Badge de verificación */}
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Información del usuario */}
            <div className="flex-1 text-white">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl md:text-5xl font-bold">
                  {nombreMostrar}
                </h1>
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Miembro</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-red-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm md:text-base">{usuario?.correo || 'Sin correo'}</span>
                </div>
                
                {perfil?.ciudad && (
                  <div className="flex items-center gap-2 text-red-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm md:text-base">{perfil.ciudad}</span>
                  </div>
                )}
              </div>

              {/* Descripción breve */}
              {perfil?.descripcion && (
                <p className="text-red-50 text-sm md:text-base line-clamp-2 max-w-2xl">
                  {perfil.descripcion}
                </p>
              )}
            </div>

            {/* Botón de edición mejorado */}
            {puedeEditar && (
              <button
                onClick={abrirModal}
                className="group relative px-8 py-4 bg-white text-red-700 rounded-xl font-bold text-base hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Editar Perfil</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Edición - Rediseñado */}
      {puedeEditar && mostrarModal && (
        <>
          {/* Overlay con animación */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={cerrarModal}
          />
          
          {/* Modal con animación */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del modal */}
              <div className="bg-gradient-to-r from-red-700 to-red-800 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Editar Perfil</h3>
                  </div>
                  <button
                    onClick={cerrarModal}
                    className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Contenido del modal */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {error && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={manejarGuardar} className="space-y-6">
                  {/* Sección de foto de perfil */}
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Foto de Perfil
                    </label>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="relative">
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white">
                          {vistaPreviaFoto ? (
                            <img 
                              src={vistaPreviaFoto} 
                              alt="Vista previa" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                              <span className="text-red-700 text-4xl font-bold">
                                {inicial}
                              </span>
                            </div>
                          )}
                        </div>
                        {vistaPreviaFoto && (
                          <button
                            type="button"
                            onClick={() => {
                              establecerVistaPreviaFoto(null);
                              establecerFotoSeleccionada(null);
                            }}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor="foto_perfil"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-10 h-10 mb-3 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold text-red-600">Click para subir</span> o arrastra y suelta
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG o GIF (MAX. 5MB)</p>
                          </div>
                          <input
                            id="foto_perfil"
                            name="foto_perfil"
                            type="file"
                            accept="image/*"
                            onChange={manejarSeleccionarFoto}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Campos del formulario */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Teléfono
                        </div>
                      </label>
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={datosFormulario.telefono}
                        onChange={manejarCambio}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="Ej: +52 664 123 4567"
                      />
                    </div>

                    <div>
                      <label htmlFor="ciudad" className="block text-sm font-semibold text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Ciudad
                        </div>
                      </label>
                      <input
                        id="ciudad"
                        name="ciudad"
                        type="text"
                        value={datosFormulario.ciudad}
                        onChange={manejarCambio}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="Ej: Tijuana, B.C."
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="direccion" className="block text-sm font-semibold text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Dirección
                      </div>
                    </label>
                    <input
                      id="direccion"
                      name="direccion"
                      type="text"
                      value={datosFormulario.direccion}
                      onChange={manejarCambio}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="Ej: Av. Revolución 123"
                    />
                  </div>

                  <div>
                    <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Descripción
                      </div>
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      rows={5}
                      value={datosFormulario.descripcion}
                      onChange={manejarCambio}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                      placeholder="Escribe una breve descripción sobre ti..."
                    />
                  </div>

                  {/* Botones de acción */}
                  <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={cerrarModal}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={guardando}
                      className="px-8 py-3 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-xl font-semibold hover:from-red-800 hover:to-red-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      {guardando ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Guardar Cambios</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
