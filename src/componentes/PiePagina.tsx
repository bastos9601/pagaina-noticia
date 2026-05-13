import Link from 'next/link'

export default function PiePagina() {
  const anioActual = new Date().getFullYear()

  return (
    <footer className="bg-fondo-secundario border-t border-fondo-terciario mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primario rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-xl font-bold text-texto-primario">
                Noticias <span className="text-primario">Live</span>
              </span>
            </div>
            <p className="text-texto-secundario text-sm">
              Tu fuente de noticias en tiempo real. Mantente informado con las últimas noticias y canales en vivo.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="text-texto-primario font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-texto-secundario hover:text-primario transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="text-texto-secundario hover:text-primario transition-colors text-sm">
                  Noticias
                </Link>
              </li>
              <li>
                <Link href="/canales" className="text-texto-secundario hover:text-primario transition-colors text-sm">
                  En Vivo
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="text-texto-primario font-semibold mb-4">Síguenos</h3>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-fondo-terciario rounded-lg flex items-center justify-center hover:bg-primario transition-colors">
                <span className="text-texto-primario">F</span>
              </a>
              <a href="#" className="w-10 h-10 bg-fondo-terciario rounded-lg flex items-center justify-center hover:bg-primario transition-colors">
                <span className="text-texto-primario">T</span>
              </a>
              <a href="#" className="w-10 h-10 bg-fondo-terciario rounded-lg flex items-center justify-center hover:bg-primario transition-colors">
                <span className="text-texto-primario">I</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-fondo-terciario mt-8 pt-6 text-center">
          <p className="text-texto-secundario text-sm">
            © {anioActual} Noticias Live. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
