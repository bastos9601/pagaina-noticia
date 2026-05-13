'use client'

import { useEffect, useState } from 'react'
import { obtenerCategorias, crearCategoria, eliminarCategoria } from '@/servicios/categorias'
import { Categoria, FormularioCategoria } from '@/tipos'
import { generarSlug } from '@/lib/utilidades'
import toast from 'react-hot-toast'
import Cargador from '@/componentes/Cargador'

export default function PaginaAdminCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cargando, setCargando] = useState(true)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [formulario, setFormulario] = useState<FormularioCategoria>({
    nombre: '',
    descripcion: '',
    color: '#DC2626',
  })

  useEffect(() => {
    cargarCategorias()
  }, [])

  const cargarCategorias = async () => {
    try {
      const datos = await obtenerCategorias()
      setCategorias(datos)
    } catch (error) {
      toast.error('Error al cargar categorías')
    } finally {
      setCargando(false)
    }
  }

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await crearCategoria({
        ...formulario,
        slug: generarSlug(formulario.nombre),
      } as any)
      
      toast.success('Categoría creada')
      setFormulario({ nombre: '', descripcion: '', color: '#DC2626' })
      setMostrarFormulario(false)
      cargarCategorias()
    } catch (error) {
      toast.error('Error al crear categoría')
    }
  }

  const manejarEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return

    try {
      await eliminarCategoria(id)
      toast.success('Categoría eliminada')
      cargarCategorias()
    } catch (error) {
      toast.error('Error al eliminar categoría')
    }
  }

  if (cargando) return <Cargador texto="Cargando categorías..." />

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Categorías</h1>
          <p className="text-texto-secundario">{categorias.length} categorías</p>
        </div>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-primario hover:bg-primario-oscuro text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {mostrarFormulario ? 'Cancelar' : '+ Nueva Categoría'}
        </button>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <form
          onSubmit={manejarSubmit}
          className="bg-fondo-secundario rounded-lg p-6 border border-fondo-terciario mb-8"
        >
          <h2 className="text-xl font-bold mb-4">Nueva Categoría</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={formulario.nombre}
                onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
                required
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium mb-2">
                Color
              </label>
              <input
                type="color"
                value={formulario.color}
                onChange={(e) => setFormulario({ ...formulario, color: e.target.value })}
                className="w-full h-12 bg-fondo border border-fondo-terciario rounded-lg cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primario hover:bg-primario-oscuro text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Crear Categoría
            </button>
          </div>
        </form>
      )}

      {/* Lista de categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorias.map((categoria) => (
          <div
            key={categoria.id}
            className="bg-fondo-secundario rounded-lg p-6 border border-fondo-terciario"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: categoria.color || '#DC2626' }}
                />
                <h3 className="font-bold text-lg">{categoria.nombre}</h3>
              </div>
            </div>

            {categoria.descripcion && (
              <p className="text-sm text-texto-secundario mb-4">
                {categoria.descripcion}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => manejarEliminar(categoria.id)}
                className="flex-1 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {categorias.length === 0 && !mostrarFormulario && (
        <div className="text-center py-12 bg-fondo-secundario rounded-lg border border-fondo-terciario">
          <p className="text-texto-secundario mb-4">No hay categorías creadas</p>
          <button
            onClick={() => setMostrarFormulario(true)}
            className="inline-block bg-primario text-white px-6 py-3 rounded-lg hover:bg-primario-oscuro transition-colors"
          >
            Crear primera categoría
          </button>
        </div>
      )}
    </div>
  )
}
