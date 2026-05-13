import Image from 'next/image'
import { Publicidad } from '@/tipos'

interface Props {
  publicidad: Publicidad
  className?: string
}

export default function BannerPublicidad({ publicidad, className = '' }: Props) {
  const contenido = (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={publicidad.imagen}
        alt={publicidad.titulo}
        fill
        className="object-cover"
      />
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        Publicidad
      </div>
    </div>
  )

  if (publicidad.enlace) {
    return (
      <a
        href={publicidad.enlace}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:opacity-90 transition-opacity"
      >
        {contenido}
      </a>
    )
  }

  return contenido
}
