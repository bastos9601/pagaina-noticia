import Link from 'next/link'
import Image from 'next/image'
import { Noticia } from '@/tipos'
import { formatearFechaRelativa } from '@/lib/utilidades'
import { obtenerImagenNoticia } from '@/lib/video-utils'

interface Props {
  noticia: Noticia
  destacada?: boolean
}

export default function TarjetaNoticia({ noticia, destacada = false }: Props) {
  const imagenMostrar = obtenerImagenNoticia(
    noticia.imagen, 
    noticia.video_url, 
    noticia.video_tipo,
    noticia.video_thumbnail
  )

  return (
    <Link
      href={`/noticias/${noticia.slug}`}
      className={`group block bg-fondo-secundario rounded-lg overflow-hidden hover:ring-2 hover:ring-primario transition-all duration-300 ${
        destacada ? 'col-span-2 row-span-2' : ''
      }`}
    >
      <div className={`relative ${destacada ? 'h-96' : 'h-48'} overflow-hidden`}>
        {imagenMostrar ? (
          <Image
            src={imagenMostrar}
            alt={noticia.titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-fondo-terciario flex items-center justify-center">
            <svg className="w-16 h-16 text-texto-terciario" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
        {noticia.video_url && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <div className="w-16 h-16 bg-primario/90 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}
        {noticia.destacada && (
          <div className="absolute top-4 left-4 bg-primario text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
            Destacada
          </div>
        )}
        {noticia.categoria && (
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-10">
            {noticia.categoria.nombre}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className={`font-bold text-texto-primario group-hover:text-primario transition-colors ${
          destacada ? 'text-2xl mb-3' : 'text-lg mb-2'
        }`}>
          {noticia.titulo}
        </h3>
        
        <div className="flex items-center gap-3 text-sm text-texto-secundario">
          <span>{formatearFechaRelativa(noticia.fecha_creacion)}</span>
          <span>•</span>
          <span>{noticia.vistas || 0} vistas</span>
        </div>
      </div>
    </Link>
  )
}
