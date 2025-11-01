import { apiClient } from './client';

// Tipo de perfil
export interface Perfil {
  id: number;
  usuario: number;
  usuario_nombre?: string;
  usuario_apellido?: string;
  usuario_correo?: string;
  descripcion?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  foto_perfil?: string;
  foto_perfil_url?: string;
  fecha_actualizacion?: string;
}

// Solicitud para crear/actualizar perfil
export interface SolicitudPerfil {
  usuario?: number;
  descripcion?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  foto_perfil?: string;
}

// Servicios de perfil
export const servicioPerfil = {
  // Obtener todos los perfiles
  async getAll(): Promise<Perfil[]> {
    return await apiClient.get<Perfil[]>('/perfiles/');
  },

  // Obtener un perfil por ID
  async getById(id: number): Promise<Perfil> {
    return await apiClient.get<Perfil>(`/perfiles/${id}/`);
  },

  // Obtener perfil del usuario actual
  async getMyProfile(): Promise<Profile> {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('current_user') : null;
    if (!userStr) {
      throw new Error('Usuario no autenticado');
    }
    const user = JSON.parse(userStr);
    
    // Buscar el perfil del usuario actual
    const perfiles = await this.getAll();
    const perfil = perfiles.find(p => p.usuario === Number(user.id));
    
    if (!perfil) {
      throw new Error('Perfil no encontrado');
    }
    
    return perfil;
  },

  // Obtener perfil por usuario_id (usando el endpoint mi_perfil)
  async getByUsuarioId(usuarioId: number): Promise<Perfil> {
    return await apiClient.get<Perfil>(`/perfiles/mi_perfil/?usuario_id=${usuarioId}`);
  },

  // Crear un nuevo perfil
  async create(data: SolicitudPerfil): Promise<Perfil> {
    return await apiClient.post<Perfil>('/perfiles/', data);
  },

  // Actualizar un perfil
  async update(id: number, data: SolicitudPerfil): Promise<Perfil> {
    return await apiClient.put<Perfil>(`/perfiles/${id}/`, data);
  },

  // Actualizar parcialmente un perfil
  async partialUpdate(id: number, data: Partial<SolicitudPerfil>): Promise<Perfil> {
    return await apiClient.patch<Perfil>(`/perfiles/${id}/actualizar_perfil/`, data);
  },

  // Subir foto de perfil
  async uploadFotoPerfil(id: number, file: File): Promise<Perfil> {
    const formData = new FormData();
    formData.append('foto_perfil', file);
    return await apiClient.patchFormData<Perfil>(`/perfiles/${id}/actualizar_perfil/`, formData);
  },
};

