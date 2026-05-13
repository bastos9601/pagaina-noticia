import { supabase } from '@/lib/supabase'
import { Canal, FormularioCanal } from '@/tipos'

export async function obtenerCanales(activos?: boolean): Promise<Canal[]> {
  let query = supabase
    .from('canales')
    .select('*')
    .order('nombre', { ascending: true })
  
  if (activos !== undefined) {
    query = query.eq('activo', activos)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data as Canal[]
}

export async function obtenerCanalPorId(id: string): Promise<Canal | null> {
  const { data, error } = await supabase
    .from('canales')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) return null
  return data as Canal
}

export async function crearCanal(canal: FormularioCanal): Promise<Canal> {
  const response = await fetch('/api/admin/canales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(canal),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error al crear canal')
  }
  
  return response.json()
}

export async function actualizarCanal(id: string, canal: Partial<FormularioCanal>): Promise<Canal> {
  const response = await fetch('/api/admin/canales', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...canal }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error al actualizar canal')
  }
  
  return response.json()
}

export async function eliminarCanal(id: string): Promise<void> {
  const response = await fetch(`/api/admin/canales?id=${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error al eliminar canal')
  }
}

export async function alternarEstadoCanal(id: string, activo: boolean): Promise<void> {
  await actualizarCanal(id, { activo })
}
