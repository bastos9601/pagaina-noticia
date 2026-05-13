// Tipos de base de datos
export interface Usuario {
  id: string
  nombre: string
  correo: string
  rol: 'admin' | 'usuario'
  fecha_creacion: string
}

export interface Noticia {
  id: string
  titulo: string
  slug: string
  contenido: any
  imagen: string
  video_url?: string
  video_tipo?: 'youtube' | 'vimeo' | 'mp4' | 'hls'
  video_thumbnail?: string
  categoria_id: string
  autor_id: string
  destacada: boolean
  publicada: boolean
  vistas: number
  fecha_creacion: string
  fecha_actualizacion?: string
  categoria?: Categoria
  autor?: Usuario
}

export interface Categoria {
  id: string
  nombre: string
  slug: string
  descripcion?: string
  color?: string
}

export interface Canal {
  id: string
  nombre: string
  descripcion: string
  logo: string
  url_stream: string
  tipo: 'hls' | 'youtube' | 'twitch' | 'iframe' | 'mp4' | 'mkv'
  categoria: string
  activo: boolean
  mostrar_watermark?: boolean
  fecha_creacion: string
}

export interface Publicidad {
  id: string
  titulo: string
  imagen: string
  enlace: string
  activo: boolean
  posicion: 'superior' | 'lateral' | 'contenido'
  fecha_inicio?: string
  fecha_fin?: string
}

// Tipos de formularios
export interface FormularioNoticia {
  titulo: string
  contenido: any
  imagen: string
  video_url?: string
  video_tipo?: 'youtube' | 'vimeo' | 'mp4' | 'hls'
  video_thumbnail?: string
  categoria_id: string
  destacada: boolean
  publicada: boolean
}

export interface FormularioCanal {
  nombre: string
  descripcion: string
  logo: string
  url_stream: string
  tipo: 'hls' | 'youtube' | 'twitch' | 'iframe' | 'mp4' | 'mkv'
  categoria: string
  activo: boolean
  mostrar_watermark?: boolean
}

export interface FormularioCategoria {
  nombre: string
  descripcion?: string
  color?: string
}

// Tipos de respuesta
export interface RespuestaAPI<T = any> {
  exito: boolean
  datos?: T
  error?: string
  mensaje?: string
}

// Tipos de paginación
export interface Paginacion {
  pagina: number
  limite: number
  total: number
  paginas: number
}

export interface RespuestaPaginada<T> {
  datos: T[]
  paginacion: Paginacion
}
