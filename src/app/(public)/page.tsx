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
  const [itemsPerSlide, setItemsPerSlide] = useState(1);

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

  useEffect(() => {
    const updateItemsPerSlide = () => {
      const width = window.innerWidth;
      if (width >= 1024) setItemsPerSlide(3);
      else if (width >= 640) setItemsPerSlide(2);
      else setItemsPerSlide(1);
    };

    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
    return () => window.removeEventListener('resize', updateItemsPerSlide);
  }, []);

  const totalSlides = Math.max(1, Math.ceil(vehicles.length / itemsPerSlide));

  // Autoscroll del carrusel (solo si hay vehículos)
  useEffect(() => {
    if (vehicles.length === 0 || totalSlides === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [totalSlides, vehicles.length]);

  useEffect(() => {
    setCurrentSlide((prev) => Math.min(prev, Math.max(0, totalSlides - 1)));
  }, [totalSlides, itemsPerSlide]);

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
    <main>
      {/* Hero */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/19248437/pexels-photo-19248437/free-photo-of-fila-transporte-estacionado-enfoque-selectivo.png?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/70 to-slate-900/40" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-2xl">
            <p className="section-label text-red-300 mb-4">Encuentra tu vehículo perfecto</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-5 leading-tight tracking-tight">
              En busca de tu vehículo ideal
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
              Descubre vehículos de calidad con subastas y compras directas seguras. Tu próximo auto te está esperando.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-w-lg">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                <p className="text-white font-medium mb-0.5">Subastas</p>
                <p className="text-sm text-slate-300">Ofertas exclusivas</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                <p className="text-white font-medium mb-0.5">Compra directa</p>
                <p className="text-sm text-slate-300">Transacciones seguras</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/catalogo" className="btn-primary px-7 py-3 text-center">
                Explorar catálogo
              </Link>
              <Link href="/Subastas" className="inline-flex items-center justify-center px-7 py-3 rounded-xl text-sm font-medium text-white border border-white/25 hover:bg-white/10 transition-colors text-center">
                Ver subastas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="section-muted py-14 sm:py-18 lg:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-14 max-w-2xl mx-auto">
            <p className="section-label mb-3">Guía rápida</p>
            <h2 className="page-title mb-3">¿Cómo funciona?</h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              Todo lo que necesitas para usar la plataforma con confianza
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="surface-card p-6 sm:p-7 border-l-4 border-l-red-500">
              <div className="w-11 h-11 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">Aprende a pujar</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
                Estrategias para participar en subastas y conseguir las mejores ofertas del mercado.
              </p>
              <button type="button" className="btn-ghost text-red-600 dark:text-red-400 px-0 hover:bg-transparent">
                Ver tutorial →
              </button>
            </div>

            <div className="surface-card p-6 sm:p-7">
              <div className="w-11 h-11 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">Vende tu vehículo</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
                Publica tu auto y conecta con compradores verificados de forma simple y transparente.
              </p>
              <button type="button" className="btn-ghost text-red-600 dark:text-red-400 px-0 hover:bg-transparent">
                Ver tutorial →
              </button>
            </div>

            <div className="surface-card p-6 sm:p-7">
              <div className="w-11 h-11 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">Busca tu auto ideal</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
                Filtros avanzados para encontrar exactamente el vehículo que necesitas.
              </p>
              <button type="button" className="btn-ghost text-red-600 dark:text-red-400 px-0 hover:bg-transparent">
                Ver tutorial →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Vehículos destacados */}
      <section className="py-14 sm:py-18 lg:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
            <p className="section-label mb-3">Selección especial</p>
            <h2 className="page-title mb-3">Vehículos destacados</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Los más populares y mejor valorados por nuestra comunidad
            </p>
          </div>

          <div className="relative max-w-7xl mx-auto px-8 sm:px-10 lg:px-0">
            <button
              onClick={prevSlide}
              className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-10 surface-card w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:shadow-md transition-all"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-10 surface-card w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:shadow-md transition-all"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Contenedor del carrusel */}
            <div className="overflow-hidden">
              {cargando ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Cargando vehículos destacados...</p>
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
                  <p className="text-gray-600 dark:text-gray-300">No hay vehículos disponibles en este momento</p>
                </div>
              ) : (
                <div className="flex transition-transform duration-500 ease-in-out">
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {getCurrentVehicles().map((vehicle) => (
                      <div key={vehicle.id} className="surface-card-hover overflow-hidden group">
                        <div className="relative h-44 bg-gray-100 dark:bg-slate-700/50 overflow-hidden">
                          <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 px-2.5 py-1 rounded-lg text-xs font-medium z-10">
                            {vehicle.badge}
                          </div>
                          {vehicle.foto_principal ? (
                            <img
                              src={vehicle.foto_principal}
                              alt={vehicle.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const placeholder = target.nextElementSibling as HTMLElement;
                                if (placeholder) placeholder.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`absolute inset-0 flex items-center justify-center ${vehicle.foto_principal ? 'hidden' : ''}`}>
                            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">{vehicle.name} · {vehicle.year}</h3>
                          <p className="text-lg font-semibold text-red-600 dark:text-red-400 mb-1">{vehicle.price}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 truncate">{vehicle.ubicacion}</p>
                          <Link href={`/catalogo/${vehicle.id}`} className="btn-primary w-full text-center">
                            Ver detalles
                          </Link>
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
                    className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                        ? 'w-6 bg-red-500'
                        : 'w-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-10">
            <Link href="/catalogo" className="btn-primary px-8 py-3 text-base">
              Explorar catálogo completo
            </Link>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-3">Más de 100 vehículos disponibles</p>
          </div>
        </div>
      </section>
    </main>
  );
}
