"use client";

import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { servicioVenta, Venta } from "../../../api/sales";
import { servicioVehiculo, VehiculoDetalle } from "../../../api/vehicles";
import { servicioValoracion } from "../../../api/ratings";
import TarjetaCompra from "../../../components/compra/TarjetaCompra";

interface CompraConDetalles extends Venta {
  vehiculoDetalle?: VehiculoDetalle;
  vendedorNombre?: string;
  yaValorado?: boolean;
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
        console.log("Ventas obtenidas:", ventas);
        console.log("Usuario ID:", usuario.id);

        // Filtrar solo las compras del usuario actual (seguridad adicional)
        const usuarioId = Number(usuario.id);
        const comprasDelUsuario = ventas.filter(venta => {
          const compradorId = Number(venta.comprador);
          console.log(`Comparando: compradorId=${compradorId}, usuarioId=${usuarioId}`);
          return compradorId === usuarioId;
        });
        console.log("Compras del usuario filtradas:", comprasDelUsuario);

        // Cargar detalles de cada vehículo, vendedor y verificar valoraciones
        const comprasConDetalles = await Promise.all(
          comprasDelUsuario.map(async (venta) => {
            try {
              const vehiculoDetalle = await servicioVehiculo.getById(venta.vehiculo);
              
              // Verificar si ya existe una valoración para esta venta
              let yaValorado = false;
              try {
                yaValorado = await servicioValoracion.verificarValoracionExistente(
                  venta.id,
                  vehiculoDetalle.usuario
                );
              } catch (error) {
                console.error(`Error verificando valoración para venta ${venta.id}:`, error);
                // Si hay error, asumimos que no está valorado
              }
              
              return {
                ...venta,
                vehiculoDetalle,
                vendedorNombre: vehiculoDetalle.usuario_nombre,
                yaValorado,
              };
            } catch (error) {
              console.error(`Error cargando vehículo ${venta.vehiculo}:`, error);
              return {
                ...venta,
                vehiculoDetalle: undefined,
                vendedorNombre: undefined,
                yaValorado: false,
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
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando tus compras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-6 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Mis Compras</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Aquí puedes ver todas tus compras y comunicarte con los vendedores
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Lista de compras */}
        {compras.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-transparent dark:border-gray-700 rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No tienes compras aún
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Cuando realices una compra, aparecerá aquí
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compras.map((compra) => {
              if (!compra.vehiculoDetalle) {
                return (
                  <div key={compra.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <p className="text-gray-600 dark:text-gray-300">Error cargando información del vehículo</p>
                  </div>
                );
              }
              return (
                <TarjetaCompra
                  key={compra.id}
                  venta={compra}
                  vehiculo={compra.vehiculoDetalle}
                  vendedorNombre={compra.vendedorNombre}
                  yaValorado={compra.yaValorado}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

