'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  url: string
  autoPlay?: boolean
}

export default function ReproductorHLSPreview({ url, autoPlay = true }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!videoRef.current) return

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
        })

        hls.loadSource(url)
        hls.attachMedia(videoRef.current!)
        hlsRef.current = hls

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setCargando(false)
          if (autoPlay) {
            videoRef.current?.play().catch((err) => {
              console.log('Autoplay bloqueado:', err)
            })
          }
        })

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data)
          
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setError('Error de conexión con el stream')
                setTimeout(() => {
                  if (hlsRef.current) {
                    hls.startLoad()
                  }
                }, 2000)
                break
                
              case Hls.ErrorTypes.MEDIA_ERROR:
                setError('Error de reproducción')
                hls.recoverMediaError()
                break
                
              default:
                setError('Stream no disponible')
                setCargando(false)
                break
            }
          }
        })

      } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari nativo
        videoRef.current.src = url
        videoRef.current.addEventListener('loadedmetadata', () => {
          setCargando(false)
        })
        videoRef.current.addEventListener('error', () => {
          setError('Error al cargar el stream')
          setCargando(false)
        })
      } else {
        setError('Tu navegador no soporta HLS')
        setCargando(false)
      }
    }).catch((err) => {
      console.error('Error al cargar HLS.js:', err)
      setError('Error al cargar el reproductor')
      setCargando(false)
    })

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [url, autoPlay])

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
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
          <div className="text-center px-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-white text-sm">{error}</p>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="w-full aspect-video"
        controls
        playsInline
      >
        Tu navegador no soporta video HTML5.
      </video>
    </div>
  )
}
