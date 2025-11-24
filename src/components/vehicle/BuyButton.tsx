"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import AuthPrompt from "../auth/AuthPrompt";
import { servicioVenta, servicioVehiculo, VehiculoDetalle } from "../../api";

interface PropsBotonCompra {
  vehicle: VehiculoDetalle | { id: number; precio: number; price?: string; estado?: string; usuario?: number };
  onCompraExitosa?: () => void;
}

export default function BuyButton({ vehicle, onCompraExitosa }: Readonly<PropsBotonCompra>) {
  const { estaAutenticado, usuario } = useAuth();
  const router = useRouter();
  const [mostrarPromptAuth, establecerMostrarPromptAuth] = useState(false);
  const [estaCargando, establecerCarga] = useState(false);
  const [estaVendido, setEstaVendido] = useState(false);

  // Verificar si el vehículo está vendido al cargar
  useEffect(() => {
    if ('estado' in vehicle && vehicle.estado) {
      const estado = String(vehicle.estado).toLowerCase().trim();
      // Verificar diferentes variaciones del estado "vendido"
      const esVendido = estado === 'vendido' || estado === 'sold' || estado.includes('vendido');
      setEstaVendido(esVendido);
    } else {
      // Si no hay estado, asumimos que está disponible
      setEstaVendido(false);
    }
  }, [vehicle]);

  // Verificar si el usuario es el vendedor
  const esVendedor = estaAutenticado && usuario && 'usuario' in vehicle && vehicle.usuario 
    ? Number(usuario.id) === Number(vehicle.usuario)
    : false;

  // El botón debe estar deshabilitado si está vendido o si el usuario es el vendedor
  const deshabilitado = estaVendido || esVendedor || estaCargando;

  const manejarCompra = async () => {
    if (!estaAutenticado || !usuario) {
      establecerMostrarPromptAuth(true);
      return;
    }
    
    // Obtener el precio: puede venir como number (VehiculoDetalle) o string (interfaz antigua)
    let precioNumerico: number;
    if ('precio' in vehicle && typeof vehicle.precio === 'number') {
      precioNumerico = vehicle.precio;
    } else if ('price' in vehicle && vehicle.price) {
      precioNumerico = Number.parseFloat(vehicle.price.replace(/[$,]/g, '')) || 0;
    } else {
      alert("No se puede determinar el precio del vehículo.");
      return;
    }
    
    if (precioNumerico === 0) {
      alert("No se puede determinar el precio del vehículo.");
      return;
    }

    // Obtener el ID del vendedor del vehículo
    let vendedorId: number;
    if ('usuario' in vehicle && typeof vehicle.usuario === 'number') {
      vendedorId = vehicle.usuario;
    } else {
      alert("No se puede determinar el vendedor del vehículo.");
      return;
    }

    // Obtener el ID del comprador (usuario actual)
    const compradorId = Number(usuario.id);
    if (!compradorId || isNaN(compradorId)) {
      alert("Error al obtener la información del comprador.");
      return;
    }
    
    // Lógica de compra para usuario autenticado
    establecerCarga(true);
    try {
      // Crear la venta
      const response = await servicioVenta.purchase(
        vehicle.id, 
        precioNumerico, 
        compradorId,
        vendedorId,
        'transferencia'
      );
      console.log("Compra exitosa:", response);
      
      // Actualizar el estado del vehículo a "vendido"
      try {
        await servicioVehiculo.updateEstado(vehicle.id, 'vendido');
        console.log("Estado del vehículo actualizado a 'vendido'");
        // Marcar como vendido localmente para deshabilitar el botón inmediatamente
        setEstaVendido(true);
      } catch (errorEstado) {
        console.error("Error actualizando estado del vehículo:", errorEstado);
        // No bloqueamos la compra si falla la actualización del estado
        // pero informamos al usuario
        alert("¡Compra realizada exitosamente! Nota: Hubo un problema al actualizar el estado del vehículo.");
        return;
      }
      
      alert("¡Compra realizada exitosamente! El vehículo ha sido marcado como vendido.");
      
      // Llamar al callback si existe (para actualizar el estado en el componente padre)
      if (onCompraExitosa) {
        onCompraExitosa();
      }
      
      // Recargar la página después de un breve delay para reflejar los cambios
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Error al realizar compra:", error);
      const mensaje = error instanceof Error ? error.message : "Error al realizar la compra. Inténtalo de nuevo.";
      alert(mensaje);
    } finally {
      establecerCarga(false);
    }
  };

  // Si está vendido, mostrar botón deshabilitado con mensaje "VENDIDO"
  if (estaVendido) {
    return (
      <button
        disabled
        className="w-full bg-gray-500 text-white py-3 rounded-full font-semibold text-center cursor-not-allowed opacity-75"
      >
        VENDIDO
      </button>
    );
  }

  // Si el usuario es el vendedor, no mostrar el botón
  if (esVendedor) {
    return null;
  }

  return (
    <>
      <button
        onClick={manejarCompra}
        disabled={deshabilitado}
        className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {estaCargando ? "PROCESANDO..." : estaAutenticado ? "COMPRAR AHORA" : "INICIA SESIÓN PARA COMPRAR"}
      </button>

      {mostrarPromptAuth && (
        <AuthPrompt
          onClose={() => establecerMostrarPromptAuth(false)}
          action="comprar este vehículo"
        />
      )}
    </>
  );
}
