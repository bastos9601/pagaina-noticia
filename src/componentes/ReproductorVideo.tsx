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
  const [pantallaCompleta, setPantallaCompleta] = useState(false)
  const manifestCargadoRef = useRef(false)
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Manejar pantalla completa
  const togglePantallaCompleta = () => {
    if (!contenedorRef.current) return

    if (!document.fullscreenElement) {
      contenedorRef.current.requestFullscreen().then(() => {
        setPantallaCompleta(true)
        // Rotar a horizontal en móviles
        if (screen.orientation && 'lock' in screen.orientation) {
          (screen.orientation as any).lock('landscape').catch(() => {})
        }
      }).catch((err) => {
        console.error('Error al entrar en pantalla completa:', err)
      })
    } else {
      document.exitFullscreen().then(() => {
        setPantallaCompleta(false)
        // Volver a orientación natural
        if (screen.orientation && 'unlock' in screen.orientation) {
          (screen.orientation as any).unlock()
        }
      })
    }
  }

  // Detectar cambios de pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      setPantallaCompleta(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // Auto-ocultar error después de 3 segundos
  useEffect(() => {
    if (error) {
      errorTimeoutRef.current = setTimeout(() => {
        setError(null)
      }, 3000)
    }

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
    }
  }, [error])

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

      // Si la URL es HTTP y estamos en HTTPS, usar el proxy interno
      let streamUrl = canal.url_stream
      if (typeof window !== 'undefined' && window.location.protocol === 'https:' && streamUrl.startsWith('http://')) {
        console.log('🔄 Stream HTTP detectado, usando proxy interno...')
        streamUrl = `/api/hls?url=${encodeURIComponent(streamUrl)}`
      }

      // Cargar HLS.js dinámicamente
      import('hls.js').then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          const hls = new Hls({
            debug: false,
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
            
            // Configuración optimizada para live streaming
            liveSyncDurationCount: 2,
            liveMaxLatencyDurationCount: Infinity,
            liveDurationInfinity: true,
            highBufferWatchdogPeriod: 1,
            
            // Buffer más grande para evitar interrupciones
            maxBufferLength: 90,
            maxMaxBufferLength: 180,
            maxBufferSize: 90 * 1000 * 1000,
            maxBufferHole: 0.3,
            
            // Timeouts y reintentos MUY agresivos
            manifestLoadingTimeOut: 8000,
            manifestLoadingMaxRetry: 20,
            manifestLoadingRetryDelay: 500,
            manifestLoadingMaxRetryTimeout: 64000,
            
            levelLoadingTimeOut: 8000,
            levelLoadingMaxRetry: 20,
            levelLoadingRetryDelay: 500,
            levelLoadingMaxRetryTimeout: 64000,
            
            fragLoadingTimeOut: 15000,
            fragLoadingMaxRetry: 20,
            fragLoadingRetryDelay: 500,
            fragLoadingMaxRetryTimeout: 64000,
            
            // Configuración de red
            xhrSetup: function (xhr: any) {
              xhr.withCredentials = false
              xhr.timeout = 15000
            },
            
            // Recuperación automática
            startFragPrefetch: true,
            testBandwidth: true,
            progressive: true,
            
            // ABR (Adaptive Bitrate) más conservador para estabilidad
            abrEwmaDefaultEstimate: 500000,
            abrBandWidthFactor: 0.8,
            abrBandWidthUpFactor: 0.6,
            abrMaxWithRealBitrate: false,
            startLevel: -1,
          })

          hls.loadSource(streamUrl)
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

          hls.on(Hls.Events.ERROR, (_event, data) => {
            // Validar que data existe y tiene las propiedades necesarias
            if (!data || typeof data !== 'object') {
              console.log('Error de HLS sin datos')
              return
            }
            
            console.log('HLS Error:', data.type, data.details, data.fatal)
            
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.log('Error de red fatal, recuperando...')
                  if (hlsRef.current) {
                    hls.startLoad()
                  }
                  break
                  
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.log('Error de media fatal, recuperando...')
                  hls.recoverMediaError()
                  setTimeout(() => {
                    if (hlsRef.current && videoRef.current?.error) {
                      hls.recoverMediaError()
                    }
                  }, 500)
                  break
                  
                default:
                  console.log('Error fatal, recargando stream...')
                  setTimeout(() => {
                    if (hlsRef.current && videoRef.current) {
                      hls.destroy()
                      const newHls = new Hls({
                        debug: false,
                        enableWorker: true,
                        lowLatencyMode: true,
                        liveDurationInfinity: true,
                        manifestLoadingMaxRetry: 20,
                        levelLoadingMaxRetry: 20,
                        fragLoadingMaxRetry: 20,
                      })
                      newHls.loadSource(canal.url_stream)
                      newHls.attachMedia(videoRef.current)
                      hlsRef.current = newHls
                    }
                  }, 1000)
                  break
              }
            }
          })

          // Monitorear el estado del buffer
          hls.on(Hls.Events.BUFFER_APPENDING, () => {
            // Buffer agregándose correctamente
            if (cargando) setCargando(false)
          })

          // Timeout para carga inicial
          timeoutId = setTimeout(() => {
            if (!manifestCargadoRef.current) {
              setError('El stream está tardando demasiado')
              setCargando(false)
              if (hlsRef.current) {
                hlsRef.current.destroy()
                hlsRef.current = null
              }
            }
          }, 30000)

          // Detectar cuando el stream se detiene y reiniciar
          let lastTime = 0
          let stallCount = 0
          const checkStall = setInterval(() => {
            if (videoRef.current && !videoRef.current.paused) {
              const currentTime = videoRef.current.currentTime
              if (currentTime === lastTime && !videoRef.current.seeking) {
                stallCount++
                if (stallCount > 2) {
                  console.log('Stream detenido, reiniciando...')
                  if (hlsRef.current) {
                    hlsRef.current.startLoad()
                  }
                  stallCount = 0
                }
              } else {
                stallCount = 0
              }
              lastTime = currentTime
            }
          }, 1500)

          // Limpiar interval y timeout al desmontar
          return () => {
            if (timeoutId) clearTimeout(timeoutId)
            clearInterval(checkStall)
            if (hlsRef.current) {
              hlsRef.current.destroy()
              hlsRef.current = null
            }
          }

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
      
      {/* Botón de pantalla completa */}
      <button
        onClick={togglePantallaCompleta}
        className="absolute top-4 left-4 z-20 bg-black/60 hover:bg-black/80 text-white p-3 rounded-lg transition-all"
        title={pantallaCompleta ? 'Salir de pantalla completa' : 'Pantalla completa'}
      >
        {pantallaCompleta ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        )}
      </button>
      
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
