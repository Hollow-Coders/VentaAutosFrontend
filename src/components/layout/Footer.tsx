import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Apartado de texto pagina autos */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-700 rounded flex items-center justify-center mr-3">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </div>
              <h3 className="text-xl font-bold">Pagina Autos</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Su plataforma de confianza para encontrar el vehículo perfecto. Conectamos compradores y vendedores de manera segura y profesional.
            </p>
          </div>

          {/* Apartado de navegaciones  */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/catalogo" className="text-gray-300 hover:text-white transition-colors">Catálogo</Link></li>
              <li><Link href="/Subastas" className="text-gray-300 hover:text-white transition-colors">Subastas</Link></li>
              <li><Link href="/Contacto" className="text-gray-300 hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Apartado de cosas legales, luego vemos eso */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Condiciones de uso</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Aviso de privacidad</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Términos y condiciones</a></li>
            </ul>
          </div>

          {/* Apartado de contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-700 rounded-full mr-3"></div>
                <span className="text-gray-300 text-sm">ayudapagina@gmail.com</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-700 rounded-full mr-3"></div>
                <span className="text-gray-300 text-sm">+52 664 123 4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              ©2024 Pagina Autos. Todos los derechos reservados.
            </p>
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
