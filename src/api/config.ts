// Configuración de la API
export const CONFIG_API = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/venta',
  timeout: 10000,
};

// Tipos de respuesta comunes
export interface RespuestaApi<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Clase de error personalizada para la API
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

