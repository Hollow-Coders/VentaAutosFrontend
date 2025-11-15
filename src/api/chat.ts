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

// Solicitud para crear un mensaje (usando venta)
export interface SolicitudMensaje {
  venta: number;
  contenido: string;
}

// Solicitud para crear un mensaje (usando comprador, vendedor y vehiculo)
export interface SolicitudMensajeNuevo {
  comprador: number;
  vendedor: number;
  vehiculo: number;
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
  // Obtener todos los mensajes de una venta específica (método antiguo)
  async getMensajesPorVenta(ventaId: number): Promise<Mensaje[]> {
    return await apiClient.get<Mensaje[]>(`/chat/venta/${ventaId}/mensajes/`);
  },

  // Obtener todos los mensajes usando comprador, vendedor y vehiculo
  async getMensajesPorChat(comprador: number, vendedor: number, vehiculo: number): Promise<Mensaje[]> {
    return await apiClient.get<Mensaje[]>(`/chat/mensajes/?comprador=${comprador}&vendedor=${vendedor}&vehiculo=${vehiculo}`);
  },

  // Enviar un mensaje en una venta (método antiguo)
  async enviarMensaje(data: SolicitudMensaje): Promise<RespuestaMensaje> {
    return await apiClient.post<RespuestaMensaje>('/chat/mensajes/', data);
  },

  // Enviar un mensaje usando comprador, vendedor y vehiculo
  async enviarMensajeNuevo(data: SolicitudMensajeNuevo): Promise<RespuestaMensaje> {
    return await apiClient.post<RespuestaMensaje>('/chat/mensajes/', data);
  },

  // Marcar mensajes como leídos (método antiguo)
  async marcarComoLeidos(ventaId: number): Promise<void> {
    return await apiClient.post<void>(`/chat/venta/${ventaId}/marcar-leidos/`, {});
  },

  // Marcar mensajes como leídos usando comprador, vendedor y vehiculo
  async marcarComoLeidosNuevo(comprador: number, vendedor: number, vehiculo: number): Promise<void> {
    return await apiClient.post<void>(`/chat/marcar-leidos/`, {
      comprador,
      vendedor,
      vehiculo
    });
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

