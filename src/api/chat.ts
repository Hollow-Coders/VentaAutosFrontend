import { apiClient } from './client';

// Tipo de mensaje
export interface Mensaje {
  id: number;
  venta: number;
  remitente: number;
  remitente_nombre?: string;
  contenido: string;
  fecha_envio: string;
  leido: boolean;
}

// Solicitud para crear un mensaje
export interface SolicitudMensaje {
  venta: number;
  contenido: string;
}

// Respuesta de mensaje
export interface RespuestaMensaje {
  id: number;
  venta: number;
  remitente: number;
  contenido: string;
  fecha_envio: string;
  leido: boolean;
}

// Servicios de chat
export const servicioChat = {
  // Obtener todos los mensajes de una venta específica
  async getMensajesPorVenta(ventaId: number): Promise<Mensaje[]> {
    return await apiClient.get<Mensaje[]>(`/chat/venta/${ventaId}/mensajes/`);
  },

  // Enviar un mensaje en una venta
  async enviarMensaje(data: SolicitudMensaje): Promise<RespuestaMensaje> {
    return await apiClient.post<RespuestaMensaje>('/chat/mensajes/', data);
  },

  // Marcar mensajes como leídos
  async marcarComoLeidos(ventaId: number): Promise<void> {
    return await apiClient.post<void>(`/chat/venta/${ventaId}/marcar-leidos/`, {});
  },

  // Obtener todas las conversaciones del usuario actual
  async getMisConversaciones(): Promise<Array<{
    venta_id: number;
    vehiculo_nombre: string;
    ultimo_mensaje?: Mensaje;
    mensajes_no_leidos: number;
  }>> {
    return await apiClient.get<Array<{
      venta_id: number;
      vehiculo_nombre: string;
      ultimo_mensaje?: Mensaje;
      mensajes_no_leidos: number;
    }>>('/chat/conversaciones/');
  },
};

