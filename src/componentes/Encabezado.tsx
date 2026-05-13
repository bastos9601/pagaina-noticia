'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Encabezado() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="bg-fondo-secundario border-b border-fondo-terciario sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/noticias-live.png" 
              alt="Noticias Live" 
              className="h-20 w-auto"
            />
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-texto-secundario hover:text-primario transition-colors">
              Inicio
            </Link>
            <Link href="/noticias" className="text-texto-secundario hover:text-primario transition-colors">
              Noticias
            </Link>
            <Link href="/canales" className="text-texto-secundario hover:text-primario transition-colors">
              En Vivo
            </Link>
          </nav>

          {/* Botón móvil */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden text-texto-primario"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuAbierto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        {menuAbierto && (
          <nav className="md:hidden py-4 border-t border-fondo-terciario">
            <Link
              href="/"
              className="block py-2 text-texto-secundario hover:text-primario transition-colors"
              onClick={() => setMenuAbierto(false)}
            >
              Inicio
            </Link>
            <Link
              href="/noticias"
              className="block py-2 text-texto-secundario hover:text-primario transition-colors"
              onClick={() => setMenuAbierto(false)}
            >
              Noticias
            </Link>
            <Link
              href="/canales"
              className="block py-2 text-texto-secundario hover:text-primario transition-colors"
              onClick={() => setMenuAbierto(false)}
            >
              En Vivo
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
