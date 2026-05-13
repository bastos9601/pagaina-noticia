import Link from 'next/link'
import Image from 'next/image'
import { Canal } from '@/tipos'

interface Props {
  canal: Canal
}

export default function TarjetaCanal({ canal }: Props) {
  return (
    <Link
      href={`/canales/${canal.id}`}
      className="group block bg-fondo-secundario rounded-lg overflow-hidden hover:ring-2 hover:ring-primario transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden bg-fondo-terciario">
        {canal.logo ? (
          <Image
            src={canal.logo}
            alt={canal.nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-primario rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {canal.nombre.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
        
        {canal.activo && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            EN VIVO
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-texto-primario group-hover:text-primario transition-colors mb-2">
          {canal.nombre}
        </h3>
        
        <p className="text-sm text-texto-secundario line-clamp-2 mb-3">
          {canal.descripcion}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-texto-terciario uppercase">
            {canal.tipo}
          </span>
          <span className="text-xs bg-fondo-terciario text-texto-secundario px-2 py-1 rounded">
            {canal.categoria}
          </span>
        </div>
      </div>
    </Link>
  )
}
