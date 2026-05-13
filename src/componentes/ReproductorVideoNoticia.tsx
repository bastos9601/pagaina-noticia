'use client'

import { useState } from 'react'

interface Props {
  videoUrl: string
  videoTipo: 'youtube' | 'vimeo' | 'mp4' | 'hls'
  titulo: string
}

export default function ReproductorVideoNoticia({ videoUrl, videoTipo, titulo }: Props) {
  const [error, setError] = useState(false)

  // Debug: mostrar la URL en consola
  console.log('ReproductorVideoNoticia:', { videoUrl, videoTipo, titulo })

  // Extraer ID de YouTube
  const obtenerIdYouTube = (url: string): string | null => {
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

  // Extraer parámetro si de YouTube (si existe)
  const obtenerParametroSi = (url: string): string | null => {
    const match = url.match(/[?&]si=([^&]+)/)
    return match ? match[1] : null
  }

  // Extraer ID de Vimeo
  const obtenerIdVimeo = (url: string): string | null => {
    const match = url.match(/vimeo\.com\/(\d+)/)
    return match ? match[1] : null
  }

  if (error) {
    return (
      <div className="w-full aspect-video bg-fondo-secundario rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-texto-secundario mb-2">⚠️ Error al cargar el video</p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primario hover:underline text-sm"
          >
            Ver video en nueva pestaña
          </a>
        </div>
      </div>
    )
  }

  // YouTube
  if (videoTipo === 'youtube') {
    const videoId = obtenerIdYouTube(videoUrl)
    
    // Debug
    console.log('YouTube - URL original:', videoUrl)
    console.log('YouTube - ID extraído:', videoId)
    
    if (!videoId) {
      return (
        <div className="w-full aspect-video bg-fondo-secundario rounded-lg flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-texto-secundario mb-2">URL de YouTube inválida</p>
            <p className="text-xs text-texto-terciario break-all">URL: {videoUrl}</p>
          </div>
        </div>
      )
    }

    // URL simple sin parámetros adicionales
    const embedUrl = `https://www.youtube.com/embed/${videoId}`

    console.log('YouTube - URL de embed:', embedUrl)

    return (
      <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    )
  }

  // Vimeo
  if (videoTipo === 'vimeo') {
    const videoId = obtenerIdVimeo(videoUrl)
    if (!videoId) {
      return (
        <div className="w-full aspect-video bg-fondo-secundario rounded-lg flex items-center justify-center">
          <p className="text-texto-secundario">URL de Vimeo inválida</p>
        </div>
      )
    }

    return (
      <div className="w-full aspect-video rounded-lg overflow-hidden">
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          title={titulo}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          onError={() => setError(true)}
        />
      </div>
    )
  }

  // MP4 o HLS - Video nativo
  if (videoTipo === 'mp4' || videoTipo === 'hls') {
    return (
      <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
        <video
          src={videoUrl}
          controls
          className="w-full h-full"
          onError={() => setError(true)}
        >
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
    )
  }

  return null
}
