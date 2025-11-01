"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import AuthPrompt from "../auth/AuthPrompt";

interface Vehiculo {
  id: string;
  nombre: string;
  anio: string;
  precio: string;
  categoria: string;
  insignia: string;
  colorInsignia: string;
}

interface BotonPujaProps {
  vehiculo: Vehiculo;
  pujaActual?: number;
}

export default function BidButton({ vehiculo, pujaActual = 0 }: BotonPujaProps) {
  const { isAuthenticated } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const handleBid = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    // Lógica de puja para usuario autenticado
    console.log("Pujando en vehículo:", vehiculo.id, "Puja actual:", pujaActual);
  };

  return (
    <>
      <button
        onClick={handleBid}
        className="w-full bg-red-700 text-white py-3 rounded-full font-semibold hover:bg-red-800 transition-colors"
      >
        {isAuthenticated ? "PUJAR AHORA" : "INICIA SESIÓN PARA PUJAR"}
      </button>

      {showAuthPrompt && (
        <AuthPrompt
          onClose={() => setShowAuthPrompt(false)}
          action="pujar en esta subasta"
        />
      )}
    </>
  );
}
