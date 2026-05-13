import { MetadataRoute } from 'next'
import { obtenerNoticias } from '@/servicios/noticias'
import { obtenerCategorias } from '@/servicios/categorias'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tu-sitio.netlify.app'

  // Páginas estáticas
  const rutas: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/noticias`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/canales`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // Noticias
  try {
    const { datos: noticias } = await obtenerNoticias(1, 100)
    const rutasNoticias = noticias.map((noticia) => ({
      url: `${baseUrl}/noticias/${noticia.slug}`,
      lastModified: new Date(noticia.fecha_actualizacion || noticia.fecha_creacion),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
    rutas.push(...rutasNoticias)
  } catch (error) {
    console.error('Error al generar sitemap de noticias:', error)
  }

  // Categorías
  try {
    const categorias = await obtenerCategorias()
    const rutasCategorias = categorias.map((categoria) => ({
      url: `${baseUrl}/categoria/${categoria.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }))
    rutas.push(...rutasCategorias)
  } catch (error) {
    console.error('Error al generar sitemap de categorías:', error)
  }

  return rutas
}
