import { apiClient } from './client';

// Tipos relacionados con autenticación
export interface Usuario {
  id: number | string;
  nombre: string;
  apellido?: string;
  nombre_completo?: string;
  correo: string;
  avatar?: string;
  rol?: number; // ID del rol (1 = Administrador, 2 = Vendedor, 3 = Comprador)
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
  rol?: number; // ID del rol (1 = Administrador, 2 = Vendedor, 3 = Comprador)
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
  rol?: number; // ID del rol (1 = Administrador, 2 = Vendedor, 3 = Comprador)
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
    // Intentar obtener el usuario actual desde el backend
    try {
      // Si hay un endpoint para obtener el usuario actual, usarlo
      // Por ahora, intentamos obtener desde el storage y luego desde el backend si es necesario
      const user = servicioAutenticacion.getCurrentUser();
      if (user) {
        // Intentar obtener información actualizada del backend si hay token
        const token = apiClient.getToken();
        if (token) {
          try {
            // Intentar obtener información del usuario desde el backend
            // Esto dependerá de cómo esté configurado tu backend
            // Por ahora retornamos el usuario del storage
            return user;
          } catch {
            // Si falla, retornar el usuario del storage
            return user;
          }
        }
        return user;
      }
      throw new Error('No hay usuario autenticado');
    } catch (error) {
      throw new Error('No hay usuario autenticado');
    }
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

