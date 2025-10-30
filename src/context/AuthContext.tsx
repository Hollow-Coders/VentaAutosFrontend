"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, lastname:string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simular carga inicial (en una app real, verificarías el token aquí)
  useEffect(() => {
    const checkAuth = async () => {
      // Simular verificación de token
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular usuario logueado
      setUser({
        id: '1',
        name: 'Usuario Demo',
        lastname:'Demo',
        email: email,
        avatar: undefined
      });
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, lastname:string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular usuario registrado
      setUser({
        id: '1',
        name: name,
        lastname: lastname,
        email: email,
        avatar: undefined
      });
    } catch (error) {
      console.error('Error en registro:', error);
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
