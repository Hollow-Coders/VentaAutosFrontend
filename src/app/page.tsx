
export default function Home() {
  return (
   <main className="container mx-auto px-4 py-12">
    <section className="text-center mb-12">
      <h6 className="bg-red-700 text-white rounded-2xl">ENCUENTRA TU VEHICULO PERFECTO</h6>
      <h2 className="text-4xl font-bold mb-4">En busca de tu vehiculo ideal</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        prueba
      </p>
    </section>

    <div className="grid gap-8 md:grid-cols-3">
      <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-2">Diseño moderno</h3>
        <p className="text-gray-600">Crea interfaces limpias y atractivas fácilmente.</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-2">Totalmente responsivo</h3>
        <p className="text-gray-600">Tu sitio se adapta a cualquier tamaño de pantalla.</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-2">100% personalizable</h3>
        <p className="text-gray-600">Define tu propio estilo sin pelear con clases globales.</p>
      </div>
    </div>
  </main>
  );
}
