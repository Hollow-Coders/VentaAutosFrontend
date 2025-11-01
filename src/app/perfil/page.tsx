"use client";

import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileVehicles from "../../components/profile/ProfileVehicles";
import ProfileReviews from "../../components/profile/ProfileReviews";

// Datos mock (en producción vendrían de una API)
const usuarioMock = {
  id: "user-123",
  nombre: "Juan",
  apellido:"Perez Rodrigrez",
  correo: "juan@example.com",
  telefono: "+52 664 123 4567",
  ubicacion: "Tijuana, B.C.",
  avatar: undefined,
  biografia: "Vendedor de vehículos con más de 10 años de experiencia. Especializado en vehículos deportivos y clásicos. Ofrezco garantía en todos mis vehículos.",
  esVendedor: true,
  esComprador: true,
  fechaRegistro: "2023-01-15"
};

const vehiculosMock = [
  {
    id: "veh-1",
    nombre: "Chevrolet Camaro SS",
    anio: "2022",
    precio: "$890,000 MXN",
    imagen: undefined,
    ubicacion: "Tijuana, B.C.",
    categoria: "DEPORTIVO",
    kilometraje: "25,000 km",
    transmision: "Automática",
    combustible: "Gasolina",
    status: "active" as const
  },
  {
    id: "veh-2",
    nombre: "Toyota Supra",
    anio: "2021",
    precio: "$1,200,000 MXN",
    imagen: undefined,
    ubicacion: "Tijuana, B.C.",
    categoria: "DEPORTIVO",
    kilometraje: "18,000 km",
    transmision: "Automática",
    combustible: "Gasolina",
    status: "active" as const
  },
  {
    id: "veh-3",
    nombre: "BMW M3",
    anio: "2020",
    precio: "$950,000 MXN",
    imagen: undefined,
    ubicacion: "Tijuana, B.C.",
    categoria: "SEDÁN",
    kilometraje: "30,000 km",
    transmision: "Automática",
    combustible: "Gasolina",
    status: "sold" as const
  },
  {
    id: "veh-4",
    nombre: "Ford Mustang",
    anio: "2023",
    precio: "$650,000 MXN",
    imagen: undefined,
    ubicacion: "Tijuana, B.C.",
    categoria: "MUSCLE CAR",
    kilometraje: "5,000 km",
    transmision: "Manual",
    combustible: "Gasolina",
    status: "active" as const
  },
  {
    id: "veh-5",
    nombre: "Nissan GT-R",
    anio: "2021",
    precio: "$1,450,000 MXN",
    imagen: undefined,
    ubicacion: "Tijuana, B.C.",
    categoria: "SUPERCAR",
    kilometraje: "15,000 km",
    transmision: "Automática",
    combustible: "Gasolina",
    status: "active" as const
  },
  {
    id: "veh-6",
    nombre: "Audi A4",
    anio: "2022",
    precio: "$720,000 MXN",
    imagen: undefined,
    ubicacion: "Tijuana, B.C.",
    categoria: "LUXURY",
    kilometraje: "20,000 km",
    transmision: "Automática",
    combustible: "Diesel",
    status: "active" as const
  }
];

const resenasMock = [
  {
    id: "rev-1",
    revisor: {
      nombre: "María González",
      avatar: undefined
    },
    calificacion: 5,
    comentario: "Excelente vendedor, el vehículo estaba en perfecto estado como describió. Muy profesional y atento a todas mis preguntas.",
    fecha: "2024-10-15"
  },
  {
    id: "rev-2",
    revisor: {
      nombre: "Carlos Ramírez",
      avatar: undefined
    },
    calificacion: 5,
    comentario: "Transacción muy fluida. El proceso fue rápido y sin complicaciones. Recomiendo totalmente.",
    fecha: "2024-10-10"
  },
  {
    id: "rev-3",
    revisor: {
      nombre: "Ana Martínez",
      avatar: undefined
    },
    calificacion: 4,
    comentario: "Buen vendedor, el vehículo está muy bien cuidado. Solo un pequeño detalle con el retraso en la entrega de documentos.",
    fecha: "2024-10-05"
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
  const usuarioPerfil = {
    id: (user?.id ?? "user-123"),
    nombre: (user?.nombre ?? usuarioMock.nombre),
    apellido: (user?.apellido ?? usuarioMock.apellido),
    correo: (user?.correo ?? usuarioMock.correo),
    telefono: usuarioMock.telefono,
    ubicacion: usuarioMock.ubicacion,
    avatar: (user?.avatar ?? usuarioMock.avatar),
    biografia: usuarioMock.biografia,
    esVendedor: usuarioMock.esVendedor,
    esComprador: usuarioMock.esComprador,
    fechaRegistro: usuarioMock.fechaRegistro
  };

  const esPropietario = true; // Siempre es el propietario en /perfil

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
        <ProfileHeader usuario={usuarioPerfil} esPropietario={esPropietario} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenido principal - Lista de vehículos */}
          <div className="lg:col-span-2">
            <ProfileVehicles 
              vehiculos={vehiculosMock} 
              esPropietario={esPropietario} 
            />
          </div>

          {/* Sidebar - Valoraciones */}
          <div className="lg:col-span-1">
            <ProfileReviews resenas={resenasMock} />
          </div>
        </div>
      </div>
    </div>
  );
}
