'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { obtenerTodasPublicidades, eliminarPublicidad, actualizarPublicidad, crearPublicidad } from '@/servicios/publicidad'
import { Publicidad } from '@/tipos'
import toast from 'react-hot-toast'
import Cargador from '@/componentes/Cargador'
import SubidorImagen from '@/componentes/SubidorImagen'
import CreadorBanner from '@/componentes/admin/CreadorBanner'

export default function PaginaAdminPublicidad() {
  const [publicidades, setPublicidades] = useState<Publicidad[]>([])
  const [cargando, setCargando] = useState(true)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mostrarCreador, setMostrarCreador] = useState(false)
  const [formulario, setFormulario] = useState({
    titulo: '',
    imagen: '',
    enlace: '',
    posicion: 'lateral' as 'superior' | 'lateral' | 'contenido',
    activo: true,
  })

  useEffect(() => {
    cargarPublicidades()
  }, [])

  const cargarPublicidades = async () => {
    try {
      const datos = await obtenerTodasPublicidades()
      setPublicidades(datos)
    } catch (error) {
      toast.error('Error al cargar publicidad')
    } finally {
      setCargando(false)
    }
  }

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await crearPublicidad(formulario as any)
      toast.success('Banner creado exitosamente')
      setFormulario({
        titulo: '',
        imagen: '',
        enlace: '',
        posicion: 'lateral',
        activo: true,
      })
      setMostrarFormulario(false)
      cargarPublicidades()
    } catch (error) {
      toast.error('Error al crear banner')
    }
  }

  const manejarEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este banner?')) return

    try {
      await eliminarPublicidad(id)
      toast.success('Banner eliminado')
      cargarPublicidades()
    } catch (error) {
      toast.error('Error al eliminar banner')
    }
  }

  const manejarAlternarEstado = async (id: string, activo: boolean) => {
    try {
      await actualizarPublicidad(id, { activo: !activo })
      toast.success(`Banner ${!activo ? 'activado' : 'desactivado'}`)
      cargarPublicidades()
    } catch (error) {
      toast.error('Error al cambiar estado')
    }
  }

  if (cargando) return <Cargador texto="Cargando publicidad..." />

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Publicidad</h1>
          <p className="text-texto-secundario">{publicidades.length} banners</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setMostrarCreador(!mostrarCreador)
              if (!mostrarCreador) setMostrarFormulario(false)
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {mostrarCreador ? 'Cerrar Creador' : '🎨 Crear Banner'}
          </button>
          <button
            onClick={() => {
              setMostrarFormulario(!mostrarFormulario)
              if (!mostrarFormulario) setMostrarCreador(false)
            }}
            className="bg-primario hover:bg-primario-oscuro text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {mostrarFormulario ? 'Cancelar' : '+ Subir Imagen'}
          </button>
        </div>
      </div>

      {/* Creador de banners */}
      {mostrarCreador && (
        <div className="mb-8">
          <CreadorBanner
            onBannerCreado={(imagenUrl) => {
              setFormulario({ ...formulario, imagen: imagenUrl })
              setMostrarCreador(false)
              setMostrarFormulario(true)
              toast.success('Banner creado. Completa los demás campos.')
            }}
          />
        </div>
      )}

      {/* Formulario */}
      {mostrarFormulario && (
        <form
          onSubmit={manejarSubmit}
          className="bg-fondo-secundario rounded-lg p-6 border border-fondo-terciario mb-8"
        >
          <h2 className="text-xl font-bold mb-4">Nuevo Banner Publicitario</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Título del Banner *
              </label>
              <input
                type="text"
                value={formulario.titulo}
                onChange={(e) => setFormulario({ ...formulario, titulo: e.target.value })}
                className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
                placeholder="Ej: Banner Principal"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Imagen del Banner *
              </label>
              <SubidorImagen
                onImagenSubida={(url) => setFormulario({ ...formulario, imagen: url })}
                imagenActual={formulario.imagen}
                carpeta="publicidad"
              />
              <p className="text-xs text-texto-terciario mt-2">
                O ingresa una URL directamente:
              </p>
              <input
                type="url"
                value={formulario.imagen}
                onChange={(e) => setFormulario({ ...formulario, imagen: e.target.value })}
                className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario mt-2"
                placeholder="https://ejemplo.com/banner.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Enlace (opcional)
              </label>
              <input
                type="url"
                value={formulario.enlace}
                onChange={(e) => setFormulario({ ...formulario, enlace: e.target.value })}
                className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
                placeholder="https://ejemplo.com"
              />
              <p className="text-xs text-texto-terciario mt-1">
                URL a la que redirige al hacer clic en el banner
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Posición *
              </label>
              <select
                value={formulario.posicion}
                onChange={(e) => setFormulario({ ...formulario, posicion: e.target.value as any })}
                className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
                required
              >
                <option value="superior">Superior (Header)</option>
                <option value="lateral">Lateral (Sidebar)</option>
                <option value="contenido">Contenido (Entre noticias)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="activo"
                checked={formulario.activo}
                onChange={(e) => setFormulario({ ...formulario, activo: e.target.checked })}
                className="w-5 h-5 rounded border-fondo-terciario text-primario focus:ring-2 focus:ring-primario"
              />
              <label htmlFor="activo" className="text-sm font-medium cursor-pointer">
                Banner activo (visible en el sitio)
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-primario hover:bg-primario-oscuro text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Crear Banner
            </button>
          </div>
        </form>
      )}

      {/* Lista de banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {publicidades.map((pub) => (
          <div
            key={pub.id}
            className="bg-fondo-secundario rounded-lg border border-fondo-terciario overflow-hidden"
          >
            <div className="relative h-48 bg-fondo-terciario">
              {pub.imagen && (
                <img
                  src={pub.imagen}
                  alt={pub.titulo}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{pub.titulo}</h3>
                  {pub.enlace && (
                    <a
                      href={pub.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primario hover:underline break-all"
                    >
                      {pub.enlace}
                    </a>
                  )}
                </div>
                <button
                  onClick={() => manejarAlternarEstado(pub.id, pub.activo)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    pub.activo
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-gray-500/20 text-gray-500'
                  }`}
                >
                  {pub.activo ? 'Activo' : 'Inactivo'}
                </button>
              </div>

              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-fondo rounded-full text-xs font-medium">
                  📍 {pub.posicion}
                </span>
              </div>

              <button
                onClick={() => manejarEliminar(pub.id)}
                className="w-full px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
              >
                Eliminar Banner
              </button>
            </div>
          </div>
        ))}
      </div>

      {publicidades.length === 0 && !mostrarFormulario && (
        <div className="text-center py-12 bg-fondo-secundario rounded-lg border border-fondo-terciario">
          <div className="w-16 h-16 bg-fondo-terciario rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📢</span>
          </div>
          <p className="text-texto-secundario mb-4">No hay banners publicitarios</p>
          <button
            onClick={() => setMostrarFormulario(true)}
            className="inline-block bg-primario text-white px-6 py-3 rounded-lg hover:bg-primario-oscuro transition-colors"
          >
            Crear primer banner
          </button>
        </div>
      )}
    </div>
  )
}
