"use client";

import { useState } from "react";
import Link from "next/link";
import VehicleCard from "../vehicle/VehicleCard";

interface Vehicle {
  id: string;
  name: string;
  year: string;
  price: string;
  image?: string;
  location?: string;
  category?: string;
  mileage?: string;
  transmission?: string;
  fuel?: string;
  status: 'active' | 'sold' | 'pending';
}

interface ProfileVehiclesProps {
  vehicles: Vehicle[];
  isOwner: boolean;
}

export default function ProfileVehicles({ vehicles, isOwner }: ProfileVehiclesProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'sold' | 'pending'>('all');

  const filteredVehicles = vehicles.filter(vehicle => {
    if (filter === 'all') return true;
    return vehicle.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { text: 'Activo', color: 'bg-green-100 text-green-700' },
      sold: { text: 'Vendido', color: 'bg-gray-100 text-gray-600' },
      pending: { text: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' }
    };
    return badges[status as keyof typeof badges] || badges.active;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      {/* Header con filtros y botones */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isOwner ? 'Mis Vehículos' : 'Vehículos de este vendedor'}
          </h2>
          <p className="text-gray-600 text-sm">
            {filteredVehicles.length} vehículo{filteredVehicles.length !== 1 ? 's' : ''} {filter !== 'all' ? filter : ''}
          </p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap mt-4 md:mt-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
              filter === 'all' 
                ? 'bg-red-700 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
              filter === 'active' 
                ? 'bg-red-700 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Activos
          </button>
          <button
            onClick={() => setFilter('sold')}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
              filter === 'sold' 
                ? 'bg-red-700 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Vendidos
          </button>
          {isOwner && (
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                filter === 'pending' 
                  ? 'bg-red-700 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Pendientes
            </button>
          )}
        </div>

        {/* Botón para agregar vehículo (solo propietario) */}
        {isOwner && (
          <div className="mt-4 md:mt-0">
            <Link
              href="/nuevo-vehiculo"
              className="inline-flex items-center px-6 py-3 bg-red-700 text-white rounded-full font-semibold hover:bg-red-800 transition-colors text-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar Vehículo
            </Link>
          </div>
        )}
      </div>

      {/* Grid de vehículos */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-semibold mb-2">
            {isOwner ? 'No tienes vehículos' : 'Este vendedor no tiene vehículos'}
          </p>
          <p className="text-gray-500 text-sm">
            {isOwner ? 'Comienza agregando tu primer vehículo' : 'Intenta con otro vendedor'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="relative">
              {/* Badge de estado */}
              <div className="absolute top-3 left-3 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(vehicle.status).color}`}>
                  {getStatusBadge(vehicle.status).text}
                </span>
              </div>
              {/* Usar VehicleCard con datos extendidos */}
              <VehicleCard vehicle={{
                id: vehicle.id,
                name: vehicle.name,
                year: vehicle.year,
                price: vehicle.price,
                location: vehicle.location,
                image: vehicle.image,
                category: vehicle.category,
                mileage: vehicle.mileage,
                transmission: vehicle.transmission,
                fuel: vehicle.fuel
              }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
