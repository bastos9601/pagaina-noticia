import Link from 'next/link'
import { obtenerNoticias } from '@/servicios/noticias'
import { obtenerCanales } from '@/servicios/canales'
import { obtenerCategorias } from '@/servicios/categorias'

export const revalidate = 0

export default async function PaginaDashboard() {
  const [{ datos: noticias, paginacion }, canales, categorias] = await Promise.all([
    obtenerNoticias(1, 5),
    obtenerCanales(),
    obtenerCategorias(),
  ])

  const estadisticas = [
    {
      titulo: 'Total Noticias',
      valor: paginacion.total,
      icono: '📰',
      color: 'bg-blue-500',
      enlace: '/admin/noticias',
    },
    {
      titulo: 'Canales Activos',
      valor: canales.filter(c => c.activo).length,
      icono: '📺',
      color: 'bg-green-500',
      enlace: '/admin/canales',
    },
    {
      titulo: 'Categorías',
      valor: categorias.length,
      icono: '🏷️',
      color: 'bg-purple-500',
      enlace: '/admin/categorias',
    },
    {
      titulo: 'Total Vistas',
      valor: noticias.reduce((sum, n) => sum + (n.vistas || 0), 0),
      icono: '👁️',
      color: 'bg-orange-500',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-texto-secundario">
          Bienvenido al panel de administración
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {estadisticas.map((stat, index) => (
          <div
            key={index}
            className="bg-fondo-secundario rounded-lg p-6 border border-fondo-terciario"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icono}
              </div>
              {stat.enlace && (
                <Link
                  href={stat.enlace}
                  className="text-primario hover:text-primario-claro text-sm"
                >
                  Ver →
                </Link>
              )}
            </div>
            <h3 className="text-texto-secundario text-sm mb-1">{stat.titulo}</h3>
            <p className="text-3xl font-bold">{stat.valor}</p>
          </div>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/noticias/nueva"
          className="bg-primario hover:bg-primario-oscuro text-white rounded-lg p-6 text-center transition-colors"
        >
          <div className="text-4xl mb-2">➕</div>
          <h3 className="font-semibold">Nueva Noticia</h3>
        </Link>
        
        <Link
          href="/admin/canales/nuevo"
          className="bg-fondo-secundario hover:bg-fondo-terciario rounded-lg p-6 text-center transition-colors border border-fondo-terciario"
        >
          <div className="text-4xl mb-2">📺</div>
          <h3 className="font-semibold">Nuevo Canal</h3>
        </Link>
        
        <Link
          href="/admin/categorias"
          className="bg-fondo-secundario hover:bg-fondo-terciario rounded-lg p-6 text-center transition-colors border border-fondo-terciario"
        >
          <div className="text-4xl mb-2">🏷️</div>
          <h3 className="font-semibold">Gestionar Categorías</h3>
        </Link>
      </div>

      {/* Últimas noticias */}
      <div className="bg-fondo-secundario rounded-lg p-6 border border-fondo-terciario">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Últimas Noticias</h2>
          <Link href="/admin/noticias" className="text-primario hover:text-primario-claro">
            Ver todas →
          </Link>
        </div>
        
        <div className="space-y-3">
          {noticias.map((noticia) => (
            <div
              key={noticia.id}
              className="flex items-center justify-between p-3 bg-fondo rounded-lg"
            >
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{noticia.titulo}</h3>
                <div className="flex items-center gap-3 text-sm text-texto-secundario">
                  <span>{noticia.categoria?.nombre}</span>
                  <span>•</span>
                  <span>{noticia.vistas || 0} vistas</span>
                  <span>•</span>
                  <span className={noticia.publicada ? 'text-green-500' : 'text-yellow-500'}>
                    {noticia.publicada ? 'Publicada' : 'Borrador'}
                  </span>
                </div>
              </div>
              <Link
                href={`/admin/noticias/${noticia.id}`}
                className="text-primario hover:text-primario-claro"
              >
                Editar →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
