'use client'

import { useState, useRef } from 'react'
import { subirVideo } from '@/servicios/storage'
import { generarMiniaturaVideo, subirMiniaturaVideo } from '@/lib/video-thumbnail'
import toast from 'react-hot-toast'

interface Props {
  onVideoSubido: (url: string, thumbnail?: string) => void
  videoActual?: string
  carpeta?: string
}

export default function SubidorVideo({ onVideoSubido, videoActual, carpeta = 'noticias' }: Props) {
  const [subiendo, setSubiendo] = useState(false)
  const [progreso, setProgreso] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const manejarArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0]
    if (!archivo) return

    // Validar tipo de archivo
    const tiposPermitidos = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
    if (!tiposPermitidos.includes(archivo.type)) {
      toast.error('Formato no soportado. Usa MP4, WebM, MOV o AVI')
      return
    }

    // Validar tamaño (500 MB)
    const tamañoMaximo = 500 * 1024 * 1024 // 500 MB
    if (archivo.size > tamañoMaximo) {
      toast.error('El video es muy grande. Máximo 500 MB')
      return
    }

    setSubiendo(true)
    setProgreso(0)

    try {
      // Simular progreso
      const intervalo = setInterval(() => {
        setProgreso(prev => {
          if (prev >= 90) {
            clearInterval(intervalo)
            return 90
          }
          return prev + 10
        })
      }, 500)

      const url = await subirVideo(archivo, carpeta)
      
      clearInterval(intervalo)
      setProgreso(95)
      
      // Intentar generar miniatura
      let thumbnailUrl: string | undefined
      try {
        toast.loading('Generando miniatura...', { id: 'thumbnail' })
        const miniaturaBase64 = await generarMiniaturaVideo(url)
        thumbnailUrl = await subirMiniaturaVideo(miniaturaBase64, carpeta)
        toast.success('Miniatura generada', { id: 'thumbnail' })
      } catch (error) {
        console.error('Error al generar miniatura:', error)
        toast.dismiss('thumbnail')
        // Continuar sin miniatura
      }
      
      setProgreso(100)
      
      onVideoSubido(url, thumbnailUrl)
      toast.success('Video subido exitosamente')
      
      // Resetear después de un momento
      setTimeout(() => {
        setProgreso(0)
      }, 1000)
    } catch (error: any) {
      console.error('Error al subir video:', error)
      toast.error(error.message || 'Error al subir video')
    } finally {
      setSubiendo(false)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  const formatearTamaño = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Vista previa del video actual */}
      {videoActual && !subiendo && (
        <div className="relative bg-fondo rounded-lg overflow-hidden">
          <video
            src={videoActual}
            controls
            className="w-full max-h-64 object-contain"
          >
            Tu navegador no soporta el elemento de video.
          </video>
          <div className="absolute top-2 right-2">
            <button
              onClick={() => onVideoSubido('')}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
              title="Eliminar video"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Área de subida */}
      <div className="border-2 border-dashed border-fondo-terciario rounded-lg p-6 text-center hover:border-primario transition-colors">
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
          onChange={manejarArchivo}
          disabled={subiendo}
          className="hidden"
          id="video-upload"
        />
        
        {subiendo ? (
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto">
              <svg className="animate-spin text-primario" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Subiendo video...</p>
              <div className="w-full bg-fondo-terciario rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primario h-full transition-all duration-300"
                  style={{ width: `${progreso}%` }}
                />
              </div>
              <p className="text-xs text-texto-terciario mt-1">{progreso}%</p>
            </div>
          </div>
        ) : (
          <label htmlFor="video-upload" className="cursor-pointer">
            <div className="w-16 h-16 mx-auto mb-4 text-texto-terciario">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium mb-1">
              Haz clic para subir un video
            </p>
            <p className="text-xs text-texto-terciario">
              MP4, WebM, MOV o AVI (máx. 500 MB)
            </p>
          </label>
        )}
      </div>

      {/* Información adicional */}
      <div className="bg-fondo-secundario rounded-lg p-4 text-sm">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <span>ℹ️</span>
          Recomendaciones para videos
        </h4>
        <ul className="space-y-1 text-texto-secundario text-xs">
          <li>• Formato recomendado: MP4 (H.264)</li>
          <li>• Resolución: 1920x1080 (Full HD) o menor</li>
          <li>• Tamaño máximo: 500 MB</li>
          <li>• Para videos más grandes, usa YouTube o Vimeo</li>
          <li>• Comprime el video antes de subirlo para mejor rendimiento</li>
        </ul>
      </div>
    </div>
  )
}
