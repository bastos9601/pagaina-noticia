'use client'

import { useEffect, useRef, useState } from 'react'
import { Canal } from '@/tipos'
import { extraerIdYoutube, extraerCanalTwitch } from '@/lib/utilidades'

interface Props {
  canal: Canal
}

export default function ReproductorVideo({ canal }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const contenedorRef = useRef<HTMLDivElement>(null)
  const hlsRef = useRef<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const manifestCargadoRef = useRef(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null
    manifestCargadoRef.current = false
    
    // MP4 y MKV - Video directo
    if ((canal.tipo === 'mp4' || canal.tipo === 'mkv') && videoRef.current) {
      setCargando(true)
      setError(null)
      
      const video = videoRef.current
      video.src = canal.url_stream
      
      const handleLoadedMetadata = () => {
        manifestCargadoRef.current = true
        setCargando(false)
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
      }
      
      const handleCanPlay = () => {
        manifestCargadoRef.current = true
        setCargando(false)
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
      }
      
      const handleError = (e: Event) => {
        console.error('Error al cargar video:', e)
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
        setError('No se puede reproducir este video. Verifica que la URL sea correcta y que el servidor permita el acceso.')
        setCargando(false)
      }
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('error', handleError)
      
      timeoutId = setTimeout(() => {
        if (!manifestCargadoRef.current) {
          setError('El video está tardando demasiado en cargar')
          setCargando(false)
        }
      }, 30000)
      
      return () => {
        if (timeoutId) clearTimeout(timeoutId)
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('error', handleError)
      }
    }
    
    // HLS
    if (canal.tipo === 'hls' && videoRef.current) {
      setCargando(true)
      setError(null)

      // Cargar HLS.js dinámicamente
      import('hls.js').then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
            maxBufferLength: 30,
            maxMaxBufferLength: 60,
            manifestLoadingTimeOut: 20000,
            manifestLoadingMaxRetry: 6,
            levelLoadingTimeOut: 20000,
            levelLoadingMaxRetry: 6,
            fragLoadingTimeOut: 30000,
            fragLoadingMaxRetry: 8,
            xhrSetup: function (xhr: any, url: string) {
              xhr.withCredentials = false
            },
          })

          hls.loadSource(canal.url_stream)
          hls.attachMedia(videoRef.current!)
          hlsRef.current = hls

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            manifestCargadoRef.current = true
            setCargando(false)
            if (timeoutId) {
              clearTimeout(timeoutId)
              timeoutId = null
            }
            videoRef.current?.play().catch((err) => {
              console.log('Autoplay bloqueado:', err)
            })
          })

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data)
            
            if (data.fatal) {
              let errorMsg = 'Error al reproducir'
              
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  errorMsg = 'Error de conexión'
                  console.log('Error de red, intentando recuperar...')
                  setTimeout(() => {
                    if (hlsRef.current) {
                      hls.startLoad()
                    }
                  }, 2000)
                  break
                  
                case Hls.ErrorTypes.MEDIA_ERROR:
                  errorMsg = 'Error de reproducción'
                  console.log('Error de media, intentando recuperar...')
                  hls.recoverMediaError()
                  break
                  
                default:
                  errorMsg = 'Stream no disponible'
                  if (timeoutId) clearTimeout(timeoutId)
                  setCargando(false)
                  break
              }
              
              setError(errorMsg)
            }
          })

          // Timeout más largo
          timeoutId = setTimeout(() => {
            if (!manifestCargadoRef.current) {
              setError('El stream está tardando demasiado. Verifica que la URL sea correcta y que el stream esté disponible.')
              setCargando(false)
              if (hlsRef.current) {
                hlsRef.current.destroy()
                hlsRef.current = null
              }
            }
          }, 30000) // 30 segundos

        } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari nativo
          videoRef.current.src = canal.url_stream
          videoRef.current.addEventListener('loadedmetadata', () => {
            manifestCargadoRef.current = true
            setCargando(false)
            if (timeoutId) {
              clearTimeout(timeoutId)
              timeoutId = null
            }
          })
          videoRef.current.addEventListener('error', () => {
            if (timeoutId) {
              clearTimeout(timeoutId)
              timeoutId = null
            }
            setError('Error al cargar el stream')
            setCargando(false)
          })
          
          timeoutId = setTimeout(() => {
            if (!manifestCargadoRef.current) {
              setError('El stream está tardando demasiado')
              setCargando(false)
            }
          }, 30000)
        } else {
          setError('Tu navegador no soporta HLS')
          setCargando(false)
        }
      }).catch((err) => {
        console.error('Error al cargar HLS.js:', err)
        setError('Error al cargar el reproductor')
        setCargando(false)
      })
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [canal])

  // YouTube
  if (canal.tipo === 'youtube') {
    const videoId = extraerIdYoutube(canal.url_stream)
    if (!videoId) {
      return (
        <div className="w-full aspect-video bg-fondo-secundario rounded-lg flex items-center justify-center">
          <p className="text-texto-secundario">URL de YouTube inválida</p>
        </div>
      )
    }
    
    return (
      <div className="relative w-full pt-[56.25%]">
        <iframe
          className="absolute inset-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {canal.mostrar_watermark !== false && (
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <img 
              src="/noticias-live.png" 
              alt="Noticias Live" 
              className="h-12 w-auto opacity-70"
            />
          </div>
        )}
      </div>
    )
  }

  // Twitch
  if (canal.tipo === 'twitch') {
    const canalNombre = extraerCanalTwitch(canal.url_stream)
    if (!canalNombre) {
      return (
        <div className="w-full aspect-video bg-fondo-secundario rounded-lg flex items-center justify-center">
          <p className="text-texto-secundario">URL de Twitch inválida</p>
        </div>
      )
    }
    
    return (
      <div className="relative w-full pt-[56.25%]">
        <iframe
          className="absolute inset-0 w-full h-full rounded-lg"
          src={`https://player.twitch.tv/?channel=${canalNombre}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`}
          allowFullScreen
        />
        {canal.mostrar_watermark !== false && (
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <img 
              src="/noticias-live.png" 
              alt="Noticias Live" 
              className="h-12 w-auto opacity-70"
            />
          </div>
        )}
      </div>
    )
  }

  // iFrame personalizado
  if (canal.tipo === 'iframe') {
    return (
      <div className="relative w-full pt-[56.25%]">
        <iframe
          className="absolute inset-0 w-full h-full rounded-lg"
          src={canal.url_stream}
          allowFullScreen
        />
        {canal.mostrar_watermark !== false && (
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <img 
              src="/noticias-live.png" 
              alt="Noticias Live" 
              className="h-12 w-auto opacity-70"
            />
          </div>
        )}
      </div>
    )
  }

  // HLS, MP4, MKV - Reproductor de video nativo
  return (
    <div ref={contenedorRef} className="relative w-full bg-black rounded-lg overflow-hidden">
      {cargando && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primario border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-white text-sm">Cargando stream...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
          <div className="text-center px-4 max-w-md">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-white text-sm mb-3">No se puede reproducir este stream</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primario hover:bg-primario-oscuro text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}
      
      {canal.mostrar_watermark !== false && (
        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <img 
            src="/noticias-live.png" 
            alt="Noticias Live" 
            className="h-12 w-auto opacity-70"
          />
        </div>
      )}
      
      <video
        ref={videoRef}
        className="w-full aspect-video"
        controls
        autoPlay
        muted
        playsInline
      >
        Tu navegador no soporta video HTML5.
      </video>
    </div>
  )
}
