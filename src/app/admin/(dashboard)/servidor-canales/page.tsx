'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import ReproductorHLSPreview from '@/componentes/ReproductorHLSPreview'

export default function PaginaServidorCanales() {
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [autenticado, setAutenticado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [canalesDisponibles, setCanalesDisponibles] = useState<any[]>([])
  const [canalesSeleccionados, setCanalesSeleccionados] = useState<string[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [canalPreview, setCanalPreview] = useState<any | null>(null)
  const servidorUrl = 'https://azyleg.club:8443'

  const autenticar = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    try {
      // XtreamUI/XtreamCodes API - Obtener información del usuario
      const authUrl = `${servidorUrl}/player_api.php?username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(contrasena)}`
      
      const response = await fetch(authUrl).catch(() => null)

      if (!response || !response.ok) {
        toast.error('Error de autenticación. Verifica tus credenciales.')
        setCargando(false)
        return
      }

      const data = await response.json()
      
      // Verificar si la autenticación fue exitosa
      if (data.user_info && data.user_info.auth === 1) {
        // Obtener canales en vivo
        const canales = await obtenerCanales()
        setCanalesDisponibles(canales)
        setAutenticado(true)
        toast.success('Autenticación exitosa')
      } else {
        toast.error('Credenciales incorrectas')
      }
    } catch (error) {
      toast.error('No se pudo conectar al servidor')
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  const obtenerCanales = async () => {
    try {
      // XtreamUI/XtreamCodes API - Obtener lista de canales en vivo
      const canalesUrl = `${servidorUrl}/player_api.php?username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(contrasena)}&action=get_live_streams`
      
      const response = await fetch(canalesUrl).catch(() => null)

      if (response && response.ok) {
        const data = await response.json()
        
        // Transformar los canales al formato que necesitamos
        return data.map((canal: any) => ({
          id: canal.stream_id.toString(),
          nombre: canal.name,
          url: `${servidorUrl}/live/${usuario}/${contrasena}/${canal.stream_id}.m3u8`,
          tipo: 'hls',
          categoria: canal.category_name || 'General',
          logo: canal.stream_icon || ''
        }))
      }

      return []
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const toggleCanal = (canalId: string) => {
    if (canalesSeleccionados.includes(canalId)) {
      setCanalesSeleccionados(canalesSeleccionados.filter(id => id !== canalId))
    } else {
      setCanalesSeleccionados([...canalesSeleccionados, canalId])
    }
  }

  const importarCanales = async () => {
    if (canalesSeleccionados.length === 0) {
      toast.error('Selecciona al menos un canal')
      return
    }

    setCargando(true)

    try {
      const canalesAImportar = canalesDisponibles.filter(c => 
        canalesSeleccionados.includes(c.id)
      )

      for (const canal of canalesAImportar) {
        const response = await fetch('/api/admin/canales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: canal.nombre,
            descripcion: `Canal importado desde servidor externo - ${canal.categoria}`,
            logo: '', // No importar logo
            url_stream: canal.url,
            tipo: canal.tipo,
            categoria: canal.categoria,
            activo: true,
            mostrar_watermark: true,
          }),
        })

        if (!response.ok) {
          throw new Error(`Error al importar ${canal.nombre}`)
        }
      }

      toast.success(`${canalesSeleccionados.length} canales importados exitosamente`)
      setCanalesSeleccionados([])
      
      // Redirigir a la lista de canales
      setTimeout(() => {
        window.location.href = '/admin/canales'
      }, 1500)
    } catch (error) {
      toast.error('Error al importar canales')
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  const cerrarSesion = () => {
    setAutenticado(false)
    setUsuario('')
    setContrasena('')
    setCanalesDisponibles([])
    setCanalesSeleccionados([])
    setBusqueda('')
    setCanalPreview(null)
  }

  const abrirPreview = (canal: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setCanalPreview(canal)
  }

  const cerrarPreview = () => {
    setCanalPreview(null)
  }

  // Filtrar canales según búsqueda
  const canalesFiltrados = canalesDisponibles.filter(canal => 
    canal.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    canal.categoria.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (!autenticado) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Servidor de Streaming</h1>
          <p className="text-texto-secundario">
            Conéctate al servidor para importar canales para eventos especiales
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-fondo-secundario rounded-lg p-8 border border-fondo-terciario">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primario/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primario" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Autenticación Requerida</h2>
              <p className="text-sm text-texto-secundario">
                Ingresa tus credenciales del servidor
              </p>
            </div>

            <form onSubmit={autenticar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Usuario</label>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primario"
                  placeholder="usuario"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contraseña</label>
                <input
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primario"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="bg-fondo rounded-lg p-3">
                <p className="text-xs text-texto-terciario">
                  <span className="font-semibold">Servidor:</span> {servidorUrl}
                </p>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-primario hover:bg-primario-oscuro text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargando ? 'Conectando...' : 'Conectar al Servidor'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Canales Disponibles</h1>
          <p className="text-texto-secundario">
            Selecciona los canales que deseas importar para eventos especiales
          </p>
        </div>
        <button
          onClick={cerrarSesion}
          className="px-4 py-2 bg-fondo-terciario hover:bg-fondo rounded-lg transition-colors text-sm"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar canales por nombre o categoría..."
            className="w-full bg-fondo-secundario border border-fondo-terciario rounded-lg px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-primario"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-texto-secundario"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-texto-secundario hover:text-texto-primario"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-sm text-texto-secundario mt-2">
          {canalesFiltrados.length} de {canalesDisponibles.length} canales
        </p>
      </div>

      {canalesFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-fondo-secundario rounded-lg border border-fondo-terciario">
          <p className="text-texto-secundario">
            {busqueda ? `No se encontraron canales con "${busqueda}"` : 'No hay canales disponibles en el servidor'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {canalesFiltrados.map((canal) => (
              <div
                key={canal.id}
                className={`bg-fondo-secundario rounded-lg p-4 border-2 transition-all ${
                  canalesSeleccionados.includes(canal.id)
                    ? 'border-primario bg-primario/5'
                    : 'border-fondo-terciario hover:border-fondo'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div 
                    onClick={() => toggleCanal(canal.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 cursor-pointer ${
                      canalesSeleccionados.includes(canal.id)
                        ? 'bg-primario border-primario'
                        : 'border-fondo-terciario'
                    }`}
                  >
                    {canalesSeleccionados.includes(canal.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{canal.nombre}</h3>
                    <p className="text-xs text-texto-secundario mb-2">{canal.categoria}</p>
                    <button
                      onClick={(e) => abrirPreview(canal, e)}
                      className="mt-2 w-full bg-fondo-terciario hover:bg-fondo text-texto-primario px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Ver Canal
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-fondo-secundario rounded-lg p-6 border border-fondo-terciario">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold mb-1">
                  {canalesSeleccionados.length} canales seleccionados
                </p>
                <p className="text-sm text-texto-secundario">
                  Los canales se importarán a tu lista de canales
                </p>
              </div>
              <button
                onClick={importarCanales}
                disabled={cargando || canalesSeleccionados.length === 0}
                className="bg-primario hover:bg-primario-oscuro text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargando ? 'Importando...' : 'Importar Canales'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal de Preview */}
      {canalPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={cerrarPreview}>
          <div className="bg-fondo-secundario rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{canalPreview.nombre}</h2>
                  <p className="text-texto-secundario">{canalPreview.categoria}</p>
                </div>
                <button
                  onClick={cerrarPreview}
                  className="text-texto-secundario hover:text-texto-primario transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Reproductor */}
              <ReproductorHLSPreview url={canalPreview.url} autoPlay={true} />

              {/* Información del canal */}
              <div className="bg-fondo rounded-lg p-4 mb-4 mt-4">
                <h3 className="font-semibold mb-2">Información del Canal</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-texto-secundario">Tipo:</span>
                    <span className="font-medium">{canalPreview.tipo.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-texto-secundario">Categoría:</span>
                    <span className="font-medium">{canalPreview.categoria}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-texto-secundario">URL:</span>
                    <code className="text-xs bg-fondo-secundario p-2 rounded break-all">{canalPreview.url}</code>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    toggleCanal(canalPreview.id)
                    toast.success(
                      canalesSeleccionados.includes(canalPreview.id) 
                        ? 'Canal deseleccionado' 
                        : 'Canal seleccionado para importar'
                    )
                  }}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    canalesSeleccionados.includes(canalPreview.id)
                      ? 'bg-fondo-terciario hover:bg-fondo text-texto-primario'
                      : 'bg-primario hover:bg-primario-oscuro text-white'
                  }`}
                >
                  {canalesSeleccionados.includes(canalPreview.id) ? 'Deseleccionar' : 'Seleccionar para Importar'}
                </button>
                <button
                  onClick={cerrarPreview}
                  className="px-6 py-3 bg-fondo-terciario hover:bg-fondo rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
