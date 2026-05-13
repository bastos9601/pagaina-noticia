# Proxy HLS con Cloudflare Workers

## Problema
Tu sitio usa HTTPS pero los streams usan HTTP, causando errores de "Mixed Content".

## Solución: Cloudflare Workers (Gratuito)

### Paso 1: Crear cuenta en Cloudflare
1. Ve a https://workers.cloudflare.com
2. Crea una cuenta gratuita
3. Verifica tu email

### Paso 2: Crear un Worker

1. Click en "Create a Service"
2. Nombre: `hls-proxy`
3. Click "Create service"

### Paso 3: Código del Worker

Click en "Quick Edit" y pega este código:

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
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

      // Copiar la respuesta con headers CORS
      const newResponse = new Response(response.body, response);
      
      // Agregar headers CORS
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      
      // Si es un manifest m3u8, modificar las URLs internas
      if (targetUrl.endsWith('.m3u8')) {
        const text = await response.text();
        const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);
        
        // Reemplazar URLs relativas con URLs absolutas a través del proxy
        const modifiedText = text.replace(
          /^(?!#)(.+)$/gm,
          (match) => {
            if (match.startsWith('http')) {
              return `${url.origin}/?url=${encodeURIComponent(match)}`;
            }
            const absoluteUrl = baseUrl + match;
            return `${url.origin}/?url=${encodeURIComponent(absoluteUrl)}`;
          }
        );
        
        return new Response(modifiedText, {
          headers: {
            'Content-Type': 'application/vnd.apple.mpegurl',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }
      
      return newResponse;
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  },
};
```

4. Click "Save and Deploy"

### Paso 4: Obtener la URL del Worker

Tu worker estará disponible en:
```
https://hls-proxy.TU-USUARIO.workers.dev
```

### Paso 5: Actualizar tu código

En lugar de usar:
```
http://95.143.42.125:8080/play/hls/epg1peuhd/index.m3u8
```

Usa:
```
https://hls-proxy.TU-USUARIO.workers.dev/?url=http://95.143.42.125:8080/play/hls/epg1peuhd/index.m3u8
```

### Paso 6: Implementar en tu app

Actualiza el componente para usar el proxy automáticamente:

```typescript
// En ReproductorVideo.tsx o donde importes los canales
const streamUrl = canal.url_stream.startsWith('http://')
  ? `https://hls-proxy.TU-USUARIO.workers.dev/?url=${encodeURIComponent(canal.url_stream)}`
  : canal.url_stream;

hls.loadSource(streamUrl);
```

## Límites del plan gratuito

- ✅ 100,000 peticiones/día
- ✅ Sin límite de ancho de banda
- ✅ Sin timeout (a diferencia de Netlify Functions)
- ✅ Perfecto para streaming

## Alternativa: Actualizar canales manualmente

Si no quieres usar proxy, actualiza cada canal en tu base de datos:

1. Ve al panel admin
2. Edita cada canal
3. Cambia la URL de HTTP a HTTPS (si el servidor lo soporta)
4. O usa canales de YouTube/Twitch que siempre funcionan

## Verificar si el servidor tiene HTTPS

Prueba estas URLs en tu navegador:

```
https://95.143.42.125:8443/play/hls/epg1peuhd/index.m3u8
https://azyleg.club:8443/play/hls/epg1peuhd/index.m3u8
```

Si alguna funciona, úsala directamente sin proxy.

## Troubleshooting

### El worker no funciona
- Verifica que la URL del worker sea correcta
- Revisa los logs en el dashboard de Cloudflare
- Asegúrate de que el código esté guardado y desplegado

### Sigue sin reproducir
- Abre la consola del navegador (F12)
- Ve a la pestaña Network
- Busca peticiones al worker
- Verifica que no haya errores

### El stream es muy lento
- El proxy agrega latencia mínima (~50-100ms)
- Si es muy lento, el problema es el servidor original
- Considera usar un CDN o servidor más rápido
