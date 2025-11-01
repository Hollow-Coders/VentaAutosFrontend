"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import AuthPrompt from "../auth/AuthPrompt";
import { servicioVenta, VehiculoDetalle } from "../../api";

interface PropsBotonCompra {
  vehicle: VehiculoDetalle | { id: number; precio: number; price?: string };
}

export default function BuyButton({ vehicle }: Readonly<PropsBotonCompra>) {
  const { estaAutenticado } = useAuth();
  const [mostrarPromptAuth, establecerMostrarPromptAuth] = useState(false);
  const [estaCargando, establecerCarga] = useState(false);

  const manejarCompra = async () => {
    if (!estaAutenticado) {
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
    
    // Lógica de compra para usuario autenticado
    establecerCarga(true);
    try {
      const response = await servicioVenta.purchase(vehicle.id, precioNumerico, 'transferencia');
      console.log("Compra exitosa:", response);
      alert("¡Compra realizada exitosamente!");
    } catch (error) {
      console.error("Error al realizar compra:", error);
      const mensaje = error instanceof Error ? error.message : "Error al realizar la compra. Inténtalo de nuevo.";
      alert(mensaje);
    } finally {
      establecerCarga(false);
    }
  };

  return (
    <>
      <button
        onClick={manejarCompra}
        disabled={estaCargando}
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
