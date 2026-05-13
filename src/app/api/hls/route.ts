import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const targetUrl = req.nextUrl.searchParams.get('url')

    if (!targetUrl) {
      console.error('[HLS Proxy] URL no proporcionada')
      return new Response('URL no proporcionada', {
        status: 400,
        headers: {
          'Content-Type': 'text/plain',
        },
      })
    }

    console.log('[HLS Proxy] Solicitando:', targetUrl)

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': targetUrl,
      },
    })

    console.log('[HLS Proxy] Respuesta:', response.status, response.statusText)

    if (!response.ok) {
      console.error('[HLS Proxy] Error del servidor:', response.status)
      return new Response(`Error obteniendo stream: ${response.status}`, {
        status: response.status,
        headers: {
          'Content-Type': 'text/plain',
        },
      })
    }

    const contentType = response.headers.get('content-type') || ''

    // =========================
    // MANIFEST M3U8
    // =========================
    if (contentType.includes('mpegurl') || targetUrl.includes('.m3u8')) {
      console.log('[HLS Proxy] Procesando manifest m3u8')
      let text = await response.text()

      const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1)

      // Reescribir segmentos
      text = text.replace(/^(?!#)(.+)$/gm, (line) => {
        const trimmedLine = line.trim()
        if (!trimmedLine) return line

        const segmentUrl = trimmedLine.startsWith('http')
          ? trimmedLine
          : baseUrl + trimmedLine

        return `/api/hls?url=${encodeURIComponent(segmentUrl)}`
      })

      console.log('[HLS Proxy] Manifest procesado correctamente')

      return new Response(text, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
        },
      })
    }

    // =========================
    // SEGMENTOS .ts
    // =========================
    console.log('[HLS Proxy] Procesando segmento .ts')
    const buffer = await response.arrayBuffer()

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'video/mp2t',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('[HLS Proxy] Error:', error)

    return new Response(`Error interno proxy: ${error instanceof Error ? error.message : 'Unknown error'}`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
