import { apiClient } from './client';

// Tipo de vehículo según CatalogoSerializer del backend (vista lista)
export interface Vehiculo {
  id: number;
  nombre: string; // Formato: "Marca Modelo Año"
  marca_nombre: string;
  modelo_nombre: string;
  año: number;
  precio: number;
  ubicacion: string;
}

// Tipo de vehículo completo según VehiculoSerializer del backend (vista detalle)
export interface VehiculoDetalle {
  id: number;
  usuario: number;
  usuario_nombre: string;
  marca: number;
  marca_nombre: string;
  modelo: number;
  modelo_nombre: string;
  año: number;
  precio: number;
  ubicacion: string;
  tipo_transmision: string;
  tipo_combustible: string;
  kilometraje?: number;
  descripcion?: string;
  estado: string;
  fecha_publicacion: string;
  fotos: string[]; // URLs de las fotos
  total_documentos: number;
}

// Parámetros de filtro según CatalogoViewSet
export interface FiltrosCatalogo {
  marca?: string;
  modelo?: string;
  año_min?: number;
  año_max?: number;
  precio_min?: number;
  precio_max?: number;
  ubicacion?: string;
}

// Servicios de catálogo
export const servicioVehiculo = {
  // Obtener todos los vehículos del catálogo (solo disponibles)
  async getAll(filters?: FiltrosCatalogo): Promise<Vehiculo[]> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.marca) params.append('marca', filters.marca);
      if (filters.modelo) params.append('modelo', filters.modelo);
      if (filters.año_min) params.append('año_min', String(filters.año_min));
      if (filters.año_max) params.append('año_max', String(filters.año_max));
      if (filters.precio_min) params.append('precio_min', String(filters.precio_min));
      if (filters.precio_max) params.append('precio_max', String(filters.precio_max));
      if (filters.ubicacion) params.append('ubicacion', filters.ubicacion);
    }
    const queryString = params.toString();
    const endpoint = queryString ? `/catalogo/?${queryString}` : '/catalogo/';
    return await apiClient.get<Vehiculo[]>(endpoint);
  },

  // Obtener un vehículo por ID con toda la información (usar endpoint /vehiculos/)
  async getById(id: number): Promise<VehiculoDetalle> {
    return await apiClient.get<VehiculoDetalle>(`/vehiculos/${id}/`);
  },

  // Búsqueda en el catálogo (endpoint /buscar/)
  async search(query: string): Promise<Vehiculo[]> {
    if (!query || query.trim() === '') {
      throw new Error('Parámetro de búsqueda "q" es requerido');
    }
    return await apiClient.get<Vehiculo[]>(`/catalogo/buscar/?q=${encodeURIComponent(query)}`);
  },
};

