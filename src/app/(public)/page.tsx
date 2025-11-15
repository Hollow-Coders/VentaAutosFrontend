"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { servicioVehiculo } from '@/api/vehicles';

interface VehicleCarousel {
  id: number;
  name: string;
  year: number;
  price: string;
  category: string;
  badge: string;
  badgeColor: string;
  foto_principal?: string | null;
  ubicacion: string;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [vehicles, setVehicles] = useState<VehicleCarousel[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para mezclar aleatoriamente un array
  const mezclarArray = <T,>(array: T[]): T[] => {
    const arrayMezclado = [...array];
    for (let i = arrayMezclado.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayMezclado[i], arrayMezclado[j]] = [arrayMezclado[j], arrayMezclado[i]];
    }
    return arrayMezclado;
  };

  // Cargar vehículos desde la API
  useEffect(() => {
    const cargarVehiculos = async () => {
      setCargando(true);
      setError(null);
      try {
        const vehiculosData = await servicioVehiculo.getAll();
        // Mezclar aleatoriamente y limitar a 9 vehículos para el carrusel
        const vehiculosMezclados = mezclarArray(vehiculosData);
        const vehiculosLimitados = vehiculosMezclados.slice(0, 9);
        
        // Transformar los datos de la API al formato del carrusel
        const vehiculosTransformados: VehicleCarousel[] = vehiculosLimitados.map((vehiculo, index) => {
          // Formatear precio
          const precioFormateado = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(vehiculo.precio);

          // Determinar badge y color según el índice o precio
          const badges = [
            { badge: "POPULAR", color: "bg-red-700" },
            { badge: "NUEVO", color: "bg-green-500" },
            { badge: "OFERTA", color: "bg-orange-500" },
            { badge: "PREMIUM", color: "bg-blue-500" },
            { badge: "ECONÓMICO", color: "bg-purple-500" },
            { badge: "ICÓNICO", color: "bg-yellow-500" },
            { badge: "LUXURY", color: "bg-indigo-500" },
            { badge: "SUPER", color: "bg-pink-500" },
            { badge: "ELEGANTE", color: "bg-teal-500" }
          ];

          const badgeInfo = badges[index % badges.length];

          return {
            id: vehiculo.id,
            name: `${vehiculo.marca_nombre} ${vehiculo.modelo_nombre}`,
            year: vehiculo.año,
            price: precioFormateado,
            category: "VEHÍCULO", // Puedes ajustar esto según tu lógica
            badge: badgeInfo.badge,
            badgeColor: badgeInfo.color,
            foto_principal: vehiculo.foto_principal,
            ubicacion: vehiculo.ubicacion,
          };
        });

        setVehicles(vehiculosTransformados);
      } catch (err) {
        console.error('Error cargando vehículos:', err);
        setError('Error al cargar los vehículos destacados');
        // En caso de error, mantener un array vacío
        setVehicles([]);
      } finally {
        setCargando(false);
      }
    };

    cargarVehiculos();
  }, []);

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(vehicles.length / itemsPerSlide);

