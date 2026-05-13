import Encabezado from '@/componentes/Encabezado'
import PiePagina from '@/componentes/PiePagina'
import TarjetaNoticia from '@/componentes/TarjetaNoticia'
import BarraBusqueda from '@/componentes/BarraBusqueda'
import BannerPublicidad from '@/componentes/BannerPublicidad'
import { obtenerNoticiasDestacadas, obtenerNoticias } from '@/servicios/noticias'
import { obtenerCategorias } from '@/servicios/categorias'
import { obtenerPublicidad } from '@/servicios/publicidad'
import Link from 'next/link'

export const revalidate = 60 // Revalidar cada 60 segundos

export default async function PaginaInicio() {
  const [destacadas, { datos: noticias }, categorias, bannersLaterales, bannersSuperior] = await Promise.all([
    obtenerNoticiasDestacadas(6),
    obtenerNoticias(1, 8),
    obtenerCategorias(),
    obtenerPublicidad('lateral'),
    obtenerPublicidad('superior'),
  ])

  return (
    <>
      <Encabezado />
      
      <main className="min-h-screen">
        {/* Banner Superior */}
        {bannersSuperior.length > 0 && (
          <div className="bg-fondo-secundario border-b border-fondo-terciario">
            <div className="container px-4 py-4">
              <BannerPublicidad 
                publicidad={bannersSuperior[0]} 
                className="h-24 md:h-32"
              />
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-fondo-secundario to-fondo py-12">
          <div className="container px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Noticias en <span className="text-primario">Tiempo Real</span>
              </h1>
              <p className="text-texto-secundario text-lg max-w-2xl mx-auto">
                Mantente informado con las últimas noticias y canales en vivo
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <BarraBusqueda />
            </div>
          </div>
        </section>

        {/* Categorías */}
        <section className="container px-4 py-8">
          <div className="flex gap-3 overflow-x-auto pb-4">
            <Link
              href="/noticias"
              className="px-4 py-2 bg-primario text-white rounded-full whitespace-nowrap hover:bg-primario-oscuro transition-colors"
            >
              Todas
            </Link>
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/categoria/${categoria.slug}`}
                className="px-4 py-2 bg-fondo-secundario text-texto-secundario rounded-full whitespace-nowrap hover:bg-fondo-terciario hover:text-texto-primario transition-colors"
              >
                {categoria.nombre}
              </Link>
            ))}
          </div>
        </section>

        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Contenido Principal */}
            <div className="lg:col-span-3">
              {/* Noticias Destacadas */}
              {destacadas.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Noticias Destacadas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {destacadas.map((noticia) => (
                      <TarjetaNoticia key={noticia.id} noticia={noticia} />
                    ))}
                  </div>
                </section>
              )}

              {/* Últimas Noticias */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Últimas Noticias</h2>
                  <Link
                    href="/noticias"
                    className="text-primario hover:text-primario-claro transition-colors"
                  >
                    Ver todas →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {noticias.map((noticia) => (
                    <TarjetaNoticia key={noticia.id} noticia={noticia} />
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar con Publicidad */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Publicidad Lateral */}
                {bannersLaterales.map((banner) => (
                  <BannerPublicidad 
                    key={banner.id}
                    publicidad={banner} 
                    className="h-64"
                  />
                ))}

                {/* CTA Canales */}
                <div className="bg-gradient-to-br from-primario to-primario-oscuro rounded-xl p-6 text-center">
                  <div className="text-4xl mb-3">📺</div>
                  <h3 className="text-xl font-bold mb-2">Canales en Vivo</h3>
                  <p className="text-sm mb-4 opacity-90">
                    Transmisiones 24/7
                  </p>
                  <Link
                    href="/canales"
                    className="inline-block bg-white text-primario px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Ver Canales
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* CTA Canales en Vivo (Mobile) */}
        <section className="container px-4 py-12 lg:hidden">
          <div className="bg-gradient-to-r from-primario to-primario-oscuro rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Canales en Vivo</h2>
            <p className="text-lg mb-6 opacity-90">
              Mira transmisiones en vivo de los principales canales de noticias
            </p>
            <Link
              href="/canales"
              className="inline-block bg-white text-primario px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Ver Canales en Vivo
            </Link>
          </div>
        </section>
      </main>

      <PiePagina />
    </>
  )
}
