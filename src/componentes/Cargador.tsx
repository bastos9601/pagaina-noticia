export default function Cargador({ texto }: { texto?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-fondo-terciario rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primario border-t-transparent rounded-full animate-spin"></div>
      </div>
      {texto && (
        <p className="mt-4 text-texto-secundario">{texto}</p>
      )}
    </div>
  )
}
