"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido:"",
    correo: "",
    contrasena: "",
    confirmcontrasena: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    if (formData.contrasena !== formData.confirmcontrasena) {
      setError("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }
    
    try {
      await register(formData.nombre, formData.apellido, formData.correo, formData.contrasena);
      router.push("/");
    } catch (error) {
      setError("Error al crear la cuenta. Inténtalo de nuevo.");
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
          Crear Cuenta
        </h2>
        <p className="mt-2 text-sm text-gray-600 text-center">
          Regístrate para acceder a todas las funcionalidades
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            autoComplete="nombre"
            required
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            placeholder="Tu nombre completo"
          />
        </div>
        <div>
          <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
            Apellidos
          </label>
          <input
            id="apellido"
            name="apellido"
            type="text"
            autoComplete="apellido"
            required
            value={formData.apellido}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            placeholder="Tu apellido/s"
          />
        </div>
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
            value={formData.correo}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            placeholder="tu@correo.com"
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
            autoComplete="new-password"
            required
            value={formData.contrasena}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div>
          <label htmlFor="confirmcontrasena" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar contraseña
          </label>
          <input
            id="confirmcontrasena"
            name="confirmcontrasena"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmcontrasena}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            placeholder="Repite tu contraseña"
          />
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            Acepto los{" "}
            <a href="#" className="text-red-600 hover:text-red-500">
              términos y condiciones
            </a>{" "}
            y la{" "}
            <a href="#" className="text-red-600 hover:text-red-500">
              política de privacidad
            </a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
        ¿Ya tienes cuenta?{" "}
            <Link 
              href="/login" 
              className="font-medium text-red-600 hover:text-red-500 transition-colors"
            >
              Inicia sesión aquí
        </Link>
      </p>
        </div>
    </form>
    </div>
  );
}
