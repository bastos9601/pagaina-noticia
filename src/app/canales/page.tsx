import Encabezado from '@/componentes/Encabezado'
import PiePagina from '@/componentes/PiePagina'
import TarjetaCanal from '@/componentes/TarjetaCanal'
import { obtenerCanales } from '@/servicios/canales'

export const revalidate = 30

export default async function PaginaCanales() {
  const canales = await obtenerCanales(true)
  const canalesActivos = canales.filter(c => c.activo)
  const canalesInactivos = canales.filter(c => !c.activo)

  return (
    <>
      <Encabezado />
      
      <main className="min-h-screen bg-fondo">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-fondo-secundario to-fondo py-12 border-b border-fondo-terciario">
          <div className="container px-4">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-500 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                TRANSMISIÓN EN VIVO
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-texto-primario">
                Canales en <span className="text-primario">Vivo</span>
              </h1>
              <p className="text-texto-secundario text-lg">
                Mira transmisiones en vivo de los principales canales de noticias, deportes y entretenimiento las 24 horas del día.
              </p>
            </div>
          </div>
        </section>

        <div className="container px-4 py-12">
          {/* Canales Activos */}
          {canalesActivos.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-semibold">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  EN VIVO AHORA
                </div>
                <span className="text-texto-secundario">
                  {canalesActivos.length} {canalesActivos.length === 1 ? 'canal' : 'canales'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {canalesActivos.map((canal) => (
                  <TarjetaCanal key={canal.id} canal={canal} />
                ))}
              </div>
            </section>
          )}

          {/* Canales Inactivos */}
          {canalesInactivos.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-texto-primario">
                  Próximamente
                </h2>
                <span className="text-texto-secundario">
                  {canalesInactivos.length} {canalesInactivos.length === 1 ? 'canal' : 'canales'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {canalesInactivos.map((canal) => (
                  <TarjetaCanal key={canal.id} canal={canal} />
                ))}
              </div>
            </section>
          )}

          {/* Estado vacío */}
          {canales.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-fondo-secundario rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-fondo-terciario">
                <svg className="w-12 h-12 text-texto-secundario" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-texto-primario">
                No hay canales disponibles
              </h3>
              <p className="text-texto-secundario text-lg max-w-md mx-auto">
                Los canales en vivo estarán disponibles próximamente. Vuelve pronto para disfrutar de transmisiones en directo.
              </p>
            </div>
          )}
        </div>
      </main>

      <PiePagina />
    </>
  )
}
