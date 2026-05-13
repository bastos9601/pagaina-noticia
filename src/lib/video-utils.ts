/**
 * Obtiene la URL de la miniatura de un video según su tipo
 */
export function obtenerMiniaturaVideo(
  videoUrl: string,
  videoTipo: 'youtube' | 'vimeo' | 'mp4' | 'hls'
): string | null {
  if (!videoUrl) return null

  // YouTube
  if (videoTipo === 'youtube') {
    const videoId = extraerIdYouTube(videoUrl)
    if (videoId) {
      // Usar maxresdefault para mejor calidad, con fallback a hqdefault
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }
  }

  // Vimeo - requiere API, por ahora retornamos null
  // Para obtener miniaturas de Vimeo necesitarías hacer una llamada a su API
  if (videoTipo === 'vimeo') {
    const videoId = extraerIdVimeo(videoUrl)
    if (videoId) {
      // Vimeo requiere una llamada a la API para obtener la miniatura
      // Por ahora retornamos null, pero podrías implementar esto con su API
      return null
    }
  }

  // MP4 y HLS no tienen miniaturas automáticas
  return null
}

/**
 * Extrae el ID de un video de YouTube
 */
function extraerIdYouTube(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

/**
 * Extrae el ID de un video de Vimeo
 */
function extraerIdVimeo(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

/**
 * Obtiene la imagen a mostrar para una noticia
 * Prioridad: imagen propia > miniatura guardada > miniatura de video > placeholder
 */
export function obtenerImagenNoticia(
  imagen: string | undefined,
  videoUrl: string | undefined,
  videoTipo: 'youtube' | 'vimeo' | 'mp4' | 'hls' | undefined,
  videoThumbnail: string | undefined
): string | null {
  // Si hay imagen, usarla
  if (imagen) return imagen

  // Si hay miniatura guardada (para videos subidos), usarla
  if (videoThumbnail) return videoThumbnail

  // Si no hay imagen pero hay video, intentar obtener miniatura
  if (videoUrl && videoTipo) {
    const miniatura = obtenerMiniaturaVideo(videoUrl, videoTipo)
    if (miniatura) return miniatura
  }

  // No hay imagen ni miniatura disponible
  return null
}
