import Encabezado from '@/componentes/Encabezado'
import PiePagina from '@/componentes/PiePagina'
import TarjetaNoticia from '@/componentes/TarjetaNoticia'
import BarraBusqueda from '@/componentes/BarraBusqueda'
import { busquedaGlobal } from '@/servicios/noticias'
import Link from 'next/link'

export const revalidate = 0

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function PaginaBusqueda({ searchParams }: Props) {
  const { q } = await searchParams
  const termino = q || ''
  
  if (!termino) {
    return (
      <>
        <Encabezado />
        <main className="min-h-screen">
          <div className="container px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Buscar</h1>
            <BarraBusqueda />
            <p className="text-texto-secundario mt-8 text-center">
              Ingresa un término de búsqueda para encontrar noticias, canales y categorías
            </p>
          </div>
        </main>
        <PiePagina />
      </>
    )
  }

  const resultados = await busquedaGlobal(termino)
  const todasNoticias = [...resultados.noticias, ...resultados.noticiasPorCategoria]
  const noticiasUnicas = Array.from(
    new Map(todasNoticias.map(n => [n.id, n])).values()
  )

  return (
    <>
      <Encabezado />
      
      <main className="min-h-screen">
        <div className="container px-4 py-8">
          {/* Búsqueda */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Resultados para "{termino}"
            </h1>
            <p className="text-texto-secundario mb-6">
              {resultados.total} resultados encontrados
            </p>
            <BarraBusqueda />
          </div>

          {resultados.total === 0 ? (
            <div className="text-center py-12">
              <p className="text-texto-secundario text-lg">
                No se encontraron resultados para &quot;{termino}&quot;
              </p>
              <p className="text-texto-secundario mt-2">
                Intenta con otras palabras clave
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Categorías */}
              {resultados.categorias.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>🏷️</span>
                    Categorías ({resultados.categorias.length})
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {resultados.categorias.map((categoria) => (
                      <Link
                        key={categoria.id}
                        href={`/categoria/${categoria.slug}`}
                        className="px-6 py-3 bg-fondo-secundario text-texto-primario rounded-lg hover:bg-primario hover:text-white transition-colors"
                      >
                        {categoria.nombre}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Canales */}
              {resultados.canales.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>📺</span>
                    Canales en Vivo ({resultados.canales.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resultados.canales.map((canal) => (
                      <Link
                        key={canal.id}
                        href="/canales"
                        className="bg-fondo-secundario rounded-lg p-4 hover:bg-fondo-terciario transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {canal.logo_url && (
                            <img
                              src={canal.logo_url}
                              alt={canal.nombre}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">{canal.nombre}</h3>
                            {canal.descripcion && (
                              <p className="text-texto-secundario text-sm line-clamp-2">
                                {canal.descripcion}
                              </p>
                            )}
                            <span className="inline-flex items-center gap-1 mt-2 text-xs text-primario">
                              <span className="w-2 h-2 bg-primario rounded-full animate-pulse"></span>
                              En vivo
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Noticias */}
              {noticiasUnicas.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>📰</span>
                    Noticias ({noticiasUnicas.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {noticiasUnicas.map((noticia) => (
                      <TarjetaNoticia key={noticia.id} noticia={noticia} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>

      <PiePagina />
    </>
  )
}
