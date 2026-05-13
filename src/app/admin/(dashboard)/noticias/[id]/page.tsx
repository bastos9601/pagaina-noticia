'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { obtenerNoticiaPorId, actualizarNoticia } from '@/servicios/noticias'
import { obtenerCategorias } from '@/servicios/categorias'
import { Categoria, Noticia } from '@/tipos'
import { generarSlug } from '@/lib/utilidades'
import toast from 'react-hot-toast'
import SubidorImagen from '@/componentes/SubidorImagen'
import SubidorVideo from '@/componentes/SubidorVideo'
import Cargador from '@/componentes/Cargador'

interface Props {
  params: Promise<{ id: string }>
}

export default function PaginaEditarNoticia({ params }: Props) {
  const router = useRouter()
  const [id, setId] = useState<string>('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [formulario, setFormulario] = useState({
    titulo: '',
    contenido: { blocks: [] as any[] },
    imagen: '',
    video_url: '',
    video_tipo: undefined as 'youtube' | 'vimeo' | 'mp4' | 'hls' | undefined,
    video_thumbnail: '',
    categoria_id: '',
    destacada: false,
    publicada: false,
  })

  useEffect(() => {
    params.then(p => {
      setId(p.id)
      cargarDatos(p.id)
    })
  }, [params])

  const cargarDatos = async (noticiaId: string) => {
    try {
      const [noticia, cats] = await Promise.all([
        obtenerNoticiaPorId(noticiaId),
        obtenerCategorias()
      ])

      if (!noticia) {
        toast.error('Noticia no encontrada')
        router.push('/admin/noticias')
        return
      }

      setCategorias(cats)
      setFormulario({
        titulo: noticia.titulo,
        contenido: noticia.contenido || { blocks: [] },
        imagen: noticia.imagen,
        video_url: noticia.video_url || '',
        video_tipo: noticia.video_tipo,
        video_thumbnail: noticia.video_thumbnail || '',
        categoria_id: noticia.categoria_id,
        destacada: noticia.destacada,
        publicada: noticia.publicada,
      })
    } catch (error) {
      toast.error('Error al cargar noticia')
      router.push('/admin/noticias')
    } finally {
      setCargando(false)
    }
  }

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formulario.titulo.trim()) {
      toast.error('Por favor ingresa un título')
      return
    }

    setGuardando(true)

    try {
      const slug = generarSlug(formulario.titulo)
      
      const contenido = formulario.contenido.blocks.length === 0
        ? {
            blocks: [
              {
                type: 'paragraph',
                data: { text: 'Contenido de la noticia...' }
              }
            ]
          }
        : formulario.contenido

      await actualizarNoticia(id, {
        ...formulario,
        slug,
        contenido,
      } as any)
      
      toast.success('Noticia actualizada exitosamente')
      router.push('/admin/noticias')
    } catch (error: any) {
      console.error('Error al actualizar noticia:', error)
      toast.error(error.message || 'Error al actualizar noticia')
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) return <Cargador texto="Cargando noticia..." />

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/noticias"
          className="text-texto-secundario hover:text-primario transition-colors mb-4 inline-block"
        >
          ← Volver a noticias
        </Link>
        <h1 className="text-3xl font-bold">Editar Noticia</h1>
      </div>

      <form onSubmit={manejarSubmit} className="max-w-4xl">
        <div className="bg-fondo-secundario rounded-lg p-6 border border-fondo-terciario space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formulario.titulo}
              onChange={(e) => setFormulario({ ...formulario, titulo: e.target.value })}
              className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
              placeholder="Título de la noticia"
              required
            />
            <p className="text-xs text-texto-terciario mt-1">
              Slug: {generarSlug(formulario.titulo) || 'se-generara-automaticamente'}
            </p>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Imagen Principal (Opcional)
            </label>
            <SubidorImagen
              onImagenSubida={(url) => setFormulario({ ...formulario, imagen: url })}
              imagenActual={formulario.imagen}
              carpeta="noticias"
            />
            <p className="text-xs text-texto-terciario mt-2">
              O ingresa una URL directamente:
            </p>
            <input
              type="url"
              value={formulario.imagen}
              onChange={(e) => setFormulario({ ...formulario, imagen: e.target.value })}
              className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario mt-2"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          {/* Video (opcional) */}
          <div className="border-t border-fondo-terciario pt-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🎥</span>
              <h3 className="text-lg font-semibold">Video (Opcional)</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tipo de Video
                </label>
                <select
                  value={formulario.video_tipo || ''}
                  onChange={(e) => setFormulario({ 
                    ...formulario, 
                    video_tipo: e.target.value ? e.target.value as any : undefined,
                    video_url: '' // Limpiar URL al cambiar tipo
                  })}
                  className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
                >
                  <option value="">Sin video</option>
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="mp4">MP4 (URL directa)</option>
                  <option value="hls">HLS (Streaming)</option>
                </select>
              </div>

              {/* URL del video */}
              {formulario.video_tipo && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    URL del Video
                  </label>
                  <input
                    type="url"
                    value={formulario.video_url || ''}
                    onChange={(e) => setFormulario({ ...formulario, video_url: e.target.value })}
                    className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
                    placeholder={
                      formulario.video_tipo === 'youtube' ? 'https://www.youtube.com/watch?v=...' :
                      formulario.video_tipo === 'vimeo' ? 'https://vimeo.com/...' :
                      formulario.video_tipo === 'mp4' ? 'https://ejemplo.com/video.mp4' :
                      'https://ejemplo.com/stream.m3u8'
                    }
                  />
                  <p className="text-xs text-texto-terciario mt-1">
                    {formulario.video_tipo === 'youtube' && 'Ejemplo: https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
                    {formulario.video_tipo === 'vimeo' && 'Ejemplo: https://vimeo.com/123456789'}
                    {formulario.video_tipo === 'mp4' && 'URL directa al archivo MP4 o usa el botón de subir abajo'}
                    {formulario.video_tipo === 'hls' && 'URL del archivo .m3u8 para streaming HLS'}
                  </p>
                </div>
              )}

              {/* Subir video desde dispositivo (solo para MP4) */}
              {formulario.video_tipo === 'mp4' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">
                    O sube un video desde tu dispositivo
                  </label>
                  <SubidorVideo
                    onVideoSubido={(url, thumbnail) => {
                      setFormulario({ 
                        ...formulario, 
                        video_url: url,
                        video_tipo: 'mp4',
                        video_thumbnail: thumbnail
                      })
                    }}
                    videoActual={formulario.video_url}
                    carpeta="noticias"
                  />
                </div>
              )}
                    className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
                    placeholder={
                      formulario.video_tipo === 'youtube' ? 'https://www.youtube.com/watch?v=...' :
                      formulario.video_tipo === 'vimeo' ? 'https://vimeo.com/...' :
                      formulario.video_tipo === 'mp4' ? 'https://ejemplo.com/video.mp4' :
                      'https://ejemplo.com/stream.m3u8'
                    }
                  />
                  <p className="text-xs text-texto-terciario mt-1">
                    {formulario.video_tipo === 'youtube' && 'Ejemplo: https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
                    {formulario.video_tipo === 'vimeo' && 'Ejemplo: https://vimeo.com/123456789'}
                    {formulario.video_tipo === 'mp4' && 'URL directa al archivo MP4'}
                    {formulario.video_tipo === 'hls' && 'URL del archivo .m3u8'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Categoría *
            </label>
            <select
              value={formulario.categoria_id}
              onChange={(e) => setFormulario({ ...formulario, categoria_id: e.target.value })}
              className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
              required
            >
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Contenido */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Contenido
            </label>
            <textarea
              value={formulario.contenido.blocks[0]?.data?.text || ''}
              onChange={(e) => setFormulario({
                ...formulario,
                contenido: {
                  blocks: [{
                    type: 'paragraph',
                    data: { text: e.target.value }
                  }]
                }
              })}
              className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
              rows={10}
              placeholder="Escribe el contenido de la noticia..."
            />
          </div>

          {/* Opciones */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="destacada"
                checked={formulario.destacada}
                onChange={(e) => setFormulario({ ...formulario, destacada: e.target.checked })}
                className="w-5 h-5 rounded border-fondo-terciario text-primario focus:ring-2 focus:ring-primario"
              />
              <label htmlFor="destacada" className="text-sm font-medium cursor-pointer">
                Noticia destacada
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="publicada"
                checked={formulario.publicada}
                onChange={(e) => setFormulario({ ...formulario, publicada: e.target.checked })}
                className="w-5 h-5 rounded border-fondo-terciario text-primario focus:ring-2 focus:ring-primario"
              />
              <label htmlFor="publicada" className="text-sm font-medium cursor-pointer">
                Publicar
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 bg-primario hover:bg-primario-oscuro text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {guardando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <Link
              href="/admin/noticias"
              className="px-6 py-3 bg-fondo-terciario hover:bg-fondo rounded-lg transition-colors text-center"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
