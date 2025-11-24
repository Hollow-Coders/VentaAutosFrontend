"use client";

import { Valoracion, PromedioVendedor } from "../../api/ratings";

interface ProfileReviewsProps {
  valoraciones: Valoracion[];
  promedio: PromedioVendedor | null;
  cargando?: boolean;
  totalValoraciones?: number;
  mostrarTodas?: boolean;
  onVerMas?: () => void;
}

export default function ProfileReviews({ 
  valoraciones, 
  promedio, 
  cargando = false,
  totalValoraciones: totalValoracionesProp,
  mostrarTodas = false,
  onVerMas
}: ProfileReviewsProps) {
  // Asegurar que valoraciones siempre sea un array
  const valoracionesArray = Array.isArray(valoraciones) ? valoraciones : [];
  
  // Usar el promedio del backend si está disponible, sino calcularlo
  const promedioCalificacion = promedio?.promedio_calificacion ?? 
    (valoracionesArray.length > 0
      ? valoracionesArray.reduce((sum, val) => sum + parseFloat(val.calificacion), 0) / valoracionesArray.length
      : 0);
  
  // Usar el total de valoraciones del prop si está disponible, sino del promedio o del array
  const totalValoraciones = totalValoracionesProp ?? promedio?.total_valoraciones ?? valoracionesArray.length;
  
  // Determinar si hay más valoraciones para mostrar
  const hayMasValoraciones = totalValoraciones > valoracionesArray.length;
  
  // Función para renderizar estrellas
  const renderEstrellas = (calificacion: number, tamaño: 'sm' | 'md' | 'lg' = 'md') => {
    const tamañoClase = tamaño === 'sm' ? 'w-4 h-4' : tamaño === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
    const calificacionNum = Math.round(calificacion);
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`${tamañoClase} ${
              i < calificacionNum
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (cargando) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Valoraciones
          </h2>
          <div className="flex items-center gap-3">
            {renderEstrellas(promedioCalificacion, 'lg')}
            <div className="flex flex-col">
              <span className="text-gray-900 text-lg font-semibold">
                {promedioCalificacion.toFixed(1)}
              </span>
              <span className="text-gray-600 text-sm">
                {totalValoraciones} valoración{totalValoraciones !== 1 ? 'es' : ''}
              </span>
            </div>
          </div>
        </div>
        {!mostrarTodas && hayMasValoraciones && onVerMas && (
          <button
            onClick={onVerMas}
            className="px-4 py-2 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 transition-colors text-sm whitespace-nowrap ml-4"
          >
            Ver más valoraciones
          </button>
        )}
      </div>

      {/* Lista de reviews */}
      {valoracionesArray.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-semibold mb-2">
            Aún no hay valoraciones
          </p>
          <p className="text-gray-500 text-sm">
            Las valoraciones aparecerán cuando recibas tu primera transacción
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {valoracionesArray.map((valoracion) => {
            const calificacionNum = parseFloat(valoracion.calificacion);
            const fechaCreacion = new Date(valoracion.fecha_creacion);
            
            return (
              <div key={valoracion.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                <div className="flex gap-4">
                  {/* Avatar del comprador */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {valoracion.comprador_nombre.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Contenido de la valoración */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {valoracion.comprador_nombre}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {renderEstrellas(calificacionNum, 'sm')}
                          <span className="text-gray-500 text-xs">
                            {valoracion.vehiculo_info.marca} {valoracion.vehiculo_info.modelo} {valoracion.vehiculo_info.año}
                          </span>
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {fechaCreacion.toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    {valoracion.comentario && (
                      <p className="text-gray-600 text-sm leading-relaxed mt-2">
                        {valoracion.comentario}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

