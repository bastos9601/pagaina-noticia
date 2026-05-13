'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { obtenerCanalPorId, actualizarCanal } from '@/servicios/canales'
import { Canal, FormularioCanal } from '@/tipos'
import toast from 'react-hot-toast'
import Cargador from '@/componentes/Cargador'
import SubidorImagen from '@/componentes/SubidorImagen'

export default function PaginaEditarCanal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [canal, setCanal] = useState<Canal | null>(null)
  const [formulario, setFormulario] = useState<FormularioCanal>({
    nombre: '',
    descripcion: '',
    logo: '',
    url_stream: '',
    tipo: 'hls',
    categoria: '',
    activo: true,
    mostrar_watermark: true,
  })

  useEffect(() => {
    cargarCanal()
  }, [id])

  const cargarCanal = async () => {
    try {
      const datos = await obtenerCanalPorId(id)
      if (datos) {
        setCanal(datos)
        setFormulario({
          nombre: datos.nombre,
          descripcion: datos.descripcion,
          logo: datos.logo,
          url_stream: datos.url_stream,
          tipo: datos.tipo,
          categoria: datos.categoria,
          activo: datos.activo,
          mostrar_watermark: datos.mostrar_watermark !== false,
        })
      } else {
        toast.error('Canal no encontrado')
        router.push('/admin/canales')
      }
    } catch (error) {
      toast.error('Error al cargar canal')
    } finally {
      setCargando(false)
    }
  }

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGuardando(true)

    try {
      await actualizarCanal(params.id, formulario)
      toast.success('Canal actualizado exitosamente')
      router.push('/admin/canales')
    } catch (error) {
      toast.error('Error al actualizar canal')
      console.error(error)
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) return <Cargador texto="Cargando canal..." />

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/canales"
          className="text-texto-secundario hover:text-primario transition-colors mb-4 inline-block"
        >
          ← Volver a canales
        </Link>
        <h1 className="text-3xl font-bold">Editar Canal</h1>
      </div>

      <form onSubmit={manejarSubmit} className="max-w-2xl">
        <div className="bg-fondo-secundario rounded-lg p-6 border border-fondo-terciario space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Nombre del Canal *
            </label>
            <input
              type="text"
              value={formulario.nombre}
              onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
              className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Descripción
            </label>
            <textarea
              value={formulario.descripcion}
              onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
              className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
              rows={3}
            />
          </div>

          {/* Tipo de Stream */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tipo de Stream *
            </label>
            <select
              value={formulario.tipo}
              onChange={(e) => setFormulario({ ...formulario, tipo: e.target.value as any })}
              className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
              required
            >
              <option value="hls">HLS (m3u8)</option>
              <option value="mp4">MP4 (Video directo)</option>
              <option value="mkv">MKV (Video directo)</option>
              <option value="youtube">YouTube Live</option>
              <option value="twitch">Twitch</option>
              <option value="iframe">iFrame Personalizado</option>
            </select>
          </div>

          {/* URL del Stream */}
          <div>
            <label className="block text-sm font-medium mb-2">
              URL del Stream *
            </label>
            <input
              type="url"
              value={formulario.url_stream}
              onChange={(e) => setFormulario({ ...formulario, url_stream: e.target.value })}
              className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
              required
            />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Logo del Canal
            </label>
            <SubidorImagen
              onImagenSubida={(url) => setFormulario({ ...formulario, logo: url })}
              imagenActual={formulario.logo}
              carpeta="canales"
            />
            <p className="text-xs text-texto-terciario mt-2">
              O ingresa una URL directamente:
            </p>
            <input
              type="url"
              value={formulario.logo}
              onChange={(e) => setFormulario({ ...formulario, logo: e.target.value })}
              className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario mt-2"
              placeholder="https://ejemplo.com/logo.png"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Categoría
            </label>
            <input
              type="text"
              value={formulario.categoria}
              onChange={(e) => setFormulario({ ...formulario, categoria: e.target.value })}
              className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
            />
          </div>

          {/* Estado */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="activo"
              checked={formulario.activo}
              onChange={(e) => setFormulario({ ...formulario, activo: e.target.checked })}
              className="w-5 h-5 rounded border-fondo-terciario text-primario focus:ring-2 focus:ring-primario"
            />
            <label htmlFor="activo" className="text-sm font-medium cursor-pointer">
              Canal activo (visible en el sitio público)
            </label>
          </div>

          {/* Watermark */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="watermark"
              checked={formulario.mostrar_watermark !== false}
              onChange={(e) => setFormulario({ ...formulario, mostrar_watermark: e.target.checked })}
              className="w-5 h-5 rounded border-fondo-terciario text-primario focus:ring-2 focus:ring-primario"
            />
            <label htmlFor="watermark" className="text-sm font-medium cursor-pointer">
              Mostrar logo de la página en el reproductor
            </label>
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
              href="/admin/canales"
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
