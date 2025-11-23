import { apiClient } from './client';

// Información del vehículo en la valoración
export interface VehiculoInfo {
  id: number;
  marca: string;
  modelo: string;
  año: number;
}

// Valoración completa
export interface Valoracion {
  id: number;
  venta: number;
  comprador: number;
  comprador_nombre: string;
  vendedor_nombre: string;
  vehiculo_info: VehiculoInfo;
  calificacion: string; // Decimal como string (0.0 a 5.0)
  comentario: string | null;
  fecha_creacion: string; // ISO 8601 datetime
  fecha_actualizacion: string; // ISO 8601 datetime
}

// Solicitud para crear una valoración
export interface SolicitudValoracion {
  venta: number;
  calificacion: number; // 0.0 a 5.0, permite decimales
  comentario?: string; // Opcional, max 500 caracteres
}

// Respuesta de valoraciones por vendedor
export interface ValoracionesPorVendedor {
  vendedor_id: number;
  vendedor_nombre: string;
  total_valoraciones: number;
  valoraciones: Valoracion[];
}

// Respuesta de promedio de vendedor
export interface PromedioVendedor {
  vendedor_id: number;
  vendedor_nombre: string;
  promedio_calificacion: number;
  total_valoraciones: number;
}

// Servicios de valoraciones
export const servicioValoracion = {
  // Crear una nueva valoración
  async create(data: SolicitudValoracion): Promise<Valoracion> {
    return await apiClient.post<Valoracion>('/valoraciones/', data);
  },

  // Obtener valoraciones de un vendedor
  async getByVendedor(vendedorId: number): Promise<ValoracionesPorVendedor> {
    return await apiClient.get<ValoracionesPorVendedor>(
      `/valoraciones/por_vendedor/?vendedor_id=${vendedorId}`
    );
  },

  // Obtener promedio de calificaciones de un vendedor
  async getPromedioVendedor(vendedorId: number): Promise<PromedioVendedor> {
    return await apiClient.get<PromedioVendedor>(
      `/valoraciones/promedio_vendedor/?vendedor_id=${vendedorId}`
    );
  },

  // Verificar si ya existe una valoración para una venta específica
  // Obtiene las valoraciones del vendedor y verifica si alguna corresponde a la venta
  async verificarValoracionExistente(ventaId: number, vendedorId: number): Promise<boolean> {
    try {
      const valoraciones = await this.getByVendedor(vendedorId);
      return valoraciones.valoraciones.some(val => val.venta === ventaId);
    } catch (error) {
      console.error("Error verificando valoración existente:", error);
      // Si hay error, asumimos que no existe para no bloquear la UI
      return false;
    }
  },
};

