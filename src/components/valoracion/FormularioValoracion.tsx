  "use client";

import { useState } from "react";
import { servicioValoracion, SolicitudValoracion } from "../../api/ratings";

interface RatingFormProps {
  ventaId: number;
  vehiculoNombre: string;
  vendedorNombre: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function FormularioValoracion({
  ventaId,
  vehiculoNombre,
  vendedorNombre,
  onSuccess,
  onCancel,
}: RatingFormProps) {
  const [calificacion, setCalificacion] = useState<number>(5);
  const [comentario, setComentario] = useState("");
  const [estaCargando, setEstaCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const manejarEnviar = async () => {
    // Validar calificación
    if (calificacion < 0 || calificacion > 5) {
      setError("La calificación debe estar entre 0.0 y 5.0");
      return;
    }

    // Validar comentario (máximo 500 caracteres)
    if (comentario.length > 500) {
      setError("El comentario no puede exceder 500 caracteres");
      return;
    }

    setError(null);
    setEstaCargando(true);

    try {
      // Preparar la solicitud según la documentación del backend
      const solicitud: SolicitudValoracion = {
        venta: ventaId,
        calificacion: calificacion,
      };

      // Solo incluir comentario si no está vacío
      const comentarioLimpio = comentario.trim();
      if (comentarioLimpio) {
        solicitud.comentario = comentarioLimpio;
      }

      console.log("Enviando valoración:", solicitud);
      await servicioValoracion.create(solicitud);
      console.log("Valoración creada exitosamente");
      onSuccess();
    } catch (err: unknown) {
      console.error("Error creando valoración:", err);
      
      // Verificar si es un ApiError con status code
      let statusCode: number | undefined;
      let errorMessage = "";
      
      if (err instanceof Error) {
        errorMessage = err.message.toLowerCase();
        
        // Intentar obtener el status code si es un ApiError
        if ('status' in err && typeof (err as { status?: number }).status === 'number') {
          statusCode = (err as { status: number }).status;
        }
      }
      
      // Manejar errores según el código de estado HTTP
      if (statusCode === 500 || errorMessage.includes("respuesta no válida") || errorMessage.includes("doctype") || errorMessage.includes("<html")) {
        setError("Error interno del servidor (500). El sistema de valoraciones no está disponible en este momento. Por favor, contacta al administrador o verifica los logs del servidor.");
      } else if (statusCode === 404 || errorMessage.includes("404") || errorMessage.includes("not found")) {
        setError("El endpoint de valoraciones no está disponible (404). Por favor, verifica que el backend esté configurado correctamente.");
      } else if (statusCode === 401 || errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
        setError("No estás autenticado. Por favor, inicia sesión nuevamente.");
      } else if (statusCode === 403 || errorMessage.includes("403") || errorMessage.includes("forbidden") || errorMessage.includes("solo el comprador")) {
        setError("No tienes permiso para realizar esta acción. Solo el comprador puede crear la valoración.");
      } else if (statusCode === 400 || errorMessage.includes("ya existe") || errorMessage.includes("ya valorado") || errorMessage.includes("duplicado")) {
        setError("Ya has valorado esta compra anteriormente. Solo puedes valorar cada compra una vez.");
        // Cerrar el formulario después de un momento
        setTimeout(() => {
          onCancel();
        }, 3000);
      } else if (errorMessage.includes("requerido") || errorMessage.includes("required")) {
        setError("Todos los campos requeridos deben estar completos.");
      } else if (errorMessage.includes("calificacion") || errorMessage.includes("calificación")) {
        setError("La calificación debe estar entre 0.0 y 5.0.");
      } else if (errorMessage.includes("comentario")) {
        setError("El comentario no puede exceder 500 caracteres.");
      } else if (err instanceof Error) {
        setError(err.message || "Error al crear la valoración. Inténtalo de nuevo.");
      } else {
        setError("Error al crear la valoración. Inténtalo de nuevo.");
      }
    } finally {
      setEstaCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all animate-scaleIn">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Valorar tu Compra
              </h2>
              <div className="space-y-1.5">
                <p className="text-red-50 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-white">{vehiculoNombre}</span>
                </p>
                <p className="text-red-50 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Vendedor: <span className="font-medium text-white">{vendedorNombre}</span></span>
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              disabled={estaCargando}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Calificación con diseño mejorado */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
            <label className="block text-base font-semibold text-gray-800 mb-4 text-center">
              ¿Cómo calificarías esta compra?
            </label>
            
            {/* Estrellas grandes e interactivas */}
            <div className="flex justify-center items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((estrella) => (
                <button
                  key={estrella}
                  type="button"
                  onClick={() => setCalificacion(estrella)}
                  disabled={estaCargando}
                  className={`transition-all duration-200 transform hover:scale-110 active:scale-95 ${
                    estrella <= calificacion
                      ? "text-yellow-400 drop-shadow-lg"
                      : "text-gray-300 hover:text-yellow-200"
                  }`}
                >
                  <svg
                    className="w-12 h-12"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Valor numérico destacado */}
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-md border border-gray-200">
                <span className="text-sm font-medium text-gray-600">Calificación:</span>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.5"
                  value={calificacion}
                  onChange={(e) => {
                    const valor = parseFloat(e.target.value);
                    if (!isNaN(valor) && valor >= 0 && valor <= 5) {
                      setCalificacion(valor);
                    }
                  }}
                  className="w-20 text-center text-2xl font-bold text-red-600 border-0 focus:ring-2 focus:ring-red-500 rounded-lg bg-transparent"
                  disabled={estaCargando}
                />
                <span className="text-sm text-gray-500">/ 5.0</span>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Puedes usar valores decimales (ej: 4.5)
              </p>
            </div>
          </div>

          {/* Comentario con diseño mejorado */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Comparte tu experiencia (opcional)
            </label>
            <div className="relative">
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={5}
                maxLength={500}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-all text-gray-700 placeholder-gray-400"
                placeholder="Cuéntanos sobre tu experiencia con esta compra. ¿Qué te gustó? ¿Hay algo que mejorar?"
                disabled={estaCargando}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span className={`text-xs font-medium ${
                  comentario.length > 450 ? 'text-red-500' : 'text-gray-400'
                }`}>
                  {comentario.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* Error con mejor diseño */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-3 animate-shake">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="flex-1">{error}</p>
            </div>
          )}
        </div>

        {/* Footer con botones mejorados */}
        <div className="p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={estaCargando}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-white hover:border-gray-400 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={manejarEnviar}
            disabled={estaCargando}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {estaCargando ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enviando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Enviar Valoración
              </>
            )}
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

