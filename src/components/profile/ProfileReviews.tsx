"use client";

interface Resena {
  id: string;
  revisor: {
    nombre: string;
    avatar?: string;
  };
  calificacion: number;
  comentario: string;
  fecha: string;
}

interface ResenasPerfilProps {
  resenas: Resena[];
}

export default function ProfileReviews({ resenas }: ResenasPerfilProps) {
  const promedioCalificacion = resenas.length > 0
    ? (resenas.reduce((suma, resena) => suma + resena.calificacion, 0) / resenas.length).toFixed(1)
    : "0.0";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Valoraciones
          </h2>
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(Number(promedioCalificacion))
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600 text-sm">
              {promedioCalificacion} de {resenas.length} valoración{resenas.length !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Lista de reviews */}
      {resenas.length === 0 ? (
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
          {resenas.map((resena) => (
            <div key={resena.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
              <div className="flex gap-4">
                {/* Avatar del reviewer */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center">
                    {resena.revisor.avatar ? (
                      <img 
                        src={resena.revisor.avatar} 
                        alt={resena.revisor.nombre}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-white text-sm font-semibold">
                        {resena.revisor.nombre.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contenido del review */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {resena.revisor.nombre}
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < resena.calificacion
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {new Date(resena.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {resena.comentario}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

