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

interface EstadisticasPerfil {
  totalVehiculos: number;
  vehiculosActivos: number;
  vehiculosVendidos: number;
}

interface EncabezadoPerfilPropiedades {
  usuario: Usuario;
  perfil: Perfil | null;
  alActualizarPerfil?: (perfil: Perfil) => void;
  esPropietario?: boolean;
  estadisticas?: EstadisticasPerfil;
}

export default function EncabezadoPerfil({ usuario, perfil, alActualizarPerfil, esPropietario = true, estadisticas }: EncabezadoPerfilPropiedades) {
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
      {/* Encabezado del perfil */}
      <div className="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/90 via-red-700/85 to-rose-800/90 dark:from-red-900/80 dark:via-red-950/75 dark:to-slate-900/90" />
        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.04]">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white rounded-full" />
          <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-white rounded-full translate-y-1/2" />
        </div>

        <div className="relative z-10 px-5 sm:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white/25 dark:ring-slate-700/50">
                {perfil?.foto_perfil_url ? (
                  <img
                    src={perfil.foto_perfil_url}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-red-600 dark:text-red-400 text-3xl sm:text-4xl font-semibold">
                    {inicial}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-red-100/80 font-medium mb-1">
                Mi perfil
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold break-words tracking-tight">
                {nombreMostrar}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-red-100/90">
                <span className="truncate">{usuario?.correo || "Sin correo"}</span>
                {perfil?.ciudad && (
                  <>
                    <span className="hidden sm:inline text-red-200/50">·</span>
                    <span>{perfil.ciudad}</span>
                  </>
                )}
              </div>

              {estadisticas && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/15 backdrop-blur-sm">
                    {estadisticas.totalVehiculos} publicado{estadisticas.totalVehiculos !== 1 ? "s" : ""}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-100">
                    {estadisticas.vehiculosActivos} activo{estadisticas.vehiculosActivos !== 1 ? "s" : ""}
                  </span>
                  {estadisticas.vehiculosVendidos > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm">
                      {estadisticas.vehiculosVendidos} vendido{estadisticas.vehiculosVendidos !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              )}
            </div>

            {puedeEditar && (
              <button
                onClick={abrirModal}
                className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-white text-red-700 hover:bg-red-50 dark:bg-slate-800 dark:text-red-300 dark:hover:bg-slate-700 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar perfil
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
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
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
                  <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={manejarGuardar} className="space-y-6">
                  {/* Sección de foto de perfil */}
                  <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6 border-2 border-dashed border-gray-200 dark:border-gray-600">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                      Foto de Perfil
                    </label>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="relative">
                        <div className="w-32 h-32 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white dark:ring-slate-600">
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
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors group"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-10 h-10 mb-3 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold text-red-600 dark:text-red-400">Click para subir</span> o arrastra y suelta
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG o GIF (MAX. 5MB)</p>
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
                      <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="Ej: +52 664 123 4567"
                      />
                    </div>

                    <div>
                      <label htmlFor="ciudad" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="Ej: Tijuana, B.C."
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="direccion" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="Ej: Av. Revolución 123"
                    />
                  </div>

                  <div>
                    <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                      placeholder="Escribe una breve descripción sobre ti..."
                    />
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <button
                      type="button"
                      onClick={cerrarModal}
                      className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
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