  // Autoscroll del carrusel (solo si hay vehículos)
  useEffect(() => {
    if (vehicles.length === 0 || totalSlides === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [totalSlides, vehicles.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Función para los vehículos de la slide actual
  const getCurrentVehicles = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return vehicles.slice(startIndex, startIndex + itemsPerSlide);
  };

  return (
    <main className="bg-white">
      <section className="py-20 px-4 relative bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('https://images.pexels.com/photos/19248437/pexels-photo-19248437/free-photo-of-fila-transporte-estacionado-enfoque-selectivo.png?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1')"}}>
        <div className="absolute inset-0 bg-opacity-30" style={{backdropFilter: 'blur(2px)'}}></div>
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Información de la iziquierda texto y botones */}
            <div>
              <div className="inline-block bg-red-700 text-white px-4 py-2 rounded-2xl text-sm font-semibold mb-6">
                ENCUENTRA TU VEHÍCULO PERFECTO
              </div>
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                En busca de tu vehículo ideal
              </h1>
              <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                Descubre una amplia selección de vehículos de calidad, desde subastas profesionales hasta compras directas seguras. Su próximo vehículo le está esperando.
              </p>

              {/* Mini tarjetas de subasta y compra directa */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <div className="w-12 h-12 bg-red-700 rounded-lg flex items-center justify-center mb-3">
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Subastas</h3>
                  <p className="text-sm text-gray-600">Ofertas exclusivas</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-3">
                    <div className="w-6 h-6 bg-white rounded"></div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Compras directas</h3>
                  <p className="text-sm text-gray-600">Transacciones seguras</p>
                </div>
              </div>

              {/* Botones subasta y catalogo */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/catalogo" className="bg-red-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-800 transition-colors text-center">
                  EXPLORAR CATÁLOGO
                </Link>
                <Link href="/Subastas" className="border-2 border-red-700 text-red-700 px-8 py-4 rounded-full font-semibold hover:bg-red-700 hover:text-white transition-colors text-center">
                  VER SUBASTAS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seccion de tutoriales para el usuario */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿CÓMO FUNCIONA?
            </h2>
            <div className="w-16 h-1 bg-red-700 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Aprende todo lo que necesitas saber para usar nuestra plataforma de manera efectiva
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Carta 1 de aprender a como pujar en la subasta  */}
            <div className="bg-red-700 rounded-3xl p-8 text-white">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Aprende a pujar en nuestras subastas</h3>
              <p className="text-red-100 mb-6 leading-relaxed">
                Aprenda las estrategias profesionales para participar exitosamente en nuestras subastas de vehículos y obtener las mejores ofertas del mercado.
              </p>
              <button className="flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 rounded-full px-6 py-3 transition-colors">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-red-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span>Ver tutorial</span>
              </button>
            </div>

            {/* Carta 2 de como vender un vehiculo */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Vende tu vehículo</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Publique su vehículo y conéctese con compradores verificados. Proceso simple, seguro y completamente transparente.
              </p>
              <button className="flex items-center justify-center space-x-2 border border-red-700 text-red-700 hover:bg-red-700 hover:text-white rounded-full px-6 py-3 transition-colors">
                <div className="w-6 h-6 border-2 border-red-700 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span>Ver tutorial</span>
              </button>
            </div>

            {/* Carta 3 de como buscar un vehiculo en el catalogo */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Busca tu auto ideal</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Utilice nuestros filtros avanzados y herramientas de búsqueda para encontrar exactamente el vehículo que necesita.
              </p>
              <button className="flex items-center justify-center space-x-2 border border-red-700 text-red-700 hover:bg-red-700 hover:text-white rounded-full px-6 py-3 transition-colors">
                <div className="w-6 h-6 border-2 border-red-700 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span>Ver tutorial</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Vehículos Destacados - Carrusel Sencillo */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              VEHÍCULOS DESTACADOS
            </h2>
            <div className="w-16 h-1 bg-red-700 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Descubre nuestra selección de vehículos más populares y mejor valorados por nuestros usuarios
            </p>
          </div>

          {/* Carrusel */}
          <div className="relative max-w-7xl mx-auto">
            {/* Botones de navegación */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-red-50 border border-gray-200"
            >
              <svg className="w-6 h-6 text-gray-600 hover:text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-red-50 border border-gray-200"
            >
              <svg className="w-6 h-6 text-gray-600 hover:text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Contenedor del carrusel */}
            <div className="overflow-hidden">
              {cargando ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando vehículos destacados...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-red-700 text-white px-6 py-2 rounded-full hover:bg-red-800 transition-colors"
                    >
                      Reintentar
                    </button>
                  </div>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                  <p className="text-gray-600">No hay vehículos disponibles en este momento</p>
                </div>
              ) : (
                <div className="flex transition-transform duration-500 ease-in-out">
                  <div className="w-full grid grid-cols-3 gap-8">
                    {getCurrentVehicles().map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                      >
                        <div className="relative h-48 bg-gradient-to-br from-red-100 to-red-200 overflow-hidden">
                          <div className={`absolute top-4 left-4 ${vehicle.badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold z-10`}>
                            {vehicle.badge}
                          </div>
                          {vehicle.foto_principal ? (
                            <img
                              src={vehicle.foto_principal}
                              alt={vehicle.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Si la imagen falla, mostrar el placeholder
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const placeholder = target.nextElementSibling as HTMLElement;
                                if (placeholder) placeholder.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`absolute inset-0 flex items-center justify-center ${vehicle.foto_principal ? 'hidden' : ''}`}>
                            <div className="w-32 h-20 bg-gradient-to-br from-red-300 to-red-400 rounded-xl flex items-center justify-center">
                              <svg className="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="text-sm text-red-600 font-semibold mb-2">{vehicle.category}</div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{vehicle.name} | {vehicle.year}</h3>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-2xl font-bold text-gray-900">{vehicle.price}</span>
                            <span className="text-sm text-gray-500">{vehicle.ubicacion}</span>
                          </div>
                          <div className="space-y-2">
                            <Link
                              href={`/catalogo/${vehicle.id}`}
                              className="block w-full text-center bg-white border border-red-700 text-red-700 hover:bg-red-700 hover:text-white rounded-full px-4 py-2 font-medium transition-colors"
                            >
                              Ver detalles
                            </Link>
                            <Link
                              href={`/catalogo/${vehicle.id}`}
                              className="block w-full text-center bg-red-700 text-white hover:bg-red-800 rounded-full px-4 py-2 font-medium transition-colors"
                            >
                              Comprar ahora
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Indicadores */}
            {!cargando && !error && vehicles.length > 0 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                        ? 'bg-red-700 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link href="/catalogo" className="inline-block bg-red-700 text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-red-800 transition-colors">
              EXPLORAR CATÁLOGO COMPLETO
            </Link>
            <p className="text-gray-500 mt-4">Más de 100+ vehículos disponibles</p>
          </div>
        </div>
      </section>
    </main>
  );
}
