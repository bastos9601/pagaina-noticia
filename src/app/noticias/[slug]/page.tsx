import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Encabezado from '@/componentes/Encabezado'
import PiePagina from '@/componentes/PiePagina'
import TarjetaNoticia from '@/componentes/TarjetaNoticia'
import ReproductorVideoNoticia from '@/componentes/ReproductorVideoNoticia'
import { obtenerNoticiaPorSlug, obtenerNoticiasRelacionadas } from '@/servicios/noticias'
import { formatearFecha } from '@/lib/utilidades'
import { obtenerImagenNoticia } from '@/lib/video-utils'
import type { Metadata } from 'next'

export const revalidate = 60

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const noticia = await obtenerNoticiaPorSlug(slug)
  
  if (!noticia) {
    return {
      title: 'Noticia no encontrada',
    }
  }

  return {
    title: `${noticia.titulo} - Noticias Live`,
    description: noticia.contenido?.blocks?.[0]?.data?.text || noticia.titulo,
    openGraph: {
      title: noticia.titulo,
      description: noticia.contenido?.blocks?.[0]?.data?.text || noticia.titulo,
      images: [noticia.imagen],
      type: 'article',
      publishedTime: noticia.fecha_creacion,
    },
  }
}

export default async function PaginaDetalleNoticia({ params }: Props) {
  const { slug } = await params
  const noticia = await obtenerNoticiaPorSlug(slug)
  
  if (!noticia) {
    notFound()
  }

  const relacionadas = await obtenerNoticiasRelacionadas(
    noticia.categoria_id,
    noticia.id,
    4
  )

  // Para la página de detalle, solo mostrar imagen si existe (no usar miniatura)
  const imagenMostrar = noticia.imagen

  return (
    <>
      <Encabezado />
      
      <main className="min-h-screen">
        <article className="container px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-texto-secundario mb-6">
            <Link href="/" className="hover:text-primario">Inicio</Link>
            <span>/</span>
            <Link href="/noticias" className="hover:text-primario">Noticias</Link>
            {noticia.categoria && (
              <>
                <span>/</span>
                <Link
                  href={`/categoria/${noticia.categoria.slug}`}
                  className="hover:text-primario"
                >
                  {noticia.categoria.nombre}
                </Link>
              </>
            )}
          </nav>

          <div className="max-w-4xl mx-auto">
            {/* Categoría */}
            {noticia.categoria && (
              <Link
                href={`/categoria/${noticia.categoria.slug}`}
                className="inline-block bg-primario text-white px-4 py-1 rounded-full text-sm font-semibold mb-4"
              >
                {noticia.categoria.nombre}
              </Link>
            )}

            {/* Título */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {noticia.titulo}
            </h1>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-texto-secundario mb-8">
              {noticia.autor && (
                <span className="font-semibold">{noticia.autor.nombre}</span>
              )}
              <span>•</span>
              <time>{formatearFecha(noticia.fecha_creacion)}</time>
              <span>•</span>
              <span>{noticia.vistas} vistas</span>
            </div>

            {/* Imagen principal */}
            {imagenMostrar && (
              <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden">
                <Image
                  src={imagenMostrar}
                  alt={noticia.titulo}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Contenido */}
            <div className="prose prose-invert prose-lg max-w-none mb-8">
              {noticia.contenido?.blocks?.map((block: any, index: number) => {
                switch (block.type) {
                  case 'header':
                    const HeaderTag = `h${block.data.level}` as keyof JSX.IntrinsicElements
                    return (
                      <HeaderTag key={index} className="font-bold mt-8 mb-4">
                        {block.data.text}
                      </HeaderTag>
                    )
                  
                  case 'paragraph':
                    return (
                      <p key={index} className="mb-4 text-texto-secundario leading-relaxed">
                        {block.data.text}
                      </p>
                    )
                  
                  case 'list':
                    const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul'
                    return (
                      <ListTag key={index} className="mb-4 ml-6">
                        {block.data.items.map((item: string, i: number) => (
                          <li key={i} className="mb-2 text-texto-secundario">
                            {item}
                          </li>
                        ))}
                      </ListTag>
                    )
                  
                  case 'image':
                    return (
                      <div key={index} className="my-8">
                        <img
                          src={block.data.file.url}
                          alt={block.data.caption || ''}
                          className="w-full rounded-lg"
                        />
                        {block.data.caption && (
                          <p className="text-sm text-texto-terciario text-center mt-2">
                            {block.data.caption}
                          </p>
                        )}
                      </div>
                    )
                  
                  default:
                    return null
                }
              })}
            </div>

            {/* Video (si existe) */}
            {noticia.video_url && noticia.video_tipo && (
              <div className="mb-8">
                <ReproductorVideoNoticia
                  videoUrl={noticia.video_url}
                  videoTipo={noticia.video_tipo}
                  titulo={noticia.titulo}
                />
              </div>
            )}

            {/* Compartir */}
            <div className="mt-12 pt-8 border-t border-fondo-terciario">
              <h3 className="text-lg font-semibold mb-4">Compartir</h3>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-fondo-secundario rounded-lg hover:bg-fondo-terciario transition-colors">
                  Facebook
                </button>
                <button className="px-4 py-2 bg-fondo-secundario rounded-lg hover:bg-fondo-terciario transition-colors">
                  Twitter
                </button>
                <button className="px-4 py-2 bg-fondo-secundario rounded-lg hover:bg-fondo-terciario transition-colors">
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Noticias relacionadas */}
        {relacionadas.length > 0 && (
          <section className="container px-4 py-12 border-t border-fondo-terciario">
            <h2 className="text-2xl font-bold mb-6">Noticias Relacionadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relacionadas.map((noticia) => (
                <TarjetaNoticia key={noticia.id} noticia={noticia} />
              ))}
            </div>
          </section>
        )}
      </main>

      <PiePagina />
    </>
  )
}
