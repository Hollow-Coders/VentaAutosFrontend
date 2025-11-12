// Exportar configuración y tipos
export * from './config';

// Exportar cliente
export { apiClient } from './client';

// Exportar servicios y tipos
export * from './auth';
export * from './vehicles';
export * from './bids';
export * from './auctions';
export * from './sales';
export * from './brands';
export * from './models';
export * from './profile';
export * from './vehiclePhotos';

// Re-exportar servicios con nombres específicos para fácil acceso (mantener compatibilidad)
export { servicioAutenticacion as authService } from './auth';
export { servicioVehiculo as vehicleService } from './vehicles';
export { servicioPuja as bidService } from './bids';
export { servicioSubasta as auctionService } from './auctions';
export { servicioVenta as saleService } from './sales';
export { servicioMarca as brandService } from './brands';
export { servicioModelo as modelService } from './models';
export { servicioPerfil as profileService } from './profile';
export { servicioVehiculoFoto as vehiclePhotoService } from './vehiclePhotos';

// También exportar con nombres en español
export { servicioAutenticacion } from './auth';
export { servicioVehiculo } from './vehicles';
export { servicioPuja } from './bids';
export { servicioSubasta } from './auctions';
export { servicioVenta } from './sales';
export { servicioMarca } from './brands';
export { servicioModelo } from './models';
export { servicioPerfil } from './profile';
export { servicioVehiculoFoto } from './vehiclePhotos';

