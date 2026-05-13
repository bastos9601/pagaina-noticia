import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: canales, error } = await supabase
      .from('canales')
      .select('*')
      .eq('activo', true)
      .order('nombre', { ascending: true })

    if (error) {
      console.error('Error obteniendo canales:', error)
      return NextResponse.json(
        { error: 'Error obteniendo canales' },
        { status: 500 }
      )
    }

    return NextResponse.json(canales)
  } catch (error) {
    console.error('Error en API canales:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
