import { apiClient } from './client';

// Tipo de subasta
export interface Subasta {
  id: number;
  vehiculo: number;
  precio_inicial: number;
  precio_actual?: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'activa' | 'finalizada' | 'cancelada';
  puja_ganadora?: number;
  usuario_ganador?: number;
}

// Respuesta de subasta
export interface RespuestaSubasta extends Subasta {}

// Servicios de subastas
export const servicioSubasta = {
  // Obtener todas las subastas
  async getAll(): Promise<Subasta[]> {
    return await apiClient.get<Subasta[]>('/subastas/');
  },

  // Obtener subastas activas
  async getActive(): Promise<Subasta[]> {
    return await apiClient.get<Subasta[]>('/subastas/?estado=activa');
  },

  // Obtener una subasta por ID
  async getById(id: number): Promise<Subasta> {
    return await apiClient.get<Subasta>(`/subastas/${id}/`);
  },

  // Obtener subastas de un vehículo específico
  async getByVehicle(vehicleId: number): Promise<Subasta[]> {
    return await apiClient.get<Subasta[]>(`/subastas/?vehiculo=${vehicleId}`);
  },
};

