import { CONFIG_API, ApiError } from './config';

// Cliente HTTP para hacer peticiones a la API
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = CONFIG_API.baseURL;
  }

  // Método genérico para hacer peticiones
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const config: RequestInit = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      };

      // Agregar token de autenticación si existe
      const token = this.getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const response = await fetch(url, config);
      
      // Parsear JSON de la respuesta
      let data;
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        // Si no es JSON válido, lanzar error con el texto
        throw new ApiError(
          `Respuesta no válida del servidor: ${text.substring(0, 100)}`,
          response.status,
          { raw: text }
        );
      }
      
      // Manejar errores HTTP (códigos fuera de 200-299)
      if (!response.ok) {
        // Django REST Framework devuelve errores de validación en diferentes formatos
        let errorMessage = `Error en la petición (${response.status})`;
        
        if (data) {
          // Si hay un mensaje directo
          if (data.message) {
            errorMessage = data.message;
          } else if (data.error) {
            errorMessage = data.error;
          } else if (data.detail) {
            errorMessage = data.detail;
          } else if (typeof data === 'string') {
            errorMessage = data;
          } else if (typeof data === 'object') {
            // Django puede devolver errores de validación como objeto
            // Ejemplo: { nombre: ['Este campo es requerido'], correo: ['Email inválido'] }
            const validationErrors = Object.entries(data)
              .map(([field, errors]) => {
                const errorList = Array.isArray(errors) ? errors.join(', ') : errors;
                return `${field}: ${errorList}`;
              })
              .join('; ');
            
            if (validationErrors) {
              errorMessage = validationErrors;
            }
          }
        }
        
        throw new ApiError(
          errorMessage,
          response.status,
          data
        );
      }

      // Respuesta exitosa - manejar diferentes formatos:
      // 1. { success: true, data: T }
      // 2. { user: ..., token: ... } (directo de DRF)
      // 3. T directamente
      if (data && typeof data === 'object') {
        if ('success' in data && 'data' in data && data.success) {
          // Formato con success y data
          return data.data as T;
        }
        // Formato directo (DRF común) - retornar todo el objeto
        return data as T;
      }
      
      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Error de conexión con el servidor');
    }
  }

  // GET request
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // PUT request
  async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // POST request con FormData (para subir archivos)
  async postFormData<T>(endpoint: string, formData: FormData, options?: RequestInit): Promise<T> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const config: RequestInit = {
        ...options,
        method: 'POST',
        body: formData,
        headers: {
          // NO establecer Content-Type para FormData, el navegador lo hará automáticamente con el boundary correcto
          ...options?.headers,
        },
      };

      // Agregar token de autenticación si existe
      const token = this.getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const response = await fetch(url, config);
      
      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new ApiError(
          `Respuesta no válida del servidor: ${text.substring(0, 100)}`,
          response.status,
          { raw: text }
        );
      }
      
      if (!response.ok) {
        let errorMessage = `Error en la petición (${response.status})`;
        if (data.error) {
          errorMessage = data.error;
        } else if (data.detail) {
          errorMessage = data.detail;
        }
        throw new ApiError(errorMessage, response.status, data);
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Error de conexión con el servidor');
    }
  }

  // PATCH request con FormData (para actualizar con archivos)
  async patchFormData<T>(endpoint: string, formData: FormData, options?: RequestInit): Promise<T> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const config: RequestInit = {
        ...options,
        method: 'PATCH',
        body: formData,
        headers: {
          ...options?.headers,
        },
      };

      // Agregar token de autenticación si existe
      const token = this.getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const response = await fetch(url, config);
      
      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new ApiError(
          `Respuesta no válida del servidor: ${text.substring(0, 100)}`,
          response.status,
          { raw: text }
        );
      }
      
      if (!response.ok) {
        let errorMessage = `Error en la petición (${response.status})`;
        if (data.error) {
          errorMessage = data.error;
        } else if (data.detail) {
          errorMessage = data.detail;
        }
        throw new ApiError(errorMessage, response.status, data);
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Error de conexión con el servidor');
    }
  }

  // Guardar token en localStorage
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  // Obtener token de localStorage
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  // Eliminar token de localStorage
  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
}

// Exportar instancia única del cliente
export const apiClient = new ApiClient();

