'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { obtenerCanales, eliminarCanal, alternarEstadoCanal } from '@/servicios/canales'
import { Canal } from '@/tipos'
import toast from 'react-hot-toast'
import Cargador from '@/componentes/Cargador'

export default function PaginaAdminCanales() {
  const [canales, setCanales] = useState<Canal[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarCanales()
  }, [])

  const cargarCanales = async () => {
    try {
      const datos = await obtenerCanales()
      setCanales(datos)
    } catch (error) {
      toast.error('Error al cargar canales')
    } finally {
      setCargando(false)
    }
  }

  const manejarEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este canal?')) return

    try {
      await eliminarCanal(id)
      toast.success('Canal eliminado')
      cargarCanales()
    } catch (error) {
      toast.error('Error al eliminar canal')
    }
  }

  const manejarAlternarEstado = async (id: string, activo: boolean) => {
    try {
      await alternarEstadoCanal(id, !activo)
      toast.success(`Canal ${!activo ? 'activado' : 'desactivado'}`)
      cargarCanales()
    } catch (error) {
      toast.error('Error al cambiar estado')
    }
  }

  if (cargando) return <Cargador texto="Cargando canales..." />

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Canales</h1>
          <p className="text-texto-secundario">{canales.length} canales</p>
        </div>
        <Link
          href="/admin/canales/nuevo"
          className="bg-primario hover:bg-primario-oscuro text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Nuevo Canal
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {canales.map((canal) => (
          <div
            key={canal.id}
            className="bg-fondo-secundario rounded-lg border border-fondo-terciario overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{canal.nombre}</h3>
                  <p className="text-sm text-texto-secundario line-clamp-2 mb-3">
                    {canal.descripcion}
                  </p>
                </div>
                <button
                  onClick={() => manejarAlternarEstado(canal.id, canal.activo)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    canal.activo
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-gray-500/20 text-gray-500'
                  }`}
                >
                  {canal.activo ? 'Activo' : 'Inactivo'}
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-fondo rounded text-xs">
                  {canal.tipo.toUpperCase()}
                </span>
                <span className="px-2 py-1 bg-fondo rounded text-xs">
                  {canal.categoria}
                </span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/canales/${canal.id}`}
                  className="flex-1 text-center px-4 py-2 bg-fondo rounded-lg hover:bg-fondo-terciario transition-colors text-sm"
                >
                  Editar
                </Link>
                <button
                  onClick={() => manejarEliminar(canal.id)}
                  className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {canales.length === 0 && (
        <div className="text-center py-12 bg-fondo-secundario rounded-lg border border-fondo-terciario">
          <p className="text-texto-secundario mb-4">No hay canales creados</p>
          <Link
            href="/admin/canales/nuevo"
            className="inline-block bg-primario text-white px-6 py-3 rounded-lg hover:bg-primario-oscuro transition-colors"
          >
            Crear primer canal
          </Link>
        </div>
      )}
    </div>
  )
}
