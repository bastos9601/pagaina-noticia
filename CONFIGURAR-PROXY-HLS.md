# Configurar Proxy HLS para Streams HTTP

## ¿Cuándo necesitas esto?

Si tus canales usan URLs HTTP como:
- `http://208.82.62.169:8089/play/hls/...`
- `http://95.143.42.125:8080/...`

Y tu sitio usa HTTPS (como Netlify), los navegadores bloquearán estos streams por seguridad (Mixed Content).

## Solución: Cloudflare Workers (Gratuito)

### Paso 1: Crear Worker en Cloudflare

1. Ve a https://workers.cloudflare.com
2. Crea una cuenta gratuita
3. Click "Create a Service"
4. Nombre: `hls-proxy`
5. Click "Create service"
6. Click "Quick Edit"

### Paso 2: Código del Worker

Pega este código:

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Manejar CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }
    
    const targetUrl = url.searchParams.get('url');
    
    if (!targetUrl) {
      return new Response('Missing url parameter', { status: 400 });
    }

    try {
      // Hacer la petición al servidor original
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!response.ok) {
        return new Response(`Error: ${response.status} ${response.statusText}`, { 
          status: response.status 
        });
      }

      // Si es un manifest m3u8, modificar las URLs internas
      if (targetUrl.includes('.m3u8')) {
        const text = await response.text();
        const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);
        
        // Reemplazar URLs relativas con URLs absolutas a través del proxy
        const modifiedText = text.split('\n').map(line => {
          // Ignorar comentarios y líneas vacías
          if (line.startsWith('#') || line.trim() === '') {
            return line;
          }
          
          // Si ya es una URL completa
          if (line.startsWith('http://') || line.startsWith('https://')) {
            return `${url.origin}/?url=${encodeURIComponent(line)}`;
          }
          
          // Si es una URL relativa
          const absoluteUrl = baseUrl + line;
          return `${url.origin}/?url=${encodeURIComponent(absoluteUrl)}`;
        }).join('\n');
        
        return new Response(modifiedText, {
          headers: {
            'Content-Type': 'application/vnd.apple.mpegurl',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': 'no-cache',
          },
        });
      }
      
      // Para otros archivos (segmentos .ts), pasar directamente
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      
      return newResponse;
    } catch (error) {
      console.error('Proxy error:', error);
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  },
};
```

7. Click "Save and Deploy"

### Paso 3: Obtener URL del Worker

Tu worker estará en:
```
https://hls-proxy.TU-USUARIO.workers.dev
```

Ejemplo: `https://hls-proxy.juan123.workers.dev`

### Paso 4: Configurar en Netlify

1. Ve a tu sitio en Netlify
2. Site settings → Environment variables
3. Agrega una nueva variable:
   - **Key:** `NEXT_PUBLIC_HLS_PROXY_URL`
   - **Value:** `https://hls-proxy.TU-USUARIO.workers.dev`
4. Click "Save"
5. Redespliega tu sitio (Deploys → Trigger deploy → Deploy site)

### Paso 5: Configurar en Local

En tu archivo `.env` local:

```env
NEXT_PUBLIC_HLS_PROXY_URL=https://hls-proxy.TU-USUARIO.workers.dev
```

## Cómo Funciona

El código ya está actualizado para:

1. ✅ Detectar automáticamente URLs HTTP en sitios HTTPS
2. ✅ Usar el proxy si está configurado
3. ✅ Mostrar advertencias en consola si no hay proxy
4. ✅ Funcionar sin proxy si todos los streams son HTTPS

**No necesitas cambiar nada más en el código.**

## Verificar que Funciona

1. Abre tu sitio desplegado
2. Ve a un canal con URL HTTP
3. Abre la consola del navegador (F12)
4. Deberías ver: `✅ Usando proxy: https://...`
5. El canal debería reproducir correctamente

## Límites del Plan Gratuito

- ✅ 100,000 peticiones/día
- ✅ Sin límite de ancho de banda
- ✅ Sin timeout
- ✅ Perfecto para streaming

Suficiente para miles de usuarios simultáneos.

## Troubleshooting

### El worker no funciona

Verifica en Cloudflare Workers dashboard:
1. Ve a tu worker
2. Click en "Logs" (en tiempo real)
3. Intenta reproducir un canal
4. Verifica los errores

### Sigue sin reproducir

1. Verifica que la variable de entorno esté configurada en Netlify
2. Redespliega el sitio después de agregar la variable
3. Limpia la caché del navegador (Ctrl+Shift+R)
4. Verifica la consola del navegador para errores

### El stream es lento

- El proxy agrega ~50-100ms de latencia
- Si es muy lento, el problema es el servidor original
- Considera usar servidores más rápidos o CDN

## Alternativa: Actualizar URLs a HTTPS

Si el servidor soporta HTTPS, es mejor actualizar las URLs directamente:

```sql
-- En Supabase SQL Editor
UPDATE canales
SET url_stream = REPLACE(url_stream, 'http://', 'https://')
WHERE url_stream LIKE 'http://%';
```

Pero verifica primero que el servidor tenga HTTPS válido.

## Monitoreo

Para ver cuántas peticiones usa tu proxy:

1. Ve a Cloudflare Workers dashboard
2. Selecciona tu worker
3. Ve a "Metrics"
4. Verás gráficas de uso

Si te acercas al límite de 100k/día, considera el plan Pro ($5/mes) con 10 millones de peticiones.
