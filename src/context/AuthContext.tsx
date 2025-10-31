"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (correo: string, contrasena: string) => Promise<void>;
  register: (nombre: string, apellido: string, correo: string, contrasena: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;
        if (stored) {
          const parsed: User = JSON.parse(stored);
          setUser(parsed);
        }
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };
    checkAuth();
  }, []);

  const login = async (correo: string, contrasena: string) => {
    setIsLoading(true);
    try {
      console.log('[Auth] login(): inicio');
      console.log('[Auth] login(): payload', { correo, contrasenaLength: contrasena?.length ?? 0 });
      const response = await fetch("http://127.0.0.1:8000/venta/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: correo,
          contrasena: contrasena,
        }),
      });
      console.log('[Auth] login(): response ok?', response.ok, 'status', response.status);
      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();
      console.log('[Auth] login(): raw data', data);

      // Algunas APIs envían el usuario anidado en distintas claves
      const src: Record<string, unknown> = (data.usuario as Record<string, unknown>)
        || (data.user as Record<string, unknown>)
        || (data.data as Record<string, unknown>)
        || (data as Record<string, unknown>);
      console.log('[Auth] login(): src user', src);

      // Derivar un nombre visible si falta (por ejemplo, de la parte local del correo)
      const correoValue = ((src.correo as string | undefined) ?? (src.email as string | undefined) ?? '').toString();
      const derivedNombre = correoValue ? correoValue.split('@')[0] : '';

      const normalized: User = {
        id: String((src.id as string | number | undefined) ?? (src.user_id as string | number | undefined) ?? (src.uid as string | number | undefined) ?? ''),
        nombre: ((src.nombre as string | undefined) ?? (src.name as string | undefined) ?? derivedNombre).toString(),
        apellido: ((src.apellido as string | undefined) ?? (src.lastname as string | undefined) ?? (src.apellidos as string | undefined) ?? '').toString(),
        correo: correoValue,
        avatar: ((src.avatar as string | undefined) ?? (src.photoUrl as string | undefined) ?? (src.foto as string | undefined)) || undefined,
      };
      console.log('[Auth] login(): normalized user', normalized);

      // Si hay un id (de acceso) intenta obtener el perfil completo desde /usuarios/{id}
      const accessIdRaw = (src.idAcceso as string | number | undefined)
        ?? (src.id as string | number | undefined)
        ?? (data.idAcceso as string | number | undefined)
        ?? (data.id as string | number | undefined);
      const accessId = accessIdRaw != null ? String(accessIdRaw) : '';
      let finalUser: User = normalized;

      if (accessId) {
        try {
          console.log('[Auth] login(): fetching user details by id', accessId);
          const detailsResp = await fetch(`http://127.0.0.1:8000/venta/usuarios/${accessId}/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          console.log('[Auth] login(): usuarios response ok?', detailsResp.ok, 'status', detailsResp.status);
          if (detailsResp.ok) {
            const details = await detailsResp.json();
            console.log('[Auth] login(): usuarios raw', details);
            const du = (details.usuario as Record<string, unknown>)
              || (details.user as Record<string, unknown>)
              || (details.data as Record<string, unknown>)
              || (details as Record<string, unknown>);
            const correoDet = ((du.correo as string | undefined) ?? (du.email as string | undefined) ?? normalized.correo).toString();
            finalUser = {
              id: String((du.id as string | number | undefined) ?? accessId),
              nombre: ((du.nombre as string | undefined) ?? (du.name as string | undefined) ?? normalized.nombre).toString(),
              apellido: ((du.apellido as string | undefined) ?? (du.lastname as string | undefined) ?? (du.apellidos as string | undefined) ?? normalized.apellido).toString(),
              correo: correoDet,
              avatar: ((du.avatar as string | undefined) ?? (du.photoUrl as string | undefined) ?? (du.foto as string | undefined)) || normalized.avatar,
            };
            console.log('[Auth] login(): detailed user mapped', finalUser);
          }
        } catch (e) {
          console.warn('[Auth] login(): usuarios fetch failed, using normalized', e);
        }
      }

      setUser(finalUser);
      console.log('[Auth] login(): user set in state');
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(finalUser));
        console.log('[Auth] login(): user persisted to localStorage');
      }
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    } finally {
      setIsLoading(false);
      console.log('[Auth] login(): fin');
    }
  };


  const register = async (nombre: string, apellido: string, correo: string, contrasena: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/venta/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre,
          apellido: apellido,
          correo: correo,
          contrasena: contrasena,
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

      const created: User = {
        id: String(data.id ?? '1'),
        nombre,
        apellido,
        correo,
        avatar: data.avatar,
      };
      setUser(created);
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(created));
      }
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user');
    }
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
