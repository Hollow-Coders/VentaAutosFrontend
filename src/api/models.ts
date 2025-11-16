import { apiClient } from './client';

// Tipo de modelo
export interface Modelo {
  id: number;
  marca: number;
  nombre: string;
  tipo_vehiculo: number;
  tipo_vehiculo_descripcion: string;
  año_inicio?: number;
  año_fin?: number;
}

// Servicios de modelos
export const servicioModelo = {
  // Obtener todos los modelos
  async getAll(): Promise<Modelo[]> {
    return await apiClient.get<Modelo[]>('/modelos/');
  },

  // Obtener modelos de una marca
  async getByBrand(brandId: number): Promise<Modelo[]> {
    return await apiClient.get<Modelo[]>(`/modelos/?marca=${brandId}`);
  },

  // Obtener un modelo por ID
  async getById(id: number): Promise<Modelo> {
    return await apiClient.get<Modelo>(`/modelos/${id}/`);
  },
};

