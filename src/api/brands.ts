import { apiClient } from './client';

// Tipo de marca
export interface Marca {
  id: number;
  nombre: string;
  pais_origen?: string;
  fecha_fundacion?: string;
}

// Servicios de marcas
export const servicioMarca = {
  // Obtener todas las marcas
  async getAll(): Promise<Marca[]> {
    return await apiClient.get<Marca[]>('/marcas/');
  },

  // Obtener una marca por ID
  async getById(id: number): Promise<Marca> {
    return await apiClient.get<Marca>(`/marcas/${id}/`);
  },
};

