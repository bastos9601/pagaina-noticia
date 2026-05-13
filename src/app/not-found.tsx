import Link from 'next/link'
import Encabezado from '@/componentes/Encabezado'
import PiePagina from '@/componentes/PiePagina'

export default function PaginaNoEncontrada() {
  return (
    <>
      <Encabezado />
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-9xl font-bold text-primario mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-4">Página no encontrada</h2>
          <p className="text-texto-secundario mb-8 max-w-md">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <Link
            href="/"
            className="inline-block bg-primario hover:bg-primario-oscuro text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
      <PiePagina />
    </>
  )
}
