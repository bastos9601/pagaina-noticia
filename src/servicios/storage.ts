import { supabase } from '@/lib/supabase'

/**
 * Sube una imagen a Supabase Storage
 */
export async function subirImagen(archivo: File, carpeta: string = 'general'): Promise<string> {
  try {
    const extension = archivo.name.split('.').pop()
    const nombreArchivo = `${carpeta}/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`

    const { data, error } = await supabase.storage
      .from('imagenes')
      .upload(nombreArchivo, archivo, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('imagenes')
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error: any) {
    console.error('Error al subir imagen:', error)
    throw new Error(error.message || 'Error al subir imagen')
  }
}

/**
 * Sube un video a Supabase Storage
 */
export async function subirVideo(archivo: File, carpeta: string = 'general'): Promise<string> {
  try {
    // Validar tipo de archivo
    const tiposPermitidos = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
    if (!tiposPermitidos.includes(archivo.type)) {
      throw new Error('Formato de video no soportado. Usa MP4, WebM, MOV o AVI')
    }

    // Validar tamaño (500 MB)
    const tamañoMaximo = 500 * 1024 * 1024
    if (archivo.size > tamañoMaximo) {
      throw new Error('El video es muy grande. El tamaño máximo es 500 MB')
    }

    const extension = archivo.name.split('.').pop()
    const nombreArchivo = `${carpeta}/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`

    const { data, error } = await supabase.storage
      .from('videos')
      .upload(nombreArchivo, archivo, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error: any) {
    console.error('Error al subir video:', error)
    throw new Error(error.message || 'Error al subir video')
  }
}

/**
 * Elimina una imagen de Supabase Storage
 */
export async function eliminarImagen(url: string): Promise<void> {
  try {
    const path = url.split('/imagenes/')[1]
    if (!path) throw new Error('URL inválida')

    const { error } = await supabase.storage
      .from('imagenes')
      .remove([path])

    if (error) throw error
  } catch (error: any) {
    console.error('Error al eliminar imagen:', error)
    throw new Error(error.message || 'Error al eliminar imagen')
  }
}

/**
 * Elimina un video de Supabase Storage
 */
export async function eliminarVideo(url: string): Promise<void> {
  try {
    const path = url.split('/videos/')[1]
    if (!path) throw new Error('URL inválida')

    const { error } = await supabase.storage
      .from('videos')
      .remove([path])

    if (error) throw error
  } catch (error: any) {
    console.error('Error al eliminar video:', error)
    throw new Error(error.message || 'Error al eliminar video')
  }
}

/**
 * Obtiene el tamaño de un archivo en formato legible
 */
export function formatearTamaño(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
