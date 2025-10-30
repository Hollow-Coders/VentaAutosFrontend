"use client";

import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileVehicles from "../../components/profile/ProfileVehicles";
import ProfileReviews from "../../components/profile/ProfileReviews";

// Datos mock (en producción vendrían de una API)
const mockUser = {
  id: "user-123",
  name: "Juan",
  lastname:"Perez Rodrigrez",
  email: "juan@example.com",
  phone: "+52 664 123 4567",
  location: "Tijuana, B.C.",
  avatar: undefined,
  bio: "Vendedor de vehículos con más de 10 años de experiencia. Especializado en vehículos deportivos y clásicos. Ofrezco garantía en todos mis vehículos.",
  isSeller: true,
  isBuyer: true,
  joinDate: "2023-01-15"
};

const mockVehicles = [
  {
    id: "veh-1",
    name: "Chevrolet Camaro SS",
    year: "2022",
    price: "$890,000 MXN",
    image: undefined,
    location: "Tijuana, B.C.",
    category: "DEPORTIVO",
    mileage: "25,000 km",
    transmission: "Automática",
    fuel: "Gasolina",
    status: "active" as const
  },
  {
    id: "veh-2",
    name: "Toyota Supra",
    year: "2021",
    price: "$1,200,000 MXN",
    image: undefined,
    location: "Tijuana, B.C.",
    category: "DEPORTIVO",
    mileage: "18,000 km",
    transmission: "Automática",
    fuel: "Gasolina",
    status: "active" as const
  },
  {
    id: "veh-3",
    name: "BMW M3",
    year: "2020",
    price: "$950,000 MXN",
    image: undefined,
    location: "Tijuana, B.C.",
    category: "SEDÁN",
    mileage: "30,000 km",
    transmission: "Automática",
    fuel: "Gasolina",
    status: "sold" as const
  },
  {
    id: "veh-4",
    name: "Ford Mustang",
    year: "2023",
    price: "$650,000 MXN",
    image: undefined,
    location: "Tijuana, B.C.",
    category: "MUSCLE CAR",
    mileage: "5,000 km",
    transmission: "Manual",
    fuel: "Gasolina",
    status: "active" as const
  },
  {
    id: "veh-5",
    name: "Nissan GT-R",
    year: "2021",
    price: "$1,450,000 MXN",
    image: undefined,
    location: "Tijuana, B.C.",
    category: "SUPERCAR",
    mileage: "15,000 km",
    transmission: "Automática",
    fuel: "Gasolina",
    status: "active" as const
  },
  {
    id: "veh-6",
    name: "Audi A4",
    year: "2022",
    price: "$720,000 MXN",
    image: undefined,
    location: "Tijuana, B.C.",
    category: "LUXURY",
    mileage: "20,000 km",
    transmission: "Automática",
    fuel: "Diesel",
    status: "active" as const
  }
];

const mockReviews = [
  {
    id: "rev-1",
    reviewer: {
      name: "María González",
      avatar: undefined
    },
    rating: 5,
    comment: "Excelente vendedor, el vehículo estaba en perfecto estado como describió. Muy profesional y atento a todas mis preguntas.",
    date: "2024-10-15"
  },
  {
    id: "rev-2",
    reviewer: {
      name: "Carlos Ramírez",
      avatar: undefined
    },
    rating: 5,
    comment: "Transacción muy fluida. El proceso fue rápido y sin complicaciones. Recomiendo totalmente.",
    date: "2024-10-10"
  },
  {
    id: "rev-3",
    reviewer: {
      name: "Ana Martínez",
      avatar: undefined
    },
    rating: 4,
    comment: "Buen vendedor, el vehículo está muy bien cuidado. Solo un pequeño detalle con el retraso en la entrega de documentos.",
    date: "2024-10-05"
  }
];

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirigir a login si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Mostrar loading mientras verifica autenticación
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Usar datos mock del usuario actual
  // En producción, estos datos vendrían del AuthContext o API
  const profileUser = {
    id: user?.id || "user-123",
    name: user?.name || mockUser.name,
    lastname:user?.lastname || mockUser.lastname,
    email: user?.email || mockUser.email,
    phone: mockUser.phone,
    location: mockUser.location,
    avatar: user?.avatar || mockUser.avatar,
    bio: mockUser.bio,
    isSeller: mockUser.isSeller,
    isBuyer: mockUser.isBuyer,
    joinDate: mockUser.joinDate
  };

  const isOwner = true; // Siempre es el propietario en /perfil

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
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
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Mi Perfil</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Header del Perfil */}
        <ProfileHeader user={profileUser} isOwner={isOwner} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenido principal - Lista de vehículos */}
          <div className="lg:col-span-2">
            <ProfileVehicles 
              vehicles={mockVehicles} 
              isOwner={isOwner} 
            />
          </div>

          {/* Sidebar - Valoraciones */}
          <div className="lg:col-span-1">
            <ProfileReviews reviews={mockReviews} />
          </div>
        </div>
      </div>
    </div>
  );
}
