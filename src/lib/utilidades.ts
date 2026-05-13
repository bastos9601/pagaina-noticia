import slugify from 'slugify'

// Generar slug desde texto
export function generarSlug(texto: string): string {
  return slugify(texto, {
    lower: true,
    strict: true,
    locale: 'es',
  })
}

// Formatear fecha
export function formatearFecha(fecha: string): string {
  const date = new Date(fecha)
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

// Formatear fecha relativa
export function formatearFechaRelativa(fecha: string): string {
  const ahora = new Date()
  const fechaObj = new Date(fecha)
  const diferencia = ahora.getTime() - fechaObj.getTime()
  
  const minutos = Math.floor(diferencia / 60000)
  const horas = Math.floor(diferencia / 3600000)
  const dias = Math.floor(diferencia / 86400000)
  
  if (minutos < 1) return 'Hace un momento'
  if (minutos < 60) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`
  if (horas < 24) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`
  if (dias < 7) return `Hace ${dias} día${dias > 1 ? 's' : ''}`
  
  return formatearFecha(fecha)
}

// Truncar texto
export function truncarTexto(texto: string, longitud: number = 150): string {
  if (texto.length <= longitud) return texto
  return texto.substring(0, longitud).trim() + '...'
}

// Validar URL
export function esUrlValida(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Extraer ID de YouTube
export function extraerIdYoutube(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

// Extraer canal de Twitch
export function extraerCanalTwitch(url: string): string | null {
  const regex = /twitch\.tv\/([a-zA-Z0-9_]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

// Sanitizar HTML básico
export function sanitizarHTML(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
}

// Generar color aleatorio
export function generarColorAleatorio(): string {
  const colores = [
    '#DC2626', '#EA580C', '#D97706', '#65A30D',
    '#059669', '#0891B2', '#2563EB', '#7C3AED',
    '#C026D3', '#DB2777'
  ]
  return colores[Math.floor(Math.random() * colores.length)]
}
