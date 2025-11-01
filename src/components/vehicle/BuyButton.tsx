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

interface BotonCompraProps {
  vehiculo: Vehiculo;
}

export default function BuyButton({ vehiculo }: BotonCompraProps) {
  const { isAuthenticated } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const handleBuy = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    // Lógica de compra para usuario autenticado
    console.log("Comprando vehículo:", vehiculo.id);
  };

  return (
    <>
      <button
        onClick={handleBuy}
        className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
      >
        {isAuthenticated ? "COMPRAR AHORA" : "INICIA SESIÓN PARA COMPRAR"}
      </button>

      {showAuthPrompt && (
        <AuthPrompt
          onClose={() => setShowAuthPrompt(false)}
          action="comprar este vehículo"
        />
      )}
    </>
  );
}
