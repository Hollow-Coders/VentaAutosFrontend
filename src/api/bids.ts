import { apiClient } from './client';

// Tipo de puja
export interface Puja {
  id: number;
  subasta: number;
  usuario: number;
  monto: number;
  fecha_puja: string;
  es_ganadora?: boolean;
}

// Solicitud para crear una puja
export interface SolicitudPuja {
  subasta: number;
  monto: number;
}

// Respuesta de puja
export interface RespuestaPuja {
  id: number;
  subasta: number;
  usuario: number;
  monto: number;
  fecha_puja: string;
}

// Servicios de pujas
export const servicioPuja = {
  // Obtener todas las pujas
  async getAll(): Promise<Puja[]> {
    return await apiClient.get<Puja[]>('/pujas/');
  },

  // Obtener pujas de una subasta específica
  async getByAuction(subastaId: number): Promise<Puja[]> {
    return await apiClient.get<Puja[]>(`/pujas/?subasta=${subastaId}`);
  },

  // Obtener pujas del usuario actual
  async getMyBids(): Promise<Puja[]> {
    return await apiClient.get<Puja[]>('/pujas/?usuario=current');
  },

  // Crear una nueva puja
  async create(data: SolicitudPuja): Promise<RespuestaPuja> {
    return await apiClient.post<RespuestaPuja>('/pujas/', data);
  },

  // Obtener una puja por ID
  async getById(id: number): Promise<Puja> {
    return await apiClient.get<Puja>(`/pujas/${id}/`);
  },

  // Hacer una puja en una subasta (método simplificado)
  async bid(subastaId: number, amount: number): Promise<RespuestaPuja> {
    return await this.create({ subasta: subastaId, monto: amount });
  },
};

