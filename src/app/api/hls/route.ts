import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const targetUrl = req.nextUrl.searchParams.get('url')

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL requerida' }, { status: 400 })
  }

  try {
    // Hacer la petición al servidor original
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': new URL(targetUrl).origin,
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Error del servidor: ${response.status}` },
        { status: response.status }
      )
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'

    // Si es un manifest m3u8, reescribir las URLs
    if (targetUrl.includes('.m3u8')) {
      const text = await response.text()
      const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1)
      const origin = req.nextUrl.origin

      // Reescribir URLs en el manifest
      const modifiedText = text
        .split('\n')
        .map((line) => {
          // Ignorar comentarios y líneas vacías
          if (line.startsWith('#') || line.trim() === '') {
            return line
          }

          // Si ya es una URL completa
          if (line.startsWith('http://') || line.startsWith('https://')) {
            return `${origin}/api/hls?url=${encodeURIComponent(line)}`
          }

          // Si es una URL relativa
          const absoluteUrl = baseUrl + line.trim()
          return `${origin}/api/hls?url=${encodeURIComponent(absoluteUrl)}`
        })
        .join('\n')

      return new NextResponse(modifiedText, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'no-cache',
        },
      })
    }

    // Para segmentos .ts y otros archivos, pasar el stream directamente
    const arrayBuffer = await response.arrayBuffer()

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error en proxy HLS:', error)
    return NextResponse.json(
      { error: 'Error al cargar el stream' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
