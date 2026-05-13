import { supabase } from '@/lib/supabase'
import { Publicidad } from '@/tipos'

export async function obtenerPublicidad(posicion?: string): Promise<Publicidad[]> {
  let query = supabase
    .from('publicidad')
    .select('*')
    .eq('activo', true)
  
  if (posicion) {
    query = query.eq('posicion', posicion)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data as Publicidad[]
}

export async function obtenerTodasPublicidades(): Promise<Publicidad[]> {
  const { data, error } = await supabase
    .from('publicidad')
    .select('*')
    .order('fecha_inicio', { ascending: false })
  
  if (error) throw error
  return data as Publicidad[]
}

export async function crearPublicidad(publicidad: Omit<Publicidad, 'id'>): Promise<Publicidad> {
  const response = await fetch('/api/admin/publicidad', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(publicidad),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error al crear publicidad')
  }
  
  return response.json()
}

export async function actualizarPublicidad(id: string, publicidad: Partial<Publicidad>): Promise<Publicidad> {
  const response = await fetch('/api/admin/publicidad', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...publicidad }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error al actualizar publicidad')
  }
  
  return response.json()
}

export async function eliminarPublicidad(id: string): Promise<void> {
  const response = await fetch(`/api/admin/publicidad?id=${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error al eliminar publicidad')
  }
}
