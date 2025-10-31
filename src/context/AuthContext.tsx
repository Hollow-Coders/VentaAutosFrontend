"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/venta/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: email,
          contrasena: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();

      setUser({
        id: data.id,
        name: data.nombre,
        email: data.correo,
        avatar: data.avatar,
      });
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


const register = async (name: string, email: string, password: string) => {
  setIsLoading(true);
  try {
    const response = await fetch("http://127.0.0.1:8000/venta/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: name,
        apellido: "2",
        correo: email,
        contrasena: password,
        rol: "1",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error en registro:", errorData);
      throw new Error("Error en el registro");
    }

    const data = await response.json();
    console.log("Usuario creado:", data);

    setUser({
      id: "1",
      name: name,
      email: email,
      avatar: undefined,
    });
  } catch (error) {
    console.error("Error en registro:", error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};


  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
