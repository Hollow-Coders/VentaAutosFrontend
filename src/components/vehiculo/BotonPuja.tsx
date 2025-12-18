"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import SolicitudAutenticacion from "../autenticacion/SolicitudAutenticacion";
import { servicioPuja, servicioSubasta, VehiculoDetalle } from "../../api";

interface PropsBotonPuja {
  vehicle: VehiculoDetalle | { id: number };
  currentBid?: number;
  subastaId?: number; // ID de la subasta asociada al vehículo
}

export default function BotonPuja({ vehicle, currentBid = 0, subastaId }: Readonly<PropsBotonPuja>) {
  const { estaAutenticado } = useAuth();
  const [mostrarPromptAuth, establecerMostrarPromptAuth] = useState(false);
  const [estaCargando, establecerCarga] = useState(false);

  const manejarPuja = async () => {
    if (!estaAutenticado) {
      establecerMostrarPromptAuth(true);
      return;
    }

    // Si no hay subastaId, intentar obtenerlo desde las subastas del vehículo
    let subastaIdFinal = subastaId;
    if (!subastaIdFinal) {
      try {
        const subastas = await servicioSubasta.getByVehicle(vehicle.id);
        const subastaActiva = subastas.find(s => s.estado === 'activa');
        if (!subastaActiva) {
          alert("No hay una subasta activa para este vehículo.");
          return;
        }
        subastaIdFinal = subastaActiva.id;
      } catch (error) {
        console.error("Error al obtener subasta:", error);
        alert("Error al obtener información de la subasta.");
        return;
      }
    }
    
    // Lógica de puja para usuario autenticado
    establecerCarga(true);
    try {
      const amount = currentBid > 0 ? currentBid + 1000 : 1000; // Incremento de puja
      if (!subastaIdFinal) {
        throw new Error("No se pudo obtener el ID de la subasta");
      }
      const response = await servicioPuja.bid(subastaIdFinal, amount);
      console.log("Puja exitosa:", response);
      alert(`Puja de $${amount.toLocaleString()} realizada exitosamente`);
    } catch (error) {
      console.error("Error al realizar puja:", error);
      const mensaje = error instanceof Error ? error.message : "Error al realizar la puja. Inténtalo de nuevo.";
      alert(mensaje);
    } finally {
      establecerCarga(false);
    }
  };

  return (
    <>
      <button
        onClick={manejarPuja}
        disabled={estaCargando}
        className="w-full bg-red-700 text-white py-3 rounded-full font-semibold hover:bg-red-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {estaCargando ? "PROCESANDO..." : estaAutenticado ? "PUJAR AHORA" : "INICIA SESIÓN PARA PUJAR"}
      </button>

      {mostrarPromptAuth && (
        <SolicitudAutenticacion
          onClose={() => establecerMostrarPromptAuth(false)}
          action="pujar en esta subasta"
        />
      )}
    </>
  );
}
