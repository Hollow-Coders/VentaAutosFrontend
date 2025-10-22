"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import AuthPrompt from "../auth/AuthPrompt";

interface Vehicle {
  id: string;
  name: string;
  year: string;
  price: string;
  category: string;
  badge: string;
  badgeColor: string;
}

interface BuyButtonProps {
  vehicle: Vehicle;
}

export default function BuyButton({ vehicle }: BuyButtonProps) {
  const { isAuthenticated } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const handleBuy = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    // Lógica de compra para usuario autenticado
    console.log("Comprando vehículo:", vehicle.id);
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
