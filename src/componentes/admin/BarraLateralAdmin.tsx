'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const enlaces = [
  { href: '/admin', label: 'Dashboard', icono: '📊' },
  { href: '/admin/noticias', label: 'Noticias', icono: '📰' },
  { href: '/admin/canales', label: 'Canales', icono: '📺' },
  { href: '/admin/categorias', label: 'Categorías', icono: '🏷️' },
  { href: '/admin/publicidad', label: 'Publicidad', icono: '📢' },
]

export default function BarraLateralAdmin() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const cerrarSesion = () => {
    // Eliminar cookies
    document.cookie = 'admin_autenticado=; path=/; max-age=0'
    document.cookie = 'admin_correo=; path=/; max-age=0'
    
    toast.success('Sesión cerrada')
    router.push('/admin/login')
  }

  const cerrarMenu = () => {
    setMenuAbierto(false)
  }

  return (
    <>
      {/* Botón hamburguesa para móvil */}
      <button
        onClick={() => setMenuAbierto(!menuAbierto)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-fondo-secundario border border-fondo-terciario rounded-lg flex items-center justify-center"
      >
        {menuAbierto ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay para móvil */}
      {menuAbierto && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={cerrarMenu}
        />
      )}

      {/* Barra lateral */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-fondo-secundario border-r border-fondo-terciario
          transform transition-transform duration-300 ease-in-out
          ${menuAbierto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 h-full overflow-y-auto">
          <Link href="/" className="flex items-center gap-2 mb-8" onClick={cerrarMenu}>
            <img 
              src="/noticias-live.png" 
              alt="Noticias Live" 
              className="h-20 w-auto"
            />
          </Link>

          <nav className="space-y-2">
            {enlaces.map((enlace) => {
              const activo = pathname === enlace.href
              return (
                <Link
                  key={enlace.href}
                  href={enlace.href}
                  onClick={cerrarMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activo
                      ? 'bg-primario text-white'
                      : 'text-texto-secundario hover:bg-fondo-terciario hover:text-texto-primario'
                  }`}
                >
                  <span className="text-xl">{enlace.icono}</span>
                  <span className="font-medium">{enlace.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 pt-8 border-t border-fondo-terciario space-y-2">
            <Link
              href="/"
              onClick={cerrarMenu}
              className="flex items-center gap-3 px-4 py-3 text-texto-secundario hover:text-texto-primario transition-colors"
            >
              <span className="text-xl">🏠</span>
              <span>Volver al sitio</span>
            </Link>
            
            <button
              onClick={() => {
                cerrarMenu()
                cerrarSesion()
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-texto-secundario hover:text-red-500 transition-colors"
            >
              <span className="text-xl">🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
