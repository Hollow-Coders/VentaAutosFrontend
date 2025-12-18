"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api';

interface Usuario {
  id: number | string;
  nombre: string;
  apellido?: string;
  nombre_completo?: string;
  correo: string;
  avatar?: string;
  rol?: number; // ID del rol (1 = Administrador, 2 = Vendedor, 3 = Comprador)
}

interface TipoContextoAutenticacion {
  usuario: Usuario | null;
  estaAutenticado: boolean;
  estaCargando: boolean;
  esAdministrador: boolean; // Helper para verificar si es administrador
  iniciarSesion: (correo: string, contrasena: string) => Promise<void>;
  registrar: (nombre: string, apellido: string, nombreCompleto: string, correo: string, contrasena: string) => Promise<void>;
  cerrarSesion: () => void;
}

const ContextoAutenticacion = createContext<TipoContextoAutenticacion | undefined>(undefined);

export function ProveedorAutenticacion({ children }: Readonly<{ children: React.ReactNode }>) {
  const [usuario, establecerUsuario] = useState<Usuario | null>(null);
  const [estaCargando, establecerCarga] = useState(true);

  // Verificar autenticación inicial
  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        // Intentar obtener usuario del almacenamiento local
        const userStored = authService.getCurrentUser();
        if (userStored) {
          establecerUsuario(userStored);
          // También verificar el token si existe
          try {
            const user = await authService.verifyToken();
            establecerUsuario(user);
            authService.setCurrentUser(user);
          } catch {
            // Si falla la verificación, usar el usuario del storage
          }
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        // Si hay error, limpiar datos
        authService.removeCurrentUser();
      } finally {
        establecerCarga(false);
      }
    };
    verificarAutenticacion();
  }, []);

  const iniciarSesion = async (correo: string, contrasena: string) => {
    establecerCarga(true);
    try {
      const response = await authService.login({ correo, contrasena });
      // El backend devuelve los datos directamente, no dentro de 'user'
      const usuario: Usuario = {
        id: response.id,
        nombre: response.nombre,
        apellido: response.apellido,
        nombre_completo: response.nombre_completo,
        correo: response.correo,
        rol: response.rol,
      };
      establecerUsuario(usuario);
      authService.setCurrentUser(usuario);
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    } finally {
      establecerCarga(false);
    }
  };

  const registrar = async (nombre: string, apellido: string, nombreCompleto: string, correo: string, contrasena: string) => {
    establecerCarga(true);
    try {
      const response = await authService.register({ 
        nombre, 
        apellido, 
        nombre_completo: nombreCompleto,
        correo, 
        contrasena,
        rol: 2 // ID del rol por defecto para nuevos usuarios
      });
      // El backend devuelve los datos directamente, no dentro de 'user'
      const usuario: Usuario = {
        id: response.id,
        nombre: response.nombre,
        apellido: response.apellido,
        nombre_completo: response.nombre_completo,
        correo: response.correo,
        rol: response.rol,
      };
      establecerUsuario(usuario);
      authService.setCurrentUser(usuario);
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    } finally {
      establecerCarga(false);
    }
  };

  const cerrarSesion = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      establecerUsuario(null);
      authService.removeCurrentUser();
    }
  };

  // Verificar si el usuario es administrador (rol ID = 1)
  const esAdministrador = usuario?.rol === 1;

  const valor = {
    usuario,
    estaAutenticado: !!usuario,
    estaCargando,
    esAdministrador,
    iniciarSesion,
    registrar,
    cerrarSesion,
  };

  return (
    <ContextoAutenticacion.Provider value={valor}>
      {children}
    </ContextoAutenticacion.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(ContextoAutenticacion);
  if (contexto === undefined) {
    throw new Error('useAuth debe usarse dentro de un ProveedorAutenticacion');
  }
  return contexto;
}
