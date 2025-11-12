import { apiClient } from './client';

export interface VehiculoFoto {
  id: number;
  vehiculo: number;
  url_imagen: string | null;
  url_imagen_url?: string | null;
  vehiculo_info?: string;
  created_at?: string;
  updated_at?: string;
}

export const servicioVehiculoFoto = {
  async getByVehiculo(vehiculoId: number): Promise<VehiculoFoto[]> {
    return await apiClient.get<VehiculoFoto[]>(`/vehiculo_fotos/?vehiculo=${vehiculoId}`);
  },

  async upload(vehiculoId: number, file: File): Promise<VehiculoFoto> {
    const formData = new FormData();
    formData.append('vehiculo', String(vehiculoId));
    formData.append('url_imagen', file);
    return await apiClient.postFormData<VehiculoFoto>('/vehiculo_fotos/', formData);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/vehiculo_fotos/${id}/`);
  },
};


