# Proxy HLS Interno - Solución Automática

## ¿Qué hace?

El proxy HLS interno convierte automáticamente streams HTTP a HTTPS, permitiendo que funcionen en tu sitio desplegado.

## Cómo funciona

1. **Detecta automáticamente** URLs HTTP cuando el sitio usa HTTPS
2. **Redirige** las peticiones a través de `/api/hls`
3. **Reescribe** las URLs en los manifests m3u8
4. **Proxea** los segmentos .ts y otros archivos

**No necesitas configurar nada.** Funciona automáticamente.

## Archivos creados

- ✅ `src/app/api/hls/route.ts` - API Route que actúa como proxy
- ✅ `src/componentes/ReproductorVideo.tsx` - Actualizado para usar el proxy

## Ventajas

- ✅ **Automático**: No requiere configuración
- ✅ **Integrado**: Parte de tu aplicación Next.js
- ✅ **Sin costos**: No necesitas servicios externos
- ✅ **Funciona en Netlify**: Compatible con Netlify Functions

## Limitaciones en Netlify

⚠️ **Importante**: Netlify Functions tienen un timeout de:
- **10 segundos** (plan gratuito)
- **26 segundos** (plan Pro)

Esto significa:
- ✅ Los manifests m3u8 funcionarán (son pequeños)
- ✅ Los segmentos .ts cortos funcionarán
- ⚠️ Streams muy largos pueden tener problemas

## Cómo verificar que funciona

1. Despliega tu sitio en Netlify
2. Ve a un canal con URL HTTP
3. Abre la consola del navegador (F12)
4. Deberías ver: `🔄 Stream HTTP detectado, usando proxy interno...`
5. El canal debería reproducir

## Si no funciona

### Opción 1: Actualizar URLs a HTTPS

Si el servidor soporta HTTPS, actualiza las URLs en Supabase:

```sql
UPDATE canales
SET url_stream = REPLACE(url_stream, 'http://', 'https://')
WHERE url_stream LIKE 'http://%' 
AND url_stream LIKE '%azyleg.club%';
```

### Opción 2: Usar Cloudflare Workers

Para streams más complejos o con protección, usa Cloudflare Workers (ver `PROXY-CLOUDFLARE-WORKER.md`).

Ventajas:
- Sin límite de timeout
- Mejor rendimiento
- Más confiable para streaming

### Opción 3: Usar solo YouTube/Twitch

Estos servicios siempre usan HTTPS y funcionan sin problemas.

## Troubleshooting

### Error: "Function invocation timeout"

El stream es muy largo para Netlify Functions. Soluciones:
1. Usa HTTPS directamente (mejor opción)
2. Usa Cloudflare Workers
3. Usa canales de YouTube/Twitch

### El stream se corta

Puede ser:
- Timeout de Netlify Functions
- Problema del servidor original
- Conexión lenta

Verifica en la consola del navegador para ver el error exacto.

### No reproduce en absoluto

1. Verifica que la URL del canal sea correcta
2. Prueba la URL directamente en el navegador
3. Revisa la consola para errores específicos

## Monitoreo

Para ver el uso de tu proxy:

1. Ve a Netlify dashboard
2. Functions → hls
3. Verás las invocaciones y errores

## Recomendación

Para producción, lo ideal es:

1. **Mejor**: Usar solo streams HTTPS
2. **Bueno**: Cloudflare Workers para streams HTTP
3. **Aceptable**: Proxy interno (con limitaciones)

El proxy interno es perfecto para desarrollo y pruebas, pero para producción considera las otras opciones.
