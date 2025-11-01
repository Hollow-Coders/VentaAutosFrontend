import { apiClient } from './client';

// Tipo de venta
export interface Venta {
  id: number;
  vehiculo: number;
  comprador: number;
  vendedor?: number;
  precio_final: number;
  fecha_venta: string;
  metodo_pago: string;
  estado: 'pendiente' | 'completada' | 'cancelada';
}

// Solicitud para crear una venta
export interface SolicitudVenta {
  vehiculo: number;
  precio_final: number;
  metodo_pago: string;
}

// Respuesta de venta
export interface RespuestaVenta {
  id: number;
  vehiculo: number;
  comprador: number;
  precio_final: number;
  fecha_venta: string;
  estado: string;
}

// Servicios de ventas
export const servicioVenta = {
  // Obtener todas las ventas
  async getAll(): Promise<Venta[]> {
    return await apiClient.get<Venta[]>('/ventas/');
  },

  // Obtener una venta por ID
  async getById(id: number): Promise<Venta> {
    return await apiClient.get<Venta>(`/ventas/${id}/`);
  },

  // Obtener ventas del usuario actual
  async getMyPurchases(): Promise<Venta[]> {
    return await apiClient.get<Venta[]>('/ventas/?comprador=current');
  },

  // Obtener ventas de mis vehículos (como vendedor)
  async getMySales(): Promise<Venta[]> {
    return await apiClient.get<Venta[]>('/ventas/?vendedor=current');
  },

  // Crear una nueva venta (comprar un vehículo)
  async create(data: SolicitudVenta): Promise<RespuestaVenta> {
    return await apiClient.post<RespuestaVenta>('/ventas/', data);
  },

  // Comprar un vehículo (método simplificado)
  async purchase(vehicleId: number, precioFinal: number, metodoPago: string = 'transferencia'): Promise<RespuestaVenta> {
    return await this.create({
      vehiculo: vehicleId,
      precio_final: precioFinal,
      metodo_pago: metodoPago,
    });
  },
};

