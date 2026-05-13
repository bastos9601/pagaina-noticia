'use client'

import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'

interface Props {
  onBannerCreado: (imagenUrl: string) => void
}

export default function CreadorBanner({ onBannerCreado }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [config, setConfig] = useState({
    texto: '',
    subtexto: '',
    colorFondo: '#1a1a1a',
    colorTexto: '#ffffff',
    colorSubtexto: '#9ca3af',
    tamanoTexto: 48,
    tamanoSubtexto: 24,
    ancho: 800,
    alto: 400,
    alineacion: 'center' as 'left' | 'center' | 'right',
    imagenFondo: null as string | null,
    opacidadFondo: 0.5,
    sombraTexto: true,
  })

  useEffect(() => {
    dibujarBanner()
  }, [config])

  const dibujarBanner = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Limpiar canvas
    ctx.fillStyle = config.colorFondo
    ctx.fillRect(0, 0, config.ancho, config.alto)

    // Dibujar imagen de fondo si existe
    if (config.imagenFondo) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        // Dibujar imagen
        ctx.globalAlpha = config.opacidadFondo
        ctx.drawImage(img, 0, 0, config.ancho, config.alto)
        ctx.globalAlpha = 1
        
        // Dibujar overlay de color
        ctx.fillStyle = config.colorFondo
        ctx.globalAlpha = 1 - config.opacidadFondo
        ctx.fillRect(0, 0, config.ancho, config.alto)
        ctx.globalAlpha = 1
        
        // Dibujar textos
        dibujarTextos(ctx)
      }
      img.src = config.imagenFondo
    } else {
      dibujarTextos(ctx)
    }
  }

  const dibujarTextos = (ctx: CanvasRenderingContext2D) => {
    // Configurar alineación
    ctx.textAlign = config.alineacion

    let x = config.ancho / 2
    if (config.alineacion === 'left') x = 40
    if (config.alineacion === 'right') x = config.ancho - 40

    // Dibujar texto principal
    if (config.texto) {
      ctx.fillStyle = config.colorTexto
      ctx.font = `bold ${config.tamanoTexto}px Arial, sans-serif`
      
      // Sombra del texto
      if (config.sombraTexto) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2
      }
      
      const lineas = dividirTexto(ctx, config.texto, config.ancho - 80)
      const alturaTotal = lineas.length * config.tamanoTexto * 1.2
      let y = (config.alto - alturaTotal) / 2 + config.tamanoTexto

      if (config.subtexto) {
        y -= config.tamanoSubtexto / 2
      }

      lineas.forEach((linea, i) => {
        ctx.fillText(linea, x, y + i * config.tamanoTexto * 1.2)
      })
      
      // Resetear sombra
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    }

    // Dibujar subtexto
    if (config.subtexto) {
      ctx.fillStyle = config.colorSubtexto
      ctx.font = `${config.tamanoSubtexto}px Arial, sans-serif`
      
      // Sombra del subtexto
      if (config.sombraTexto) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
        ctx.shadowBlur = 8
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2
      }
      
      const lineasSub = dividirTexto(ctx, config.subtexto, config.ancho - 80)
      let y = config.alto / 2 + config.tamanoTexto + 20

      lineasSub.forEach((linea, i) => {
        ctx.fillText(linea, x, y + i * config.tamanoSubtexto * 1.2)
      })
      
      // Resetear sombra
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    }
  }

  const manejarImagenFondo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setConfig({ ...config, imagenFondo: event.target?.result as string })
    }
    reader.readAsDataURL(file)
  }

  const dividirTexto = (ctx: CanvasRenderingContext2D, texto: string, maxAncho: number): string[] => {
    const palabras = texto.split(' ')
    const lineas: string[] = []
    let lineaActual = ''

    palabras.forEach(palabra => {
      const prueba = lineaActual + (lineaActual ? ' ' : '') + palabra
      const medida = ctx.measureText(prueba)
      
      if (medida.width > maxAncho && lineaActual) {
        lineas.push(lineaActual)
        lineaActual = palabra
      } else {
        lineaActual = prueba
      }
    })

    if (lineaActual) {
      lineas.push(lineaActual)
    }

    return lineas
  }

  const descargarBanner = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (!blob) return
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `banner-${Date.now()}.png`
      a.click()
      URL.revokeObjectURL(url)
      
      toast.success('Banner descargado')
    }, 'image/png')
  }

  const usarBanner = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob(async (blob) => {
      if (!blob) return
      
      // Convertir a base64 para usar directamente
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        onBannerCreado(base64)
        toast.success('Banner listo para usar')
      }
      reader.readAsDataURL(blob)
    }, 'image/png')
  }

  const plantillas = [
    {
      nombre: 'Oscuro Moderno',
      config: {
        colorFondo: '#1a1a1a',
        colorTexto: '#ffffff',
        colorSubtexto: '#9ca3af',
      }
    },
    {
      nombre: 'Azul Profesional',
      config: {
        colorFondo: '#1e40af',
        colorTexto: '#ffffff',
        colorSubtexto: '#bfdbfe',
      }
    },
    {
      nombre: 'Rojo Vibrante',
      config: {
        colorFondo: '#dc2626',
        colorTexto: '#ffffff',
        colorSubtexto: '#fecaca',
      }
    },
    {
      nombre: 'Verde Fresco',
      config: {
        colorFondo: '#059669',
        colorTexto: '#ffffff',
        colorSubtexto: '#d1fae5',
      }
    },
  ]

  const tamanosComunes = [
    { nombre: 'Leaderboard', ancho: 728, alto: 90 },
    { nombre: 'Banner Mediano', ancho: 468, alto: 60 },
    { nombre: 'Rectángulo Grande', ancho: 336, alto: 280 },
    { nombre: 'Rectángulo Mediano', ancho: 300, alto: 250 },
    { nombre: 'Banner Ancho', ancho: 800, alto: 400 },
    { nombre: 'Skyscraper', ancho: 160, alto: 600 },
    { nombre: 'Cuadrado', ancho: 250, alto: 250 },
    { nombre: 'Banner Grande', ancho: 970, alto: 250 },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-fondo-secundario rounded-lg p-6 border border-fondo-terciario">
        <h3 className="text-xl font-bold mb-4">🎨 Creador de Banners</h3>
        
        {/* Vista previa */}
        <div className="mb-6 bg-fondo rounded-lg p-4">
          <p className="text-sm text-texto-secundario mb-3">Vista previa:</p>
          <div className="flex justify-center overflow-auto">
            <canvas
              ref={canvasRef}
              width={config.ancho}
              height={config.alto}
              className="border border-fondo-terciario rounded-lg max-w-full"
            />
          </div>
        </div>

        {/* Tamaños comunes */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Tamaños comunes:</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {tamanosComunes.map((tamano) => (
              <button
                key={tamano.nombre}
                onClick={() => setConfig({ ...config, ancho: tamano.ancho, alto: tamano.alto })}
                className="px-3 py-2 bg-fondo hover:bg-fondo-terciario rounded-lg text-xs transition-colors border border-fondo-terciario"
              >
                {tamano.nombre}
                <div className="text-texto-terciario text-xs mt-1">
                  {tamano.ancho}×{tamano.alto}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Plantillas rápidas */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Plantillas de color:</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {plantillas.map((plantilla) => (
              <button
                key={plantilla.nombre}
                onClick={() => setConfig({ ...config, ...plantilla.config })}
                className="px-3 py-2 bg-fondo hover:bg-fondo-terciario rounded-lg text-sm transition-colors border border-fondo-terciario"
              >
                {plantilla.nombre}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Textos */}
          <div>
            <label className="block text-sm font-medium mb-2">Texto principal:</label>
            <input
              type="text"
              value={config.texto}
              onChange={(e) => setConfig({ ...config, texto: e.target.value })}
              className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
              placeholder="Tu mensaje aquí"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subtexto:</label>
            <input
              type="text"
              value={config.subtexto}
              onChange={(e) => setConfig({ ...config, subtexto: e.target.value })}
              className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
              placeholder="Descripción adicional"
            />
          </div>

          {/* Colores */}
          <div>
            <label className="block text-sm font-medium mb-2">Color de fondo:</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.colorFondo}
                onChange={(e) => setConfig({ ...config, colorFondo: e.target.value })}
                className="w-16 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.colorFondo}
                onChange={(e) => setConfig({ ...config, colorFondo: e.target.value })}
                className="flex-1 bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
              />
            </div>
          </div>

          {/* Imagen de fondo */}
          <div>
            <label className="block text-sm font-medium mb-2">Imagen de fondo (opcional):</label>
            <input
              type="file"
              accept="image/*"
              onChange={manejarImagenFondo}
              className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario text-sm"
            />
            {config.imagenFondo && (
              <button
                onClick={() => setConfig({ ...config, imagenFondo: null })}
                className="mt-2 text-xs text-red-500 hover:underline"
              >
                Eliminar imagen de fondo
              </button>
            )}
          </div>

          {config.imagenFondo && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Opacidad de imagen: {Math.round(config.opacidadFondo * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.opacidadFondo}
                onChange={(e) => setConfig({ ...config, opacidadFondo: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Color del texto:</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.colorTexto}
                onChange={(e) => setConfig({ ...config, colorTexto: e.target.value })}
                className="w-16 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.colorTexto}
                onChange={(e) => setConfig({ ...config, colorTexto: e.target.value })}
                className="flex-1 bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color del subtexto:</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.colorSubtexto}
                onChange={(e) => setConfig({ ...config, colorSubtexto: e.target.value })}
                className="w-16 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.colorSubtexto}
                onChange={(e) => setConfig({ ...config, colorSubtexto: e.target.value })}
                className="flex-1 bg-fondo border border-fondo-terciario rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primario"
              />
            </div>
          </div>

          {/* Tamaños */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tamaño texto: {config.tamanoTexto}px
            </label>
            <input
              type="range"
              min="20"
              max="80"
              value={config.tamanoTexto}
              onChange={(e) => setConfig({ ...config, tamanoTexto: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tamaño subtexto: {config.tamanoSubtexto}px
            </label>
            <input
              type="range"
              min="12"
              max="40"
              value={config.tamanoSubtexto}
              onChange={(e) => setConfig({ ...config, tamanoSubtexto: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Dimensiones */}
          <div>
            <label className="block text-sm font-medium mb-2">Ancho: {config.ancho}px</label>
            <input
              type="range"
              min="400"
              max="1200"
              step="50"
              value={config.ancho}
              onChange={(e) => setConfig({ ...config, ancho: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Alto: {config.alto}px</label>
            <input
              type="range"
              min="200"
              max="600"
              step="50"
              value={config.alto}
              onChange={(e) => setConfig({ ...config, alto: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Alineación */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Alineación del texto:</label>
            <div className="flex gap-2">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => setConfig({ ...config, alineacion: align })}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    config.alineacion === align
                      ? 'bg-primario text-white'
                      : 'bg-fondo hover:bg-fondo-terciario border border-fondo-terciario'
                  }`}
                >
                  {align === 'left' ? 'Izquierda' : align === 'center' ? 'Centro' : 'Derecha'}
                </button>
              ))}
            </div>
          </div>

          {/* Sombra de texto */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="sombraTexto"
                checked={config.sombraTexto}
                onChange={(e) => setConfig({ ...config, sombraTexto: e.target.checked })}
                className="w-5 h-5 rounded border-fondo-terciario text-primario focus:ring-2 focus:ring-primario"
              />
              <label htmlFor="sombraTexto" className="text-sm font-medium cursor-pointer">
                Agregar sombra al texto (mejora legibilidad)
              </label>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={usarBanner}
            className="flex-1 bg-primario hover:bg-primario-oscuro text-white py-3 rounded-lg font-semibold transition-colors"
          >
            ✓ Usar este Banner
          </button>
          <button
            onClick={descargarBanner}
            className="px-6 py-3 bg-fondo hover:bg-fondo-terciario border border-fondo-terciario rounded-lg font-semibold transition-colors"
          >
            ⬇ Descargar
          </button>
        </div>
      </div>
    </div>
  )
}
