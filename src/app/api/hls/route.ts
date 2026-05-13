import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const targetUrl = req.nextUrl.searchParams.get('url')

    if (!targetUrl) {
      return new Response('URL no proporcionada', {
        status: 400,
      })
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': targetUrl,
      },
    })

    if (!response.ok) {
      return new Response('Error obteniendo stream', {
        status: response.status,
      })
    }

    const contentType = response.headers.get('content-type') || ''

    // =========================
    // MANIFEST M3U8
    // =========================
    if (contentType.includes('mpegurl') || targetUrl.includes('.m3u8')) {
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

      return new Response(text, {
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
    const buffer = await response.arrayBuffer()

    return new Response(buffer, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'video/mp2t',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error en proxy HLS:', error)

    return new Response('Error interno proxy', {
      status: 500,
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
