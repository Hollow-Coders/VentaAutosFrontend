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

interface BidButtonProps {
  vehicle: Vehicle;
  currentBid?: number;
}

export default function BidButton({ vehicle, currentBid = 0 }: BidButtonProps) {
  const { isAuthenticated } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const handleBid = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    // Lógica de puja para usuario autenticado
    console.log("Pujando en vehículo:", vehicle.id);
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
