import { apiClient } from './client';
import type { VehiculoFoto } from './vehiclePhotos';

// Tipo de vehículo según CatalogoSerializer del backend (vista lista)
export interface Vehiculo {
  id: number;
  nombre: string; // Formato: "Marca Modelo Año"
  marca_nombre: string;
  modelo_nombre: string;
  año: number;
  precio: number;
  ubicacion: string;
  foto_principal?: string | null;
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
  tipo_vehiculo: string;
  kilometraje?: number;
  descripcion?: string;
  estado: string;
  fecha_publicacion: string;
  fotos: Array<string | VehiculoFoto>;
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
      const filtroMap: Record<string, string | number | undefined> = {
        marca: filters.marca,
        modelo: filters.modelo,
        año_min: filters.año_min,
        año_max: filters.año_max,
        precio_min: filters.precio_min,
        precio_max: filters.precio_max,
        ubicacion: filters.ubicacion,
      };

      for (const [clave, valor] of Object.entries(filtroMap)) {
        if (valor !== undefined && valor !== null && valor !== '') {
          params.append(clave, String(valor));
        }
      }
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

  // Obtener vehículos por usuario (usando endpoint /vehiculos/)
  async getByUsuario(usuarioId: number): Promise<VehiculoDetalle[]> {
    return await apiClient.get<VehiculoDetalle[]>(`/vehiculos/?usuario=${usuarioId}`);
  },
};

// Solicitud para crear un vehículo
export interface SolicitudVehiculo {
  usuario: number;
  marca: number;
  modelo: number;
  año: number;
  precio: number;
  tipo_transmision: string;
  tipo_combustible: string;
  kilometraje?: number;
  descripcion?: string;
  estado: string;
  tipo_vehiculo: string;
  ubicacion: string;
}

// Servicios de vehículos (creación y gestión)
export const servicioCreacionVehiculo = {
  // Crear un nuevo vehículo
  async create(data: SolicitudVehiculo): Promise<VehiculoDetalle> {
    return await apiClient.post<VehiculoDetalle>('/vehiculos/', data);
  },
};