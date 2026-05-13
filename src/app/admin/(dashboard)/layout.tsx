import BarraLateralAdmin from '@/componentes/admin/BarraLateralAdmin'

export default function LayoutDashboard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <BarraLateralAdmin />
      <main className="flex-1 p-4 md:p-6 lg:p-8 bg-fondo w-full lg:w-auto">
        <div className="pt-16 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}
