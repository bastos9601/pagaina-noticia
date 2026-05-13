import { notFound } from 'next/navigation'
import Link from 'next/link'
import Encabezado from '@/componentes/Encabezado'
import PiePagina from '@/componentes/PiePagina'
import TarjetaNoticia from '@/componentes/TarjetaNoticia'
import { obtenerCategoriaPorSlug, obtenerCategorias } from '@/servicios/categorias'
import { obtenerNoticias } from '@/servicios/noticias'
import type { Metadata } from 'next'

export const revalidate = 30

interface Props {
  params: { slug: string }
  searchParams: { pagina?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const categoria = await obtenerCategoriaPorSlug(slug)
  
  if (!categoria) {
    return {
      title: 'Categoría no encontrada',
    }
  }

  return {
    title: `${categoria.nombre} - Noticias Live`,
    description: categoria.descripcion || `Noticias de ${categoria.nombre}`,
  }
}

export default async function PaginaCategoria({ params, searchParams }: Props) {
  const { slug } = await params
  const paginaActual = parseInt(searchParams.pagina || '1')
  
  const [categoria, categorias] = await Promise.all([
    obtenerCategoriaPorSlug(slug),
    obtenerCategorias(),
  ])
  
  if (!categoria) {
    notFound()
  }

  const { datos: noticias, paginacion } = await obtenerNoticias(
    paginaActual,
    12,
    categoria.id
  )

  return (
    <>
      <Encabezado />
      
      <main className="min-h-screen">
        <div className="container px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{categoria.nombre}</h1>
            {categoria.descripcion && (
              <p className="text-texto-secundario">{categoria.descripcion}</p>
            )}
          </div>

          {/* Categorías */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
            <Link
              href="/noticias"
              className="px-4 py-2 bg-fondo-secundario text-texto-secundario rounded-full whitespace-nowrap hover:bg-fondo-terciario transition-colors"
            >
              Todas
            </Link>
            {categorias.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  cat.id === categoria.id
                    ? 'bg-primario text-white'
                    : 'bg-fondo-secundario text-texto-secundario hover:bg-fondo-terciario'
                }`}
              >
                {cat.nombre}
              </Link>
            ))}
          </div>

          {/* Noticias */}
          {noticias.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {noticias.map((noticia) => (
                  <TarjetaNoticia key={noticia.id} noticia={noticia} />
                ))}
              </div>

              {/* Paginación */}
              {paginacion.paginas > 1 && (
                <div className="flex justify-center gap-2">
                  {paginaActual > 1 && (
                    <Link
                      href={`/categoria/${params.slug}?pagina=${paginaActual - 1}`}
                      className="px-4 py-2 bg-fondo-secundario rounded-lg hover:bg-fondo-terciario transition-colors"
                    >
                      Anterior
                    </Link>
                  )}
                  
                  <span className="px-4 py-2 bg-primario rounded-lg">
                    {paginaActual} / {paginacion.paginas}
                  </span>
                  
                  {paginaActual < paginacion.paginas && (
                    <Link
                      href={`/categoria/${params.slug}?pagina=${paginaActual + 1}`}
                      className="px-4 py-2 bg-fondo-secundario rounded-lg hover:bg-fondo-terciario transition-colors"
                    >
                      Siguiente
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-texto-secundario text-lg">
                No hay noticias en esta categoría
              </p>
            </div>
          )}
        </div>
      </main>

      <PiePagina />
    </>
  )
}
