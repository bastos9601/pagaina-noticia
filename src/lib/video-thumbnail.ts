/**
 * Genera una miniatura de un video subido
 * Captura un frame del video y lo convierte en imagen
 */
export async function generarMiniaturaVideo(videoUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.src = videoUrl
    video.muted = true
    video.playsInline = true
    video.preload = 'metadata'

    let intentoActual = 0
    const tiemposAIntentar = [2, 3, 5, 1, 0.5] // Intentar en diferentes momentos

    const esImagenNegra = (canvas: HTMLCanvasElement): boolean => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return true

      // Obtener datos de píxeles del centro de la imagen
      const imageData = ctx.getImageData(
        canvas.width / 4,
        canvas.height / 4,
        canvas.width / 2,
        canvas.height / 2
      )
      
      const data = imageData.data
      let sumaLuminosidad = 0
      
      // Calcular luminosidad promedio
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        sumaLuminosidad += (r + g + b) / 3
      }
      
      const luminosidadPromedio = sumaLuminosidad / (data.length / 4)
      
      // Si la luminosidad promedio es muy baja (< 15), considerarlo negro
      return luminosidadPromedio < 15
    }

    const capturarFrame = () => {
      try {
        // Verificar que el video tenga dimensiones válidas
        if (video.videoWidth === 0 || video.videoHeight === 0) {
          reject(new Error('El video no tiene dimensiones válidas'))
          return
        }

        // Crear canvas para capturar el frame
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('No se pudo crear el contexto del canvas'))
          return
        }

        // Dibujar el frame actual del video en el canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Verificar si la imagen es negra
        if (esImagenNegra(canvas) && intentoActual < tiemposAIntentar.length - 1) {
          // Intentar con el siguiente tiempo
          intentoActual++
          video.currentTime = tiemposAIntentar[intentoActual]
          return
        }

        // Convertir el canvas a blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('No se pudo generar la miniatura'))
            return
          }

          // Convertir blob a base64
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
          reader.onerror = () => {
            reject(new Error('Error al leer la miniatura'))
          }
          reader.readAsDataURL(blob)
        }, 'image/jpeg', 0.85)
      } catch (error) {
        reject(error)
      }
    }

    video.addEventListener('loadedmetadata', () => {
      // Comenzar con el primer tiempo a intentar
      video.currentTime = tiemposAIntentar[intentoActual]
    })

    video.addEventListener('seeked', () => {
      // Esperar un poco después del seek para asegurar que el frame esté renderizado
      setTimeout(capturarFrame, 150)
    })

    video.addEventListener('error', (e) => {
      console.error('Error al cargar video:', e)
      reject(new Error('Error al cargar el video para generar miniatura'))
    })

    // Timeout de seguridad
    setTimeout(() => {
      reject(new Error('Timeout al generar miniatura'))
    }, 15000)

    // Intentar cargar el video
    video.load()
  })
}

/**
 * Sube una miniatura generada a Supabase Storage
 */
export async function subirMiniaturaVideo(
  miniaturaBase64: string,
  carpeta: string = 'noticias'
): Promise<string> {
  try {
    // Convertir base64 a blob
    const response = await fetch(miniaturaBase64)
    const blob = await response.blob()

    // Crear un archivo desde el blob
    const nombreArchivo = `${carpeta}/thumbnail-${Date.now()}.jpg`
    const archivo = new File([blob], nombreArchivo, { type: 'image/jpeg' })

    // Subir usando el servicio de storage
    const { subirImagen } = await import('@/servicios/storage')
    const url = await subirImagen(archivo, carpeta)

    return url
  } catch (error) {
    console.error('Error al subir miniatura:', error)
    throw error
  }
}
