import { notFound } from 'next/navigation'
import Link from 'next/link'
import Encabezado from '@/componentes/Encabezado'
import PiePagina from '@/componentes/PiePagina'
import ReproductorVideo from '@/componentes/ReproductorVideo'
import TarjetaCanal from '@/componentes/TarjetaCanal'
import { obtenerCanalPorId, obtenerCanales } from '@/servicios/canales'
import type { Metadata } from 'next'

export const revalidate = 30

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const canal = await obtenerCanalPorId(id)
  
  if (!canal) {
    return {
      title: 'Canal no encontrado',
    }
  }

  return {
    title: `${canal.nombre} - En Vivo | Noticias Live`,
    description: canal.descripcion,
  }
}

export default async function PaginaDetalleCanal({ params }: Props) {
  const { id } = await params
  const [canal, otrosCanales] = await Promise.all([
    obtenerCanalPorId(id),
    obtenerCanales(true),
  ])
  
  if (!canal) {
    notFound()
  }

  const canalesFiltrados = otrosCanales.filter(c => c.id !== canal.id).slice(0, 4)

  return (
    <>
      <Encabezado />
      
      <main className="min-h-screen bg-fondo">
        <div className="container px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-texto-secundario mb-6">
            <Link href="/" className="hover:text-primario transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/canales" className="hover:text-primario transition-colors">Canales</Link>
            <span>/</span>
            <span className="text-texto-primario">{canal.nombre}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reproductor Principal */}
            <div className="lg:col-span-2">
              {/* Badge EN VIVO */}
              {canal.activo && (
                <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-semibold mb-4 animate-pulse">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                  EN VIVO
                </div>
              )}

              {/* Título y descripción */}
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-texto-primario">
                  {canal.nombre}
                </h1>
                <p className="text-texto-secundario text-lg leading-relaxed">
                  {canal.descripcion}
                </p>
              </div>

              {/* Reproductor */}
              <div className="bg-black rounded-xl overflow-hidden shadow-2xl mb-6">
                <ReproductorVideo canal={canal} />
              </div>

              {/* Información adicional */}
              <div className="bg-fondo-secundario rounded-xl p-6 border border-fondo-terciario">
                <h3 className="text-lg font-semibold mb-4 text-texto-primario">
                  Información del Canal
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-fondo rounded-lg p-4">
                    <div className="text-texto-terciario text-sm mb-1">Tipo</div>
                    <div className="text-texto-primario font-semibold uppercase">
                      {canal.tipo}
                    </div>
                  </div>
                  
                  <div className="bg-fondo rounded-lg p-4">
                    <div className="text-texto-terciario text-sm mb-1">Categoría</div>
                    <div className="text-texto-primario font-semibold">
                      {canal.categoria || 'General'}
                    </div>
                  </div>
                  
                  <div className="bg-fondo rounded-lg p-4">
                    <div className="text-texto-terciario text-sm mb-1">Estado</div>
                    <div className={`font-semibold ${canal.activo ? 'text-green-500' : 'text-gray-500'}`}>
                      {canal.activo ? '● En línea' : '○ Fuera de línea'}
                    </div>
                  </div>
                </div>

                {/* Botones de compartir */}
                <div className="mt-6 pt-6 border-t border-fondo-terciario">
                  <h4 className="text-sm font-semibold mb-3 text-texto-secundario">
                    Compartir canal
                  </h4>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-fondo hover:bg-fondo-terciario text-texto-primario px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                      Facebook
                    </button>
                    <button className="flex-1 bg-fondo hover:bg-fondo-terciario text-texto-primario px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                      Twitter
                    </button>
                    <button className="flex-1 bg-fondo hover:bg-fondo-terciario text-texto-primario px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Otros Canales */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-fondo-secundario rounded-xl p-6 border border-fondo-terciario">
                  <h2 className="text-xl font-bold mb-6 text-texto-primario flex items-center gap-2">
                    <span className="text-2xl">📺</span>
                    Otros Canales en Vivo
                  </h2>
                  
                  <div className="space-y-4">
                    {canalesFiltrados.map((c) => (
                      <Link
                        key={c.id}
                        href={`/canales/${c.id}`}
                        className="block bg-fondo rounded-lg p-4 hover:bg-fondo-terciario transition-all duration-300 border border-transparent hover:border-primario group"
                      >
                        <div className="flex items-start gap-3">
                          {/* Logo o inicial */}
                          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-fondo-terciario">
                            {c.logo ? (
                              <img
                                src={c.logo}
                                alt={c.nombre}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primario">
                                <span className="text-white font-bold text-xl">
                                  {c.nombre.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-texto-primario group-hover:text-primario transition-colors truncate mb-1">
                              {c.nombre}
                            </h3>
                            <p className="text-sm text-texto-secundario line-clamp-2 mb-2">
                              {c.descripcion}
                            </p>
                            
                            {/* Estado y categoría */}
                            <div className="flex items-center gap-2 text-xs">
                              {c.activo && (
                                <span className="flex items-center gap-1 text-red-500 font-semibold">
                                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                  EN VIVO
                                </span>
                              )}
                              {c.categoria && (
                                <>
                                  {c.activo && <span className="text-texto-terciario">•</span>}
                                  <span className="text-texto-terciario">{c.categoria}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Ver todos */}
                  <Link
                    href="/canales"
                    className="block mt-6 text-center bg-primario hover:bg-primario-oscuro text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Ver Todos los Canales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PiePagina />
    </>
  )
}
