import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Permitir acceso a la página de login
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Proteger todas las rutas de admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Verificar si hay una cookie de sesión
    const adminAutenticado = request.cookies.get('admin_autenticado')
    
    // Si no está autenticado, redirigir al login
    if (!adminAutenticado) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
