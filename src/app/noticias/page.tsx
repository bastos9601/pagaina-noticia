import Encabezado from '@/componentes/Encabezado'
import PiePagina from '@/componentes/PiePagina'
import TarjetaNoticia from '@/componentes/TarjetaNoticia'
import BarraBusqueda from '@/componentes/BarraBusqueda'
import { obtenerNoticias, buscarNoticias } from '@/servicios/noticias'
import { obtenerCategorias } from '@/servicios/categorias'
import Link from 'next/link'

export const revalidate = 30

interface Props {
  searchParams: { buscar?: string; pagina?: string }
}

export default async function PaginaNoticias({ searchParams }: Props) {
  const terminoBusqueda = searchParams.buscar
  const paginaActual = parseInt(searchParams.pagina || '1')

  const [categorias, resultado] = await Promise.all([
    obtenerCategorias(),
    terminoBusqueda
      ? buscarNoticias(terminoBusqueda)
      : obtenerNoticias(paginaActual, 12),
  ])

  const noticias = Array.isArray(resultado) ? resultado : resultado.datos
  const paginacion = Array.isArray(resultado) ? null : resultado.paginacion

  return (
    <>
      <Encabezado />
      
      <main className="min-h-screen">
        <div className="container px-4 py-8">
          {/* Búsqueda */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-6">
              {terminoBusqueda ? `Resultados para "${terminoBusqueda}"` : 'Todas las Noticias'}
            </h1>
            <BarraBusqueda />
          </div>

          {/* Categorías */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
            <Link
              href="/noticias"
              className="px-4 py-2 bg-primario text-white rounded-full whitespace-nowrap"
            >
              Todas
            </Link>
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/categoria/${categoria.slug}`}
                className="px-4 py-2 bg-fondo-secundario text-texto-secundario rounded-full whitespace-nowrap hover:bg-fondo-terciario transition-colors"
              >
                {categoria.nombre}
              </Link>
            ))}
          </div>

          {/* Grid de noticias */}
          {noticias.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {noticias.map((noticia) => (
                  <TarjetaNoticia key={noticia.id} noticia={noticia} />
                ))}
              </div>

              {/* Paginación */}
              {paginacion && paginacion.paginas > 1 && (
                <div className="flex justify-center gap-2">
                  {paginaActual > 1 && (
                    <Link
                      href={`/noticias?pagina=${paginaActual - 1}`}
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
                      href={`/noticias?pagina=${paginaActual + 1}`}
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
                No se encontraron noticias
              </p>
            </div>
          )}
        </div>
      </main>

      <PiePagina />
    </>
  )
}
