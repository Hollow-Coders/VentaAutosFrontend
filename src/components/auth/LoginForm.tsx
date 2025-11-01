"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [datosFormulario, establecerDatosFormulario] = useState({
    correo: "",
    contrasena: "",
  });
  const [estaCargando, establecerCarga] = useState(false);
  const [error, establecerError] = useState("");
  
  const { iniciarSesion } = useAuth();
  const enrutador = useRouter();

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    establecerCarga(true);
    establecerError("");
    
    try {
      await iniciarSesion(datosFormulario.correo, datosFormulario.contrasena);
      enrutador.push("/");
    } catch (error) {
      establecerError("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      establecerCarga(false);
    }
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    establecerDatosFormulario({
      ...datosFormulario,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white py-8 px-6 shadow-lg border-2 border-gray-300 rounded-lg sm:px-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Iniciar Sesión
        </h2>
        <p className="mt-2 text-sm text-gray-600 text-center">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>
      </div>

      <form onSubmit={manejarEnvio} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            autoComplete="email"
            required
            value={datosFormulario.correo}
            onChange={manejarCambio}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            id="contrasena"
            name="contrasena"
            type="password"
            autoComplete="current-password"
            required
            value={datosFormulario.contrasena}
            onChange={manejarCambio}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            placeholder="Tu contraseña"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="recordarme"
              name="recordarme"
              type="checkbox"
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="recordarme" className="ml-2 block text-sm text-gray-700">
              Recordarme
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-red-600 hover:text-red-500">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={estaCargando}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {estaCargando ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link 
              href="/register" 
              className="font-medium text-red-600 hover:text-red-500 transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}