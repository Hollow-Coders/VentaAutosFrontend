"use client";

import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { servicioVenta, Venta } from "../../../api/sales";
import { servicioVehiculo, VehiculoDetalle } from "../../../api/vehicles";
import PurchaseCard from "../../../components/purchase/PurchaseCard";

interface CompraConDetalles extends Venta {
  vehiculoDetalle?: VehiculoDetalle;
  vendedorNombre?: string;
}

export default function MisComprasPage() {
  const { usuario, estaAutenticado, estaCargando } = useAuth();
  const router = useRouter();
  const [compras, establecerCompras] = useState<CompraConDetalles[]>([]);
  const [cargando, establecerCargando] = useState(true);
  const [error, establecerError] = useState("");

  useEffect(() => {
    if (!estaCargando && !estaAutenticado) {
      router.push("/login");
    }
  }, [estaAutenticado, estaCargando, router]);

  useEffect(() => {
    const cargarCompras = async () => {
      if (!estaAutenticado || !usuario?.id) return;

      establecerCargando(true);
      establecerError("");

      try {
        // Obtener todas las compras del usuario
        const ventas = await servicioVenta.getMyPurchases();

        // Filtrar solo las compras del usuario actual (seguridad adicional)
        const usuarioId = Number(usuario.id);
        const comprasDelUsuario = ventas.filter(venta => {
          const compradorId = Number(venta.comprador);
          return compradorId === usuarioId;
        });

        // Cargar detalles de cada vehículo y vendedor
        const comprasConDetalles = await Promise.all(
          comprasDelUsuario.map(async (venta) => {
            try {
              const vehiculoDetalle = await servicioVehiculo.getById(venta.vehiculo);
              return {
                ...venta,
                vehiculoDetalle,
                vendedorNombre: vehiculoDetalle.usuario_nombre,
              };
            } catch (error) {
              console.error(`Error cargando vehículo ${venta.vehiculo}:`, error);
              return {
                ...venta,
                vehiculoDetalle: undefined,
                vendedorNombre: undefined,
              };
            }
          })
        );

        establecerCompras(comprasConDetalles);
      } catch (error) {
        console.error("Error cargando compras:", error);
        establecerError("Error al cargar tus compras. Por favor, intenta de nuevo.");
      } finally {
        establecerCargando(false);
      }
    };

    if (estaAutenticado) {
      cargarCompras();
    }
  }, [estaAutenticado, usuario?.id]);

  if (estaCargando || cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus compras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Compras</h1>
          <p className="text-gray-600">
            Aquí puedes ver todas tus compras y comunicarte con los vendedores
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Lista de compras */}
        {compras.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes compras aún
            </h2>
            <p className="text-gray-600 mb-6">
              Cuando realices una compra, aparecerá aquí
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compras.map((compra) => {
              if (!compra.vehiculoDetalle) {
                return (
                  <div key={compra.id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <p className="text-gray-600">Error cargando información del vehículo</p>
                  </div>
                );
              }
              return (
                <PurchaseCard
                  key={compra.id}
                  venta={compra}
                  vehiculo={compra.vehiculoDetalle}
                  vendedorNombre={compra.vendedorNombre}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

