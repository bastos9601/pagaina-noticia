import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

async function obtenerOCrearUsuarioAdmin() {
  // Intentar obtener el usuario admin existente
  const { data: usuarios } = await supabaseAdmin
    .from('usuarios')
    .select('id')
    .eq('rol', 'admin')
    .limit(1)
  
  if (usuarios && usuarios.length > 0) {
    return usuarios[0].id
  }
  
  // Si no existe, crear uno
  const { data: nuevoUsuario } = await supabaseAdmin
    .from('usuarios')
    .insert({
      nombre: 'Administrador',
      correo: 'admin@noticiasLive.com',
      rol: 'admin',
    })
    .select('id')
    .single()
  
  return nuevoUsuario?.id
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Obtener o crear usuario admin
    const autorId = await obtenerOCrearUsuarioAdmin()
    
    const { data, error } = await supabaseAdmin
      .from('noticias')
      .insert({
        ...body,
        autor_id: autorId,
        vistas: 0,
      })
      .select('*, categoria:categorias(*), autor:usuarios(*)')
      .single()
    
    if (error) {
      console.error('Error de Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error en API:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...datos } = body
    
    const { data, error } = await supabaseAdmin
      .from('noticias')
      .update(datos)
      .eq('id', id)
      .select('*, categoria:categorias(*), autor:usuarios(*)')
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }
    
    const { error } = await supabaseAdmin
      .from('noticias')
      .delete()
      .eq('id', id)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
