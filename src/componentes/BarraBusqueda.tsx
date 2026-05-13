'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BarraBusqueda() {
  const [termino, setTermino] = useState('')
  const router = useRouter()

  const manejarBusqueda = (e: React.FormEvent) => {
    e.preventDefault()
    if (termino.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(termino)}`)
    }
  }

  return (
    <form onSubmit={manejarBusqueda} className="relative">
      <input
        type="text"
        value={termino}
        onChange={(e) => setTermino(e.target.value)}
        placeholder="Buscar noticias..."
        className="w-full bg-fondo-secundario text-texto-primario border border-fondo-terciario rounded-lg px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-primario"
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
    </form>
  )
}
