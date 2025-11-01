"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

interface UsuarioPerfil {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  ubicacion?: string;
  avatar?: string;
  biografia?: string;
  esVendedor: boolean;
  esComprador: boolean;
  fechaRegistro: string;
}

interface EncabezadoPerfilProps {
  usuario: UsuarioPerfil;
  esPropietario: boolean;
}

export default function ProfileHeader({ usuario, esPropietario }: EncabezadoPerfilProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [biografiaEditada, setBiografiaEditada] = useState(usuario.biografia || "");
  const { logout } = useAuth();

  const handleSaveBio = () => {
    // Lógica para guardar bio
    console.log("Guardando bio:", biografiaEditada);
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-red-700 rounded-2xl flex items-center justify-center relative">
            {usuario.avatar ? (
              <img 
                src={usuario.avatar} 
                alt={usuario.nombre} 
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <span className="text-white text-4xl font-bold">
                {usuario.nombre.charAt(0).toUpperCase()}
                {usuario.apellido.charAt(0).toUpperCase()}
              </span>
            )}
            {esPropietario && (
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Tipo de usuario */}
          {esPropietario && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  usuario.esVendedor ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {usuario.esVendedor ? '✓ Vendedor' : 'No Vendedor'}
                </span>
              </div>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  usuario.esComprador ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {usuario.esComprador ? '✓ Comprador' : 'No Comprador'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Información del usuario */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {usuario.nombre}
              </h1>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {usuario.apellido}
              </h1>
              <p className="text-gray-600 text-sm">
                Miembro desde {new Date(usuario.fechaRegistro).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            {esPropietario && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 border border-red-700 text-red-700 rounded-full font-semibold hover:bg-red-50 transition-colors text-sm"
                >
                  {isEditing ? 'Cancelar' : 'Editar Perfil'}
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-700 text-white rounded-full font-semibold hover:bg-red-800 transition-colors text-sm"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>

          {/* Bio */}
          {isEditing ? (
            <div className="mb-4">
              <textarea
                value={biografiaEditada}
                onChange={(e) => setBiografiaEditada(e.target.value)}
                placeholder="Escribe algo sobre ti..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={3}
              />
              <button
                onClick={handleSaveBio}
                className="mt-2 px-4 py-2 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800 transition-colors"
              >
                Guardar
              </button>
            </div>
          ) : (
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed">
                {usuario.biografia || "No hay biografía disponible"}
              </p>
            </div>
          )}

          {/* Información de contacto (solo visible para propietario o visitantes) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">{usuario.correo}</span>
            </div>
            
            {usuario.telefono && (
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm">{usuario.telefono}</span>
              </div>
            )}
            
            {usuario.ubicacion && (
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">{usuario.ubicacion}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {usuario.esVendedor ? "12" : "0"}
              </div>
              <div className="text-sm text-gray-600">Vehículos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {usuario.esVendedor ? "47" : "0"}
              </div>
              <div className="text-sm text-gray-600">Valoraciones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {usuario.esVendedor ? "4.8" : "0"}
              </div>
              <div className="text-sm text-gray-600">Promedio</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

