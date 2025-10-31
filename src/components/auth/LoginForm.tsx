"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await login(formData.correo, formData.contrasena);
      router.push("/");
    } catch (error) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico
          </label>
          <input
            id="email"
            name="correo"
            type="email"
            autoComplete="email"
            required
            value={formData.correo}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            id="password"
            name="contrasena"
            type="password"
            autoComplete="current-password"
            required
            value={formData.contrasena}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            placeholder="Tu contraseña"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
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
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
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