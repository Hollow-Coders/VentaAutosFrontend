"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import BidButton from "@/components/vehicle/BidButton";
import BuyButton from "@/components/vehicle/BuyButton";

// Datos mock del vehículo (en producción vendrían de una API)
const mockVehicles = {
  "veh-1": {
    id: "veh-1",
    name: "Chevrolet Camaro SS",
    year: "2022",
    price: "$890,000 MXN",
    location: "Tijuana, B.C.",
    description: "Potente motor V8 con diseño icónico y excelente desempeño deportivo. Vehículo en excelente estado, con todos los servicios al día.",
    mileage: "25,000 km",
    transmission: "Automática",
    fuel: "Gasolina",
    color: "Rojo",
    category: "DEPORTIVO",
    badge: "NUEVO",
    badgeColor: "bg-green-500"
  },
  "veh-2": {
    id: "veh-2",
    name: "Toyota Supra",
    year: "2021",
    price: "$1,200,000 MXN",
    location: "Tijuana, B.C.",
    description: "Deportivo japonés clásico, en perfecto estado. Motor turbocargado con excelente potencia y maniobrabilidad.",
    mileage: "18,000 km",
    transmission: "Automática",
    fuel: "Gasolina",
    color: "Blanco",
    category: "DEPORTIVO",
    badge: "PREMIUM",
    badgeColor: "bg-purple-500"
  },
  "veh-3": {
    id: "veh-3",
    name: "BMW M3",
    year: "2020",
    price: "$950,000 MXN",
    location: "Tijuana, B.C.",
    description: "Sedán deportivo alemán con todas las comodidades. Interiores de lujo y equipamiento completo.",
    mileage: "30,000 km",
    transmission: "Automática",
    fuel: "Gasolina",
    color: "Negro",
    category: "SEDÁN",
    badge: "USADO",
    badgeColor: "bg-orange-500"
  },
  "veh-4": {
    id: "veh-4",
    name: "Ford Mustang",
    year: "2023",
    price: "$650,000 MXN",
    location: "Tijuana, B.C.",
    description: "Clásico americano, motor V8 potente. Ideal para los amantes de la velocidad.",
    mileage: "5,000 km",
    transmission: "Manual",
    fuel: "Gasolina",
    color: "Amarillo",
    category: "MUSCLE CAR",
    badge: "NUEVO",
    badgeColor: "bg-green-500"
  },
  "veh-5": {
    id: "veh-5",
    name: "Nissan GT-R",
    year: "2021",
    price: "$1,450,000 MXN",
    location: "Tijuana, B.C.",
    description: "Súper deportivo japonés, la máquina de Godzilla. Excelente para pistas y uso diario.",
    mileage: "15,000 km",
    transmission: "Automática",
    fuel: "Gasolina",
    color: "Plata",
    category: "SUPERCAR",
    badge: "EXÓTICO",
    badgeColor: "bg-pink-500"
  },
  "veh-6": {
    id: "veh-6",
    name: "Audi A4",
    year: "2022",
    price: "$720,000 MXN",
    location: "Tijuana, B.C.",
    description: "Sedán alemán con tecnología avanzada. Diseño elegante y prestaciones superiores.",
    mileage: "20,000 km",
    transmission: "Automática",
    fuel: "Diesel",
    color: "Gris",
    category: "LUXURY",
    badge: "PREMIUM",
    badgeColor: "bg-purple-500"
  }
};

const mockSeller = {
  name: "Juan Pérez",
  id: "user-123",
  phone: "+52 664 123 4567",
  rating: 4.8,
  reviews: 47,
  vehicles: 12
};

export default function VehicleDetailPage() {
  const params = useParams();
  const { id } = params as { id: string };
  const vehicle = mockVehicles[id as keyof typeof mockVehicles];
  const { isAuthenticated } = useAuth();

  // Si el vehículo no existe
  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Vehículo no encontrado</h1>
          <p className="text-gray-600 mb-6">El vehículo que buscas no existe o ha sido eliminado.</p>
          <Link href="/catalogo" className="inline-block bg-red-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-800 transition-colors">
            Ver Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-red-600">
                  Inicio
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link href="/catalogo" className="ml-1 text-sm font-medium text-gray-500 md:ml-2 hover:text-gray-700">
                    Catálogo
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {vehicle.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagen principal */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center relative">
                {vehicle.badge && (
                  <div className={`absolute top-6 left-6 ${vehicle.badgeColor} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
                    {vehicle.badge}
                  </div>
                )}
                <svg className="w-40 h-40 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>

            {/* Información del vehículo */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {vehicle.name}
                  </h1>
                  <p className="text-gray-600">{vehicle.year} • {vehicle.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-red-600">{vehicle.price}</p>
                  <p className="text-sm text-gray-600">{vehicle.location}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción</h2>
                <p className="text-gray-700 leading-relaxed">
                  {vehicle.description}
                </p>
              </div>
            </div>

            {/* Características técnicas */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Características</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Kilometraje</div>
                  <div className="text-lg font-semibold text-gray-900">{vehicle.mileage}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Transmisión</div>
                  <div className="text-lg font-semibold text-gray-900">{vehicle.transmission}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Combustible</div>
                  <div className="text-lg font-semibold text-gray-900">{vehicle.fuel}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Color</div>
                  <div className="text-lg font-semibold text-gray-900">{vehicle.color}</div>
                </div>
              </div>
            </div>

            {/* Información del vendedor */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sobre el Vendedor</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {mockSeller.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <Link href={`/perfil/${mockSeller.id}`} className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors">
                    {mockSeller.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.round(mockSeller.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {mockSeller.rating} ({mockSeller.reviews} reseñas)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Acciones */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Opciones de Compra</h2>
              
              {/* Botones de acción */}
              <div className="space-y-4">
                <BidButton vehicle={vehicle} />
                <BuyButton vehicle={vehicle} />
              </div>

              {/* Contacto rápido */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="w-full border-2 border-red-700 text-red-700 px-4 py-3 rounded-full font-semibold hover:bg-red-50 transition-colors">
                  Contactar Vendedor
                </button>
              </div>

              {/* Información adicional */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Información</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {vehicle.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Disponible ahora
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
