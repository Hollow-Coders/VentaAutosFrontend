"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Venta } from "../../api/sales";
import { VehiculoDetalle } from "../../api/vehicles";
import type { VehiculoFoto } from "../../api/vehiclePhotos";
import FormularioValoracion from "../valoracion/FormularioValoracion";

interface PurchaseCardProps {
  venta: Venta;
  vehiculo: VehiculoDetalle;
  vendedorNombre?: string;
  yaValorado?: boolean;
}

export default function TarjetaCompra({ venta, vehiculo, vendedorNombre, yaValorado: yaValoradoProp = false }: PurchaseCardProps) {
  const [mostrarFormularioValoracion, setMostrarFormularioValoracion] = useState(false);
  const [yaValorado, setYaValorado] = useState(yaValoradoProp);

  // Sincronizar el estado interno con la prop cuando cambie
  useEffect(() => {
    setYaValorado(yaValoradoProp);
  }, [yaValoradoProp]);
  const formatearPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(precio);
  };

  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { texto: string; color: string }> = {
      pendiente: { texto: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
      completada: { texto: 'Completada', color: 'bg-green-100 text-green-800' },
      cancelada: { texto: 'Cancelada', color: 'bg-red-100 text-red-800' },
    };
    return estados[estado] || { texto: estado, color: 'bg-gray-100 text-gray-800' };
  };

  const fotoPrincipal = Array.isArray(vehiculo.fotos) && vehiculo.fotos.length > 0
    ? (typeof vehiculo.fotos[0] === 'string' 
        ? vehiculo.fotos[0] 
        : (vehiculo.fotos[0] as VehiculoFoto).url_imagen_url ?? (vehiculo.fotos[0] as VehiculoFoto).url_imagen ?? null)
    : null;

  const estadoBadge = getEstadoBadge(venta.estado);

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Imagen del vehículo */}
      <div className="h-48 bg-gray-200 flex items-center justify-center relative">
        {fotoPrincipal ? (
          <img
            src={fotoPrincipal}
            alt={`${vehiculo.marca_nombre} ${vehiculo.modelo_nombre}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        )}
        {/* Badge de estado */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoBadge.color}`}>
            {estadoBadge.texto}
          </span>
        </div>
      </div>

      {/* Contenido de la carta */}
      <div className="p-5">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            {vehiculo.marca_nombre} {vehiculo.modelo_nombre} {vehiculo.año}
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            Vendedor: {vendedorNombre || vehiculo.usuario_nombre || 'N/A'}
          </p>
        </div>

        {/* Información de la venta */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Precio de compra:</span>
            <span className="text-lg font-bold text-red-600">
              {formatearPrecio(venta.precio_final)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Método de pago:</span>
            <span className="text-sm font-medium text-gray-800 capitalize">
              {venta.metodo_pago}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Fecha de compra:</span>
            <span className="text-sm text-gray-800">
              {formatearFecha(venta.fecha_venta)}
            </span>
          </div>
        </div>

        {/* Información adicional del vehículo */}
        <div className="border-t border-gray-200 pt-3 mb-4">
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <span className="font-medium">Kilometraje:</span> {vehiculo.kilometraje ? `${vehiculo.kilometraje.toLocaleString()} km` : 'N/A'}
            </div>
            <div>
              <span className="font-medium">Transmisión:</span> {vehiculo.tipo_transmision}
            </div>
            <div>
              <span className="font-medium">Combustible:</span> {vehiculo.tipo_combustible}
            </div>
            <div>
              <span className="font-medium">Ubicación:</span> {vehiculo.ubicacion}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Link
              href={`/vehiculo/${vehiculo.id}`}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm font-medium"
            >
              Ver Vehículo
            </Link>
            <Link
              href={`/chat?comprador=${venta.comprador}&vendedor=${vehiculo.usuario}&vehiculo=${vehiculo.id}`}
              className="flex-1 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors text-center text-sm font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chatear con Vendedor
            </Link>
          </div>
          
          {/* Botón de valoración mejorado */}
          {!yaValorado && (
            <button
              onClick={() => setMostrarFormularioValoracion(true)}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all text-center text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Valorar Compra
            </button>
          )}
          
          {yaValorado && (
            <div className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Ya valoraste esta compra
            </div>
          )}
        </div>
      </div>

      {/* Modal de valoración */}
      {mostrarFormularioValoracion && (
        <FormularioValoracion
          ventaId={venta.id}
          vehiculoNombre={`${vehiculo.marca_nombre} ${vehiculo.modelo_nombre} ${vehiculo.año}`}
          vendedorNombre={vendedorNombre || vehiculo.usuario_nombre || "Vendedor"}
          onSuccess={() => {
            setMostrarFormularioValoracion(false);
            setYaValorado(true);
          }}
          onCancel={() => setMostrarFormularioValoracion(false)}
        />
      )}
    </div>
  );
}

