"use client";

import Link from "next/link";
import { useAuth } from "../../../../hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { servicioChat, Mensaje, SolicitudMensaje } from "../../../../api/chat";
import { servicioVenta, Venta } from "../../../../api/sales";
import { servicioVehiculo, VehiculoDetalle } from "../../../../api/vehicles";
import { ApiError } from "../../../../api/config";
import { apiClient } from "../../../../api/client";

export default function ChatPage() {
  const { usuario, estaAutenticado, estaCargando, cerrarSesion } = useAuth();
  const router = useRouter();
  const params = useParams();
  const ventaId = Number(params.ventaId);

  const [mensajes, establecerMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, establecerNuevoMensaje] = useState("");
  const [cargando, establecerCargando] = useState(true);
  const [enviando, establecerEnviando] = useState(false);
  const [error, establecerError] = useState("");
  const [errorChatNoDisponible, establecerErrorChatNoDisponible] = useState(false);
  const [venta, establecerVenta] = useState<Venta | null>(null);
  const [vehiculo, establecerVehiculo] = useState<VehiculoDetalle | null>(null);
  const [vendedorNombre, establecerVendedorNombre] = useState<string>("");

  const intervaloRef = useRef<NodeJS.Timeout | null>(null);
  const mensajesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!estaCargando && !estaAutenticado) {
      router.push("/login");
    }
  }, [estaAutenticado, estaCargando, router]);

  // Función para hacer scroll al final del contenedor de mensajes
  const scrollToBottom = useCallback(() => {
    if (mensajesContainerRef.current) {
      mensajesContainerRef.current.scrollTo({
        top: mensajesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  // Cargar mensajes
  const cargarMensajes = useCallback(async () => {
    try {
      const mensajesData = await servicioChat.getMensajesPorVenta(ventaId);
      establecerMensajes(mensajesData);
      establecerErrorChatNoDisponible(false);
    } catch (error) {
      // Si es un error 401, verificar si hay token
      if (error instanceof ApiError && error.status === 401) {
        const token = apiClient.getToken();
        // Si hay token pero el backend lo rechaza, probablemente expiró
        if (token) {
          console.error("Token expirado o inválido, cerrando sesión");
          cerrarSesion();
          router.push("/login?expired=true");
        } else {
          console.error("No hay token, redirigiendo al login");
          router.push("/login");
        }
        return;
      }
      // Si es un error 404, significa que el endpoint no está implementado aún
      if (error instanceof ApiError && error.status === 404) {
        establecerErrorChatNoDisponible(true);
        establecerMensajes([]);
        // Detener el polling si el endpoint no existe
        if (intervaloRef.current) {
          clearInterval(intervaloRef.current);
          intervaloRef.current = null;
        }
      } else if (error instanceof ApiError && error.status === 500) {
        // Error 500: problema en el servidor
        console.error("Error del servidor (500):", error);
        establecerError("Error en el servidor. Por favor, intenta más tarde o contacta al soporte.");
        establecerErrorChatNoDisponible(true);
        establecerMensajes([]);
        // Detener el polling si hay error del servidor
        if (intervaloRef.current) {
          clearInterval(intervaloRef.current);
          intervaloRef.current = null;
        }
      } else {
        console.error("Error cargando mensajes:", error);
        establecerError("Error al cargar los mensajes.");
      }
    }
  }, [ventaId, router, cerrarSesion]);

  // Cargar información inicial
  useEffect(() => {
    const cargarInformacion = async () => {
      if (!estaAutenticado || !ventaId) return;

      establecerCargando(true);
      establecerError("");

      // Verificar token antes de hacer peticiones
      const token = apiClient.getToken();
      if (!token) {
        console.warn("No hay token disponible, pero el usuario está autenticado según el contexto");
        establecerError("Error de autenticación. Por favor, inicia sesión nuevamente.");
        establecerCargando(false);
        return;
      }

      try {
        // Cargar venta
        const ventaData = await servicioVenta.getById(ventaId);
        establecerVenta(ventaData);

        // Verificar que el usuario es parte de esta venta
        if (ventaData.comprador !== Number(usuario?.id) && ventaData.vendedor !== Number(usuario?.id)) {
          establecerError("No tienes permiso para ver este chat.");
          establecerCargando(false);
          return;
        }

        // Cargar vehículo
        const vehiculoData = await servicioVehiculo.getById(ventaData.vehiculo);
        establecerVehiculo(vehiculoData);
        establecerVendedorNombre(vehiculoData.usuario_nombre);

        // Cargar mensajes iniciales
        await cargarMensajes();
        // Scroll al final cuando se cargan los mensajes iniciales
        setTimeout(() => {
          scrollToBottom();
        }, 200);
      } catch (error) {
        console.error("Error cargando información:", error);
        // Si es un error 401, verificar si hay token
        if (error instanceof ApiError && error.status === 401) {
          const token = apiClient.getToken();
          // Si hay token pero el backend lo rechaza, probablemente expiró
          if (token) {
            console.error("Token expirado o inválido, cerrando sesión");
            cerrarSesion();
            router.push("/login?expired=true");
          } else {
            console.error("No hay token, redirigiendo al login");
            router.push("/login");
          }
          return;
        }
        // Si es un error 500, mostrar mensaje específico
        if (error instanceof ApiError && error.status === 500) {
          establecerError("Error en el servidor al cargar la información del chat. Por favor, intenta más tarde.");
        } else {
          establecerError("Error al cargar la información del chat.");
        }
      } finally {
        establecerCargando(false);
      }
    };

    if (estaAutenticado) {
      cargarInformacion();
    }
  }, [estaAutenticado, ventaId, usuario?.id, cargarMensajes, router, cerrarSesion, scrollToBottom]);

  // Polling para actualizar mensajes cada 3 segundos (solo si el chat está disponible)
  useEffect(() => {
    if (!estaAutenticado || !ventaId || errorChatNoDisponible) return;

    intervaloRef.current = setInterval(() => {
      cargarMensajes();
    }, 3000);

    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, [estaAutenticado, ventaId, errorChatNoDisponible, cargarMensajes]);


  // Enviar mensaje
  const manejarEnviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || enviando || !ventaId) return;

    const contenido = nuevoMensaje.trim();
    establecerNuevoMensaje("");
    establecerEnviando(true);

    try {
      const solicitud: SolicitudMensaje = {
        venta: ventaId,
        contenido,
      };

      await servicioChat.enviarMensaje(solicitud);
      await cargarMensajes();
      // Scroll al final después de enviar mensaje
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      // Si es un error 401, verificar si hay token
      if (error instanceof ApiError && error.status === 401) {
        const token = apiClient.getToken();
        // Si hay token pero el backend lo rechaza, probablemente expiró
        if (token) {
          console.error("Token expirado o inválido, cerrando sesión");
          cerrarSesion();
          router.push("/login?expired=true");
        } else {
          console.error("No hay token, redirigiendo al login");
          router.push("/login");
        }
        return;
      }
      if (error instanceof ApiError && error.status === 404) {
        establecerErrorChatNoDisponible(true);
        establecerError("El sistema de chat aún no está disponible. Por favor, contacta al vendedor por otros medios.");
      } else {
        establecerError("Error al enviar el mensaje. Por favor, intenta de nuevo.");
      }
      establecerNuevoMensaje(contenido); // Restaurar el mensaje
    } finally {
      establecerEnviando(false);
    }
  };

  const formatearFecha = (fecha: string): string => {
    const fechaObj = new Date(fecha);
    const ahora = new Date();
    const diferencia = ahora.getTime() - fechaObj.getTime();
    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(diferencia / 3600000);
    const dias = Math.floor(diferencia / 86400000);

    if (minutos < 1) return "Ahora";
    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas} h`;
    if (dias < 7) return `Hace ${dias} d`;
    
    return fechaObj.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (estaCargando || cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando chat...</p>
        </div>
      </div>
    );
  }

  if (error && !venta) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push("/mis-compras")}
              className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors"
            >
              Volver a Mis Compras
            </button>
          </div>
        </div>
      </div>
    );
  }

  const esRemitente = (mensaje: Mensaje) => mensaje.remitente === Number(usuario?.id);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/mis-compras")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {vehiculo ? `${vehiculo.marca_nombre} ${vehiculo.modelo_nombre} ${vehiculo.año}` : "Chat"}
                </h1>
                <p className="text-sm text-gray-600">
                  {venta?.comprador === Number(usuario?.id) 
                    ? `Vendedor: ${vendedorNombre}`
                    : `Comprador: Usuario`}
                </p>
              </div>
            </div>
            {vehiculo && (
              <Link
                href={`/vehiculo/${vehiculo.id}`}
                className="text-red-700 hover:text-red-800 text-sm font-medium"
              >
                Ver Vehículo
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 flex flex-col container mx-auto px-4 py-4 min-h-0 overflow-hidden">
        {/* Mensajes de error fuera del contenedor con scroll */}
        {errorChatNoDisponible && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex-shrink-0">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-semibold mb-1">Sistema de chat no disponible</p>
                <p className="text-sm">El sistema de chat aún no está implementado en el backend. Por favor, contacta al vendedor por otros medios.</p>
              </div>
            </div>
          </div>
        )}

        {error && !errorChatNoDisponible && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex-shrink-0">
            {error}
          </div>
        )}

        {/* Contenedor con scroll para los mensajes - altura fija */}
        <div 
          ref={mensajesContainerRef}
          className="flex-1 overflow-y-auto bg-gray-50 rounded-lg border border-gray-200 p-4 min-h-0 max-h-full"
        >
          {mensajes.length === 0 && !errorChatNoDisponible ? (
            <div className="text-center py-12 h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-600">No hay mensajes aún. ¡Comienza la conversación!</p>
            </div>
          ) : mensajes.length > 0 ? (
            <div className="space-y-4">
              {mensajes.map((mensaje) => (
                <div
                  key={mensaje.id}
                  className={`flex ${esRemitente(mensaje) ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    esRemitente(mensaje)
                      ? "bg-red-700 text-white"
                      : "bg-white text-gray-900 border border-gray-200"
                  }`}>
                    {!esRemitente(mensaje) && mensaje.remitente_nombre && (
                      <p className="text-xs font-semibold mb-1 opacity-75">
                        {mensaje.remitente_nombre}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {mensaje.contenido}
                    </p>
                    <p className={`text-xs mt-1 ${
                      esRemitente(mensaje) ? "text-red-100" : "text-gray-500"
                    }`}>
                      {formatearFecha(mensaje.fecha_envio)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Input de mensaje */}
      <div className="bg-white border-t border-gray-200 flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={manejarEnviarMensaje} className="flex gap-2">
            <input
              type="text"
              value={nuevoMensaje}
              onChange={(e) => establecerNuevoMensaje(e.target.value)}
              placeholder={errorChatNoDisponible ? "Chat no disponible" : "Escribe un mensaje..."}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={enviando || errorChatNoDisponible}
            />
            <button
              type="submit"
              disabled={!nuevoMensaje.trim() || enviando || errorChatNoDisponible}
              className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {enviando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Enviar</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

