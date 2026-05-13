'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Props {
  onImagenSubida: (url: string) => void
  imagenActual?: string
  carpeta?: string
}

export default function SubidorImagen({ onImagenSubida, imagenActual, carpeta = 'general' }: Props) {
  const [subiendo, setSubiendo] = useState(false)
  const [previsualizacion, setPrevisualizacion] = useState<string | null>(imagenActual || null)
  const inputRef = useRef<HTMLInputElement>(null)

  const manejarSeleccionArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0]
    if (!archivo) return

    // Validar tipo de archivo
    if (!archivo.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida')
      return
    }

    // Validar tamaño (máximo 5MB)
    if (archivo.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 5MB')
      return
    }

    // Mostrar previsualización
    const reader = new FileReader()
    reader.onloadend = () => {
      setPrevisualizacion(reader.result as string)
    }
    reader.readAsDataURL(archivo)

    // Subir a Supabase
    setSubiendo(true)
    try {
      const extension = archivo.name.split('.').pop()
      const nombreArchivo = `${carpeta}/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`

      const { data, error } = await supabase.storage
        .from('imagenes')
        .upload(nombreArchivo, archivo, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('imagenes')
        .getPublicUrl(nombreArchivo)

      onImagenSubida(publicUrl)
      toast.success('Imagen subida exitosamente')
    } catch (error: any) {
      console.error('Error al subir imagen:', error)
      toast.error('Error al subir la imagen')
      setPrevisualizacion(imagenActual || null)
    } finally {
      setSubiendo(false)
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={manejarSeleccionArchivo}
        className="hidden"
      />

      {previsualizacion ? (
        <div className="space-y-3">
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-fondo-terciario border-2 border-fondo-terciario">
            <img
              src={previsualizacion}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            {subiendo && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-white text-sm">Subiendo...</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={subiendo}
              className="flex-1 bg-fondo-terciario hover:bg-fondo text-texto-primario px-4 py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
            >
              Cambiar Imagen
            </button>
            <button
              type="button"
              onClick={() => {
                setPrevisualizacion(null)
                onImagenSubida('')
              }}
              disabled={subiendo}
              className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50"
            >
              Eliminar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={subiendo}
          className="w-full h-48 border-2 border-dashed border-fondo-terciario rounded-lg hover:border-primario transition-colors flex flex-col items-center justify-center gap-3 disabled:opacity-50"
        >
          <div className="w-16 h-16 bg-fondo-secundario rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-texto-secundario" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-texto-primario font-medium mb-1">
              Haz clic para subir una imagen
            </p>
            <p className="text-texto-terciario text-sm">
              PNG, JPG, GIF hasta 5MB
            </p>
          </div>
        </button>
      )}
    </div>
  )
}
