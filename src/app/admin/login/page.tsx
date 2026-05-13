'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function PaginaLogin() {
  const router = useRouter()
  const [formulario, setFormulario] = useState({
    correo: '',
    contrasena: '',
  })
  const [cargando, setCargando] = useState(false)

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    try {
      // Simulación de login (reemplazar con Supabase Auth real)
      // Por ahora, credenciales hardcodeadas para desarrollo
      if (
        formulario.correo === 'admin@noticiasLive.com' &&
        formulario.contrasena === 'admin123'
      ) {
        // Guardar sesión en cookie
        document.cookie = 'admin_autenticado=true; path=/; max-age=86400' // 24 horas
        document.cookie = `admin_correo=${formulario.correo}; path=/; max-age=86400`
        
        toast.success('Inicio de sesión exitoso')
        
        // Pequeño delay para que la cookie se guarde
        setTimeout(() => {
          router.push('/admin')
          router.refresh()
        }, 500)
      } else {
        toast.error('Credenciales incorrectas')
      }
    } catch (error) {
      toast.error('Error al iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-fondo px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primario rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Panel Administrativo</h1>
          <p className="text-texto-secundario">Inicia sesión para continuar</p>
        </div>

        {/* Formulario */}
        <div className="bg-fondo-secundario rounded-lg border border-fondo-terciario p-8">
          <form onSubmit={manejarSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formulario.correo}
                onChange={(e) => setFormulario({ ...formulario, correo: e.target.value })}
                className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primario"
                placeholder="admin@ejemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={formulario.contrasena}
                onChange={(e) => setFormulario({ ...formulario, contrasena: e.target.value })}
                className="w-full bg-fondo border border-fondo-terciario rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primario"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-primario hover:bg-primario-oscuro text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Credenciales de prueba */}
          <div className="mt-6 p-4 bg-fondo rounded-lg border border-fondo-terciario">
            <p className="text-xs text-texto-secundario mb-2">
              <strong>Credenciales de prueba:</strong>
            </p>
            <p className="text-xs text-texto-terciario">
              Correo: admin@noticiasLive.com<br />
              Contraseña: admin123
            </p>
          </div>
        </div>

        {/* Volver */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-texto-secundario hover:text-primario transition-colors text-sm"
          >
            ← Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  )
}
