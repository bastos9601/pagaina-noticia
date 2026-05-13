import { supabase, supabaseAdmin } from '@/lib/supabase'
import { Categoria, FormularioCategoria } from '@/tipos'

export async function obtenerCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre', { ascending: true })
  
  if (error) throw error
  return data as Categoria[]
}

export async function obtenerCategoriaPorSlug(slug: string): Promise<Categoria | null> {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) return null
  return data as Categoria
}

export async function crearCategoria(categoria: FormularioCategoria): Promise<Categoria> {
  const response = await fetch('/api/admin/categorias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoria),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error al crear categoría')
  }
  
  return response.json()
}

export async function actualizarCategoria(id: string, categoria: Partial<FormularioCategoria>): Promise<Categoria> {
  const response = await fetch('/api/admin/categorias', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...categoria }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error al actualizar categoría')
  }
  
  return response.json()
}

export async function eliminarCategoria(id: string): Promise<void> {
  const response = await fetch(`/api/admin/categorias?id=${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error al eliminar categoría')
  }
}
