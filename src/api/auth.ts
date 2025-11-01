import { apiClient } from './client';

// Tipos relacionados con autenticación
export interface Usuario {
  id: number | string;
  nombre: string;
  apellido?: string;
  nombre_completo?: string;
  correo: string;
  avatar?: string;
}

export interface SolicitudInicioSesion {
  correo: string;
  contrasena: string;
}

// Respuesta real del backend Django
export interface RespuestaInicioSesion {
  id: number;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  correo: string;
  access: string; // Token de acceso
}

export interface SolicitudRegistro {
  nombre: string;
  apellido: string;
  nombre_completo: string;
  correo: string;
  contrasena: string;
  rol: number;
}

// Respuesta real del backend Django para registro
export interface RespuestaRegistro {
  id: number;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  correo: string;
  access: string; // Token de acceso
}

// Servicios de autenticación
export const servicioAutenticacion = {
  // Iniciar sesión
  async login(credentials: SolicitudInicioSesion): Promise<RespuestaInicioSesion> {
    const response = await apiClient.post<RespuestaInicioSesion>('/login/', credentials);
    // Guardar el token (el backend devuelve 'access' en lugar de 'token')
    if (response.access) {
      apiClient.setToken(response.access);
    }
    return response;
  },

  // Registrar nuevo usuario
  async register(data: SolicitudRegistro): Promise<RespuestaRegistro> {
    // Log para depuración
    console.log('Datos enviados al backend:', JSON.stringify(data, null, 2));
    const response = await apiClient.post<RespuestaRegistro>('/register/', data);
    // Guardar el token (el backend devuelve 'access' en lugar de 'token')
    if (response.access) {
      apiClient.setToken(response.access);
    }
    
    // Crear perfil automáticamente después del registro
    try {
      const { servicioPerfil } = await import('./profile');
      await servicioPerfil.create({ usuario: response.id });
      console.log('Perfil creado automáticamente para el usuario:', response.id);
    } catch (error) {
      console.error('Error al crear perfil automáticamente:', error);
      // No lanzamos el error para no interrumpir el registro
    }
    
    return response;
  },

  // Cerrar sesión (solo local, no hay endpoint en el backend)
  async logout(): Promise<void> {
    // Eliminar el token localmente
    apiClient.removeToken();
    servicioAutenticacion.removeCurrentUser();
  },

  // Verificar autenticación (obtener usuario actual desde /usuarios/ endpoint)
  async verifyToken(): Promise<Usuario> {
    // Si hay token, intentar obtener el usuario actual
    // Nota: Esto dependerá de cómo esté configurado el backend
    // Por ahora retornamos null si no hay usuario en storage
    const user = servicioAutenticacion.getCurrentUser();
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }
    return user;
  },

  // Obtener usuario actual
  getCurrentUser(): Usuario | null {
    try {
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('current_user') : null;
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // Guardar usuario actual
  setCurrentUser(user: Usuario): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('current_user', JSON.stringify(user));
    }
  },

  // Eliminar usuario actual
  removeCurrentUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('current_user');
    }
  },
};

