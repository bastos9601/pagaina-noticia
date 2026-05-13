import { supabase, supabaseAdmin } from '@/lib/supabase'
import { Noticia, FormularioNoticia, RespuestaPaginada } from '@/tipos'

export async function obtenerNoticias(
  pagina: number = 1,
  limite: number = 12,
  categoriaId?: string
): Promise<RespuestaPaginada<Noticia>> {
  const inicio = (pagina - 1) * limite
  
  let query = supabase
    .from('noticias')
    .select('*, categoria:categorias(*), autor:usuarios(*)', { count: 'exact' })
    .eq('publicada', true)
    .order('fecha_creacion', { ascending: false })
    .range(inicio, inicio + limite - 1)
  
  if (categoriaId) {
    query = query.eq('categoria_id', categoriaId)
  }
  
  const { data, error, count } = await query
  
  if (error) throw error
  
  return {
    datos: data as Noticia[],
    paginacion: {
      pagina,
      limite,
      total: count || 0,
      paginas: Math.ceil((count || 0) / limite),
    },
  }
}

export async function obtenerNoticiaPorSlug(slug: string): Promise<Noticia | null> {
  const { data, error } = await supabase
    .from('noticias')
    .select('*, categoria:categorias(*), autor:usuarios(*)')
    .eq('slug', slug)
    .eq('publicada', true)
    .single()
  
  if (error) return null
  
  // Incrementar vistas
  await supabaseAdmin
    .from('noticias')
    .update({ vistas: (data.vistas || 0) + 1 })
    .eq('id', data.id)
  
  return data as Noticia
}

export async function obtenerNoticiaPorId(id: string): Promise<Noticia | null> {
  const { data, error } = await supabase
    .from('noticias')
    .select('*, categoria:categorias(*), autor:usuarios(*)')
    .eq('id', id)
    .single()
  
  if (error) return null
  return data as Noticia
}

export async function obtenerNoticiasDestacadas(limite: number = 6): Promise<Noticia[]> {
  const { data, error } = await supabase
    .from('noticias')
    .select('*, categoria:categorias(*)')
    .eq('publicada', true)
    .eq('destacada', true)
    .order('fecha_creacion', { ascending: false })
    .limit(limite)
  
  if (error) throw error
  return data as Noticia[]
}

export async function buscarNoticias(termino: string): Promise<Noticia[]> {
  const { data, error } = await supabase
    .from('noticias')
    .select('*, categoria:categorias(*)')
    .eq('publicada', true)
    .or(`titulo.ilike.%${termino}%,contenido.ilike.%${termino}%`)
    .order('fecha_creacion', { ascending: false })
    .limit(20)
  
  if (error) throw error
  return data as Noticia[]
}

export async function busquedaGlobal(termino: string) {
  const terminoLimpio = termino.trim()
  
  // Buscar en noticias (título, contenido)
  const { data: noticias, error: errorNoticias } = await supabase
    .from('noticias')
    .select('*, categoria:categorias(*)')
    .eq('publicada', true)
    .or(`titulo.ilike.%${terminoLimpio}%,contenido.ilike.%${terminoLimpio}%`)
    .order('fecha_creacion', { ascending: false })
    .limit(20)
  
  // Buscar en canales (nombre, descripción)
  const { data: canales, error: errorCanales } = await supabase
    .from('canales')
    .select('*')
    .eq('activo', true)
    .or(`nombre.ilike.%${terminoLimpio}%,descripcion.ilike.%${terminoLimpio}%`)
    .order('orden', { ascending: true })
    .limit(10)
  
  // Buscar en categorías (nombre)
  const { data: categorias, error: errorCategorias } = await supabase
    .from('categorias')
    .select('*')
    .ilike('nombre', `%${terminoLimpio}%`)
    .order('nombre', { ascending: true })
    .limit(10)
  
  // Buscar noticias por categoría
  const { data: noticiasPorCategoria, error: errorNoticiasCat } = await supabase
    .from('noticias')
    .select('*, categoria:categorias!inner(*)')
    .eq('publicada', true)
    .ilike('categoria.nombre', `%${terminoLimpio}%`)
    .order('fecha_creacion', { ascending: false })
    .limit(10)
  
  return {
    noticias: noticias || [],
    canales: canales || [],
    categorias: categorias || [],
    noticiasPorCategoria: noticiasPorCategoria || [],
    total: (noticias?.length || 0) + (canales?.length || 0) + (categorias?.length || 0) + (noticiasPorCategoria?.length || 0)
  }
}

export async function crearNoticia(noticia: FormularioNoticia, autorId: string): Promise<Noticia> {
  const response = await fetch('/api/admin/noticias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...noticia,
      autor_id: autorId,
    }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error al crear noticia')
  }
  
  return response.json()
}

export async function actualizarNoticia(id: string, noticia: Partial<FormularioNoticia>): Promise<Noticia> {
  const response = await fetch('/api/admin/noticias', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...noticia }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error al actualizar noticia')
  }
  
  return response.json()
}

export async function eliminarNoticia(id: string): Promise<void> {
  const response = await fetch(`/api/admin/noticias?id=${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error al eliminar noticia')
  }
}

export async function obtenerNoticiasRelacionadas(
  categoriaId: string,
  noticiaId: string,
  limite: number = 4
): Promise<Noticia[]> {
  const { data, error } = await supabase
    .from('noticias')
    .select('*, categoria:categorias(*)')
    .eq('categoria_id', categoriaId)
    .eq('publicada', true)
    .neq('id', noticiaId)
    .order('fecha_creacion', { ascending: false })
    .limit(limite)
  
  if (error) throw error
  return data as Noticia[]
}
