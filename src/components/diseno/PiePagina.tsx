import Link from "next/link";

export default function PiePagina() {
  return (
    <footer className="mt-16 border-t border-slate-200/70 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40">
      <div className="container mx-auto px-4 py-12 sm:py-14">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Pagina Autos</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
              Tu plataforma de confianza para encontrar el vehículo perfecto de forma segura y sencilla.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Navegación</h4>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">Inicio</Link></li>
              <li><Link href="/catalogo" className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">Catálogo</Link></li>
              <li><Link href="/Subastas" className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">Subastas</Link></li>
              <li><Link href="/Contacto" className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">Condiciones de uso</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">Aviso de privacidad</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">Términos y condiciones</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Contacto</h4>
            <div className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
              <p>ayudapagina@gmail.com</p>
              <p>+52 664 123 4567</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-slate-800 pt-6">
          <p className="text-center text-sm text-gray-400 dark:text-gray-500">
            © 2024 Pagina Autos. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
