"use client";

import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { servicioMarca, Marca } from "../../../api/brands";
import { servicioModelo, Modelo } from "../../../api/models";
import { servicioCreacionVehiculo, SolicitudVehiculo } from "../../../api/vehicles";
import { servicioVehiculoFoto } from "../../../api/vehiclePhotos";

export default function CreacionVehiculoPage() {
  const { usuario, estaAutenticado, estaCargando } = useAuth();
  const router = useRouter();
  const [guardando, establecerGuardando] = useState(false);
  const [error, establecerError] = useState("");
  const [exito, establecerExito] = useState(false);

  // Estados para marcas y modelos
  const [marcas, establecerMarcas] = useState<Marca[]>([]);
  const [modelos, establecerModelos] = useState<Modelo[]>([]);
  const [marcaSeleccionada, establecerMarcaSeleccionada] = useState<number | null>(null);
  const [buscandoMarca, establecerBuscandoMarca] = useState("");
  const [buscandoModelo, establecerBuscandoModelo] = useState("");
  const [mostrarDropdownMarca, establecerMostrarDropdownMarca] = useState(false);
  const [mostrarDropdownModelo, establecerMostrarDropdownModelo] = useState(false);
  const [nombreMarcaSeleccionada, establecerNombreMarcaSeleccionada] = useState("");
  const [nombreModeloSeleccionado, establecerNombreModeloSeleccionado] = useState("");

  // Estados para imágenes
  const [imagenes, establecerImagenes] = useState<(File | null)[]>([null, null, null]);
  const [vistasPrevia, establecerVistasPrevia] = useState<(string | null)[]>([null, null, null]);

  // Datos del formulario
  const [datosFormulario, establecerDatosFormulario] = useState({
    usuario: 0,
    marca: 0,
    modelo: 0,
    año: "",
    precio: "",
    tipo_transmision: "",
    tipo_combustible: "",
    kilometraje: "",
    descripcion: "",
    estado: "en_revision",
    tipo_vehiculo: "",
    ubicacion: "",
  });

  useEffect(() => {
    if (!estaCargando && !estaAutenticado) {
      router.push("/login");
    }
  }, [estaAutenticado, estaCargando, router]);

  useEffect(() => {
    if (usuario?.id) {
      establecerDatosFormulario(prev => ({
        ...prev,
        usuario: Number(usuario.id),
      }));
    }
  }, [usuario]);

  // Cargar marcas al montar
  useEffect(() => {
    const cargarMarcas = async () => {
      try {
        const marcasData = await servicioMarca.getAll();
        establecerMarcas(marcasData);
      } catch (error) {
        console.error("Error al cargar marcas:", error);
      }
    };
    cargarMarcas();
  }, []);

  // Cargar modelos cuando se selecciona una marca
  useEffect(() => {
    const cargarModelos = async () => {
      if (marcaSeleccionada) {
        try {
          // Limpiar modelos antes de cargar nuevos
          establecerModelos([]);
          const modelosData = await servicioModelo.getByBrand(marcaSeleccionada);
          establecerModelos(modelosData);
        } catch (error) {
          console.error("Error al cargar modelos:", error);
          establecerModelos([]);
        }
      } else {
        establecerModelos([]);
      }
    };
    cargarModelos();
  }, [marcaSeleccionada]);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    establecerDatosFormulario({
      ...datosFormulario,
      [name]: value,
    });

    // Si cambia la marca, actualizar modelos
    if (name === "marca") {
      establecerMarcaSeleccionada(Number(value) || null);
      establecerDatosFormulario(prev => ({
        ...prev,
        modelo: 0,
      }));
      establecerNombreModeloSeleccionado("");
      establecerBuscandoModelo("");
    }
  };

  const manejarSeleccionarImagen = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) {
      // Validar tipo de archivo
      if (!archivo.type.startsWith('image/')) {
        establecerError('Por favor selecciona un archivo de imagen válido');
        return;
      }
      // Validar tamaño (max 5MB)
      if (archivo.size > 5 * 1024 * 1024) {
        establecerError('La imagen no debe superar los 5MB');
        return;
      }

      // Actualizar array de imágenes
      const nuevasImagenes = [...imagenes];
      nuevasImagenes[index] = archivo;
      establecerImagenes(nuevasImagenes);
      establecerError("");

      // Crear vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        const nuevasVistasPrevia = [...vistasPrevia];
        nuevasVistasPrevia[index] = reader.result as string;
        establecerVistasPrevia(nuevasVistasPrevia);
      };
      reader.readAsDataURL(archivo);
    }
  };

  const eliminarImagen = (index: number) => {
    const nuevasImagenes = [...imagenes];
    nuevasImagenes[index] = null;
    establecerImagenes(nuevasImagenes);

    const nuevasVistasPrevia = [...vistasPrevia];
    nuevasVistasPrevia[index] = null;
    establecerVistasPrevia(nuevasVistasPrevia);
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevenir múltiples envíos
    if (guardando) {
      return;
    }
    
    establecerGuardando(true);
    establecerError("");
    establecerExito(false);

    try {
      // Validar campos requeridos
      if (!datosFormulario.marca || !datosFormulario.modelo) {
        throw new Error("Debes seleccionar una marca y modelo");
      }
      if (!datosFormulario.año || !datosFormulario.precio) {
        throw new Error("El año y precio son requeridos");
      }
      if (!datosFormulario.tipo_transmision || !datosFormulario.tipo_combustible || !datosFormulario.estado || !datosFormulario.tipo_vehiculo) {
        throw new Error("Todos los campos de selección son requeridos");
      }

      // Crear vehículo
      const datosVehiculo: SolicitudVehiculo = {
        usuario: datosFormulario.usuario,
        marca: datosFormulario.marca,
        modelo: datosFormulario.modelo,
        año: Number(datosFormulario.año),
        precio: Number(datosFormulario.precio),
        tipo_transmision: datosFormulario.tipo_transmision,
        tipo_combustible: datosFormulario.tipo_combustible,
        kilometraje: datosFormulario.kilometraje ? Number(datosFormulario.kilometraje) : undefined,
        descripcion: datosFormulario.descripcion || undefined,
        estado: datosFormulario.estado,
        tipo_vehiculo: datosFormulario.tipo_vehiculo,
        ubicacion: datosFormulario.ubicacion,
      };

      const vehiculoCreado = await servicioCreacionVehiculo.create(datosVehiculo);

      // Subir imágenes si hay
      const imagenesFiltradas = imagenes.filter(img => img !== null && img !== undefined) as File[];
      if (imagenesFiltradas.length > 0) {
        try {
          await Promise.all(
            imagenesFiltradas.map((imagen) =>
              servicioVehiculoFoto.upload(vehiculoCreado.id, imagen)
            )
          );
        } catch (uploadError) {
          console.error('Error al subir imágenes:', uploadError);
          establecerError("Vehículo creado pero hubo un error al subir las imágenes. Puedes editarlas más tarde.");
        }
      }

      establecerExito(true);
      
      // Mantener el botón deshabilitado durante la redirección para evitar clics accidentales
      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push(`/catalogo/${vehiculoCreado.id}`);
      }, 2000);
    } catch (error) {
      console.error("Error al crear vehículo:", error);
      establecerError(error instanceof Error ? error.message : "Error al crear el vehículo");
      // Solo habilitar el botón si hay un error, después de un pequeño delay
      setTimeout(() => {
        establecerGuardando(false);
      }, 500);
    }
    // No resetear guardando en finally si fue exitoso, para mantener deshabilitado durante redirección
  };

  // Filtrar marcas y modelos según búsqueda
  // Filtrar marcas por búsqueda, pero si no hay búsqueda mostrar todas las marcas
  const marcasFiltradas = buscandoMarca
    ? marcas.filter(marca =>
        marca.nombre.toLowerCase().includes(buscandoMarca.toLowerCase())
      )
    : marcas;
  // Filtrar modelos por marca seleccionada y por búsqueda
  const modelosFiltrados = modelos
    .filter(modelo => marcaSeleccionada ? modelo.marca === marcaSeleccionada : false)
    .filter(modelo =>
      buscandoModelo
        ? modelo.nombre.toLowerCase().includes(buscandoModelo.toLowerCase())
        : true
    );

  if (estaCargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!estaAutenticado || !usuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white py-8 px-6 shadow-lg border-2 border-red-700 rounded-lg sm:px-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Crear Vehículo
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Completa la información de tu vehículo para publicarlo
            </p>
          </div>

          <form onSubmit={manejarEnvio} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {exito && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                ¡Vehículo creado exitosamente! Redirigiendo...
              </div>
            )}

            {/* Marca y Modelo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="marca" className="block text-sm font-medium text-gray-700 mb-2">
                  Marca
                </label>
                <div className="relative">
                  <input
                    id="marca"
                    type="text"
                    autoComplete="off"
                    value={nombreMarcaSeleccionada || buscandoMarca}
                    onChange={(e) => {
                      establecerBuscandoMarca(e.target.value);
                      establecerMostrarDropdownMarca(true);
                      if (nombreMarcaSeleccionada) {
                        establecerNombreMarcaSeleccionada("");
                        establecerDatosFormulario(prev => ({ ...prev, marca: 0 }));
                        establecerMarcaSeleccionada(null);
                      }
                    }}
                    onFocus={() => {
                      establecerBuscandoMarca("");
                      establecerMostrarDropdownMarca(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => establecerMostrarDropdownMarca(false), 200);
                    }}
                    placeholder="Buscar marca"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {mostrarDropdownMarca && marcasFiltradas.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {marcasFiltradas.map((marca) => (
                        <button
                          key={marca.id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            establecerDatosFormulario(prev => ({ ...prev, marca: marca.id, modelo: 0, tipo_vehiculo: "" }));
                            establecerMarcaSeleccionada(marca.id);
                            establecerNombreMarcaSeleccionada(marca.nombre);
                            establecerBuscandoMarca("");
                            establecerMostrarDropdownMarca(false);
                            // Limpiar modelo seleccionado y modelos cuando se cambia la marca
                            establecerNombreModeloSeleccionado("");
                            establecerBuscandoModelo("");
                            establecerModelos([]);
                          }}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          {marca.nombre}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="modelo" className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo
                </label>
                <div className="relative">
                  <input
                    id="modelo"
                    type="text"
                    autoComplete="off"
                    value={nombreModeloSeleccionado || buscandoModelo}
                    onChange={(e) => {
                      establecerBuscandoModelo(e.target.value);
                      establecerMostrarDropdownModelo(true);
                      if (nombreModeloSeleccionado) {
                        establecerNombreModeloSeleccionado("");
                        establecerDatosFormulario(prev => ({ ...prev, modelo: 0 }));
                      }
                    }}
                    onFocus={() => {
                      if (marcaSeleccionada) {
                        establecerBuscandoModelo("");
                        establecerMostrarDropdownModelo(true);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => establecerMostrarDropdownModelo(false), 200);
                    }}
                    placeholder="Buscar modelo"
                    disabled={!marcaSeleccionada}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {mostrarDropdownModelo && marcaSeleccionada && modelosFiltrados.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {modelosFiltrados.map((modelo) => (
                        <button
                          key={modelo.id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            establecerDatosFormulario(prev => ({ 
                              ...prev, 
                              modelo: modelo.id,
                              tipo_vehiculo: modelo.tipo_vehiculo_descripcion
                            }));
                            establecerNombreModeloSeleccionado(modelo.nombre);
                            establecerBuscandoModelo("");
                            establecerMostrarDropdownModelo(false);
                          }}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          {modelo.nombre}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Año y Precio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="año" className="block text-sm font-medium text-gray-700 mb-2">
                  Año
                </label>
                <input
                  id="año"
                  name="año"
                  type="number"
                  value={datosFormulario.año}
                  onChange={manejarCambio}
                  placeholder="Año del vehículo"
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">
                  Precio
                </label>
                <input
                  id="precio"
                  name="precio"
                  type="number"
                  value={datosFormulario.precio}
                  onChange={manejarCambio}
                  placeholder="Precio del vehículo"
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Tipo Transmisión y Tipo Combustible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tipo_transmision" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Transmisión
                </label>
                <select
                  id="tipo_transmision"
                  name="tipo_transmision"
                  value={datosFormulario.tipo_transmision}
                  onChange={manejarCambio}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatica">Automática</option>
                  <option value="CVT">CVT</option>
                  <option value="Semi-automatica">Semi-automática</option>
                </select>
              </div>

              <div>
                <label htmlFor="tipo_combustible" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Combustible
                </label>
                <select
                  id="tipo_combustible"
                  name="tipo_combustible"
                  value={datosFormulario.tipo_combustible}
                  onChange={manejarCambio}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diesel">Diésel</option>
                  <option value="Electrico">Eléctrico</option>
                  <option value="Hibrido">Híbrido</option>
                  <option value="Gas">Gas</option>
                </select>
              </div>
            </div>

            {/* Estado y Tipo Vehículo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={datosFormulario.estado}
                  disabled
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-gray-100 cursor-not-allowed"
                >
                  <option value="en_revision">En Revisión</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Los vehículos nuevos se envían automáticamente a revisión
                </p>
              </div>

              <div>
                <label htmlFor="tipo_vehiculo" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Vehículo
                </label>
                <select
                  id="tipo_vehiculo"
                  name="tipo_vehiculo"
                  value={datosFormulario.tipo_vehiculo}
                  disabled
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-gray-100 cursor-not-allowed"
                >
                  <option value="">{datosFormulario.tipo_vehiculo || "Se asignará automáticamente"}</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  El tipo de vehículo se selecciona automáticamente según el modelo
                </p>
              </div>
            </div>

            {/* Kilometraje y Ubicación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="kilometraje" className="block text-sm font-medium text-gray-700 mb-2">
                  Kilometraje
                </label>
                <input
                  id="kilometraje"
                  name="kilometraje"
                  type="number"
                  value={datosFormulario.kilometraje}
                  onChange={manejarCambio}
                  placeholder="Kilometraje del vehículo"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación
                </label>
                <input
                  id="ubicacion"
                  name="ubicacion"
                  type="text"
                  value={datosFormulario.ubicacion}
                  onChange={manejarCambio}
                  placeholder="Ubicación del vehículo"
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows={4}
                value={datosFormulario.descripcion}
                onChange={manejarCambio}
                placeholder="Descripción del vehículo"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Imágenes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Imágenes del Vehículo (máximo 3)
              </label>
              <div className="space-y-4">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <label className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                        <span className="text-sm font-medium">Seleccionar archivo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => manejarSeleccionarImagen(index, e)}
                          className="hidden"
                        />
                      </label>
                      <span className="text-gray-600 text-sm flex-1">
                        {imagenes[index] ? imagenes[index]!.name : "Sin archivos seleccionados"}
                      </span>
                      {vistasPrevia[index] && (
                        <button
                          type="button"
                          onClick={() => eliminarImagen(index)}
                          className="text-red-600 hover:text-red-700"
                          title="Eliminar imagen"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {vistasPrevia[index] && (
                      <div className="mt-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={vistasPrevia[index]!}
                          alt={`Vista previa ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB por imagen
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={guardando}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando || exito}
                className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {guardando ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Guardando...
                  </>
                ) : exito ? (
                  "¡Vehículo Creado!"
                ) : (
                  "Crear Vehículo"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

