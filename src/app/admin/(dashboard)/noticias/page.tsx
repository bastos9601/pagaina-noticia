'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { obtenerNoticias, eliminarNoticia } from '@/servicios/noticias'
import { Noticia } from '@/tipos'
import { formatearFechaRelativa } from '@/lib/utilidades'
import { obtenerImagenNoticia } from '@/lib/video-utils'
import toast from 'react-hot-toast'
import Cargador from '@/componentes/Cargador'

export default function PaginaAdminNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [cargando, setCargando] = useState(true)
  const [filtro, setFiltro] = useState<'todas' | 'publicadas' | 'borradores'>('todas')

  useEffect(() => {
    cargarNoticias()
  }, [])

  const cargarNoticias = async () => {
    try {
      const { datos } = await obtenerNoticias(1, 50)
      setNoticias(datos)
    } catch (error) {
      toast.error('Error al cargar noticias')
    } finally {
      setCargando(false)
    }
  }

  const manejarEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta noticia?')) return

    try {
      await eliminarNoticia(id)
      toast.success('Noticia eliminada')
      cargarNoticias()
    } catch (error) {
      toast.error('Error al eliminar noticia')
    }
  }

  const noticiasFiltradas = noticias.filter((noticia) => {
    if (filtro === 'publicadas') return noticia.publicada
    if (filtro === 'borradores') return !noticia.publicada
    return true
  })

  if (cargando) return <Cargador texto="Cargando noticias..." />

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Noticias</h1>
          <p className="text-texto-secundario">
            {noticiasFiltradas.length} noticias
          </p>
        </div>
        <Link
          href="/admin/noticias/nueva"
          className="bg-primario hover:bg-primario-oscuro text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Nueva Noticia
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFiltro('todas')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filtro === 'todas'
              ? 'bg-primario text-white'
              : 'bg-fondo-secundario text-texto-secundario hover:bg-fondo-terciario'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFiltro('publicadas')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filtro === 'publicadas'
              ? 'bg-primario text-white'
              : 'bg-fondo-secundario text-texto-secundario hover:bg-fondo-terciario'
          }`}
        >
          Publicadas
        </button>
        <button
          onClick={() => setFiltro('borradores')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filtro === 'borradores'
              ? 'bg-primario text-white'
              : 'bg-fondo-secundario text-texto-secundario hover:bg-fondo-terciario'
          }`}
        >
          Borradores
        </button>
      </div>

      {/* Lista de noticias */}
      <div className="grid grid-cols-1 gap-4">
        {noticiasFiltradas.length > 0 ? (
          noticiasFiltradas.map((noticia) => {
            const imagenMostrar = obtenerImagenNoticia(
              noticia.imagen, 
              noticia.video_url, 
              noticia.video_tipo,
              noticia.video_thumbnail
            )
            
            return (
              <div key={noticia.id} className="bg-fondo-secundario rounded-lg border border-fondo-terciario overflow-hidden hover:border-primario transition-colors">
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                  {/* Imagen */}
                  <div className="relative w-full sm:w-40 h-32 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-fondo-terciario">
                    {imagenMostrar ? (
                      <Image
                        src={imagenMostrar}
                        alt={noticia.titulo}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-texto-terciario" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">
                      {noticia.titulo}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-texto-secundario mb-3">
                      <span className="px-2 py-1 bg-fondo rounded-full">
                        {noticia.categoria?.nombre}
                      </span>
                      <span>•</span>
                      <span>{formatearFechaRelativa(noticia.fecha_creacion)}</span>
                      <span>•</span>
                      <span>{noticia.vistas || 0} vistas</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        noticia.publicada 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {noticia.publicada ? '✓ Publicada' : '○ Borrador'}
                      </span>
                      {noticia.destacada && (
                        <span className="px-2 py-1 bg-primario/20 text-primario rounded-full text-xs font-medium">
                          ★ Destacada
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex border-t border-fondo-terciario">
                  <Link
                    href={`/admin/noticias/${noticia.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 hover:bg-fondo-terciario transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </Link>
                  <button
                    onClick={() => manejarEliminar(noticia.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 hover:bg-red-500/10 text-red-500 transition-colors text-sm font-medium border-l border-fondo-terciario"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12 bg-fondo-secundario rounded-lg border border-fondo-terciario">
            <p className="text-texto-secundario">No hay noticias</p>
          </div>
        )}
      </div>
    </div>
  )
}
