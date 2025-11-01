"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [datosFormulario, establecerDatosFormulario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
  });
  const [estaCargando, establecerCarga] = useState(false);
  const [error, establecerError] = useState("");
  
  const { registrar } = useAuth();
  const enrutador = useRouter();

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    establecerCarga(true);
    establecerError("");
    
    if (datosFormulario.contrasena !== datosFormulario.confirmarContrasena) {
      establecerError("Las contraseñas no coinciden.");
      establecerCarga(false);
      return;
    }
    
    try {
      // Concatenar nombre y apellido para nombre_completo
      const nombreCompleto = `${datosFormulario.nombre.trim()} ${datosFormulario.apellido.trim()}`.trim();
      await registrar(datosFormulario.nombre, datosFormulario.apellido, nombreCompleto, datosFormulario.correo, datosFormulario.contrasena);
      enrutador.push("/");
    } catch (error: unknown) {
      // Mostrar el mensaje de error específico del backend
      if (error instanceof Error) {
        establecerError(error.message || "Error al crear la cuenta. Inténtalo de nuevo.");
      } else {
        establecerError("Error al crear la cuenta. Inténtalo de nuevo.");
      }
      console.error("Error en registro:", error);
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
          Crear Cuenta
        </h2>
        <p className="mt-2 text-sm text-gray-600 text-center">
          Regístrate para acceder a todas las funcionalidades
        </p>
      </div>

      <form onSubmit={manejarEnvio} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              autoComplete="given-name"
              required
              value={datosFormulario.nombre}
              onChange={manejarCambio}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
              Apellido
            </label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              autoComplete="family-name"
              required
              value={datosFormulario.apellido}
              onChange={manejarCambio}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              placeholder="Tu apellido"
            />
          </div>
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
            value={datosFormulario.correo}
            onChange={manejarCambio}
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
            value={datosFormulario.contrasena}
            onChange={manejarCambio}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div>
          <label htmlFor="confirmarContrasena" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar contraseña
          </label>
          <input
            id="confirmarContrasena"
            name="confirmarContrasena"
            type="password"
            autoComplete="new-password"
            required
            value={datosFormulario.confirmarContrasena}
            onChange={manejarCambio}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            placeholder="Repite tu contraseña"
          />
        </div>

        <div className="flex items-center">
          <input
            id="terminos"
            name="terminos"
            type="checkbox"
            required
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="terminos" className="ml-2 block text-sm text-gray-700">
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
            disabled={estaCargando}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {estaCargando ? "Creando cuenta..." : "Crear Cuenta"}
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
