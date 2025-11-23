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

export default function RatingForm({
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Valorar Compra
          </h2>
          <p className="text-sm text-gray-600">
            Compra: <span className="font-medium">{vehiculoNombre}</span>
          </p>
          <p className="text-sm text-gray-600">
            Vendedor: <span className="font-medium">{vendedorNombre}</span>
          </p>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Calificación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Calificación (0.0 - 5.0)
            </label>
            <div className="flex items-center gap-4">
              {/* Estrellas visuales */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((estrella) => (
                  <button
                    key={estrella}
                    type="button"
                    onClick={() => setCalificacion(estrella)}
                    className={`transition-colors ${
                      estrella <= calificacion
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    disabled={estaCargando}
                  >
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              {/* Input numérico */}
              <div className="flex-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={estaCargando}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Puedes usar valores decimales (ej: 4.5)
            </p>
          </div>

          {/* Comentario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentario (opcional)
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={4}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              placeholder="Comparte tu experiencia con esta compra..."
              disabled={estaCargando}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {comentario.length}/500 caracteres
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={estaCargando}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={manejarEnviar}
            disabled={estaCargando}
            className="flex-1 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {estaCargando ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enviando...
              </>
            ) : (
              "Enviar Valoración"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

