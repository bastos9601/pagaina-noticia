# Solución: Streams no reproducen en producción

## Problema
Los canales HLS no reproducen cuando el sitio está desplegado en Netlify, pero funcionan en local.

## Causas comunes

### 1. CORS (Cross-Origin Resource Sharing)
El servidor `https://azyleg.club:8443` bloquea peticiones desde tu dominio de Netlify.

**Síntomas:**
- Error en consola: `Access to fetch at '...' has been blocked by CORS policy`
- El reproductor se queda en "Cargando..."

### 2. Mixed Content (HTTPS/HTTP)
Netlify usa HTTPS, pero si los streams son HTTP, el navegador los bloquea.

**Síntomas:**
- Error en consola: `Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure resource`

### 3. Certificado SSL inválido
El servidor externo tiene un certificado SSL autofirmado o expirado.

**Síntomas:**
- Error en consola: `net::ERR_CERT_AUTHORITY_INVALID`
- `SSL certificate problem`

### 4. Restricciones del servidor
El servidor solo permite acceso desde ciertas IPs o dominios.

## Diagnóstico

### Paso 1: Abrir consola del navegador
1. En tu sitio desplegado, presiona F12
2. Ve a la pestaña "Console"
3. Intenta reproducir un canal
4. Copia los errores que aparezcan

### Paso 2: Verificar la URL del stream
1. Copia la URL del stream de un canal
2. Ábrela directamente en el navegador
3. Si no carga o da error de certificado, ese es el problema

## Soluciones

### Solución A: Usar solo canales con HTTPS válido
La más simple. Solo importa canales de servidores con:
- ✅ HTTPS válido
- ✅ CORS habilitado
- ✅ Certificado SSL válido

**Cómo verificar:**
```bash
curl -I https://url-del-stream.m3u8
```

Si funciona sin errores, el canal debería funcionar.

### Solución B: Proxy API en Netlify (Limitado)
Crear un proxy para evitar CORS, pero tiene limitaciones:

**Limitaciones:**
- Netlify Functions tienen timeout de 10 segundos (plan gratuito) o 26 segundos (plan Pro)
- No es ideal para streaming continuo
- Puede ser lento

**No recomendado para producción.**

### Solución C: Usar un servicio de proxy externo
Servicios como:
- **Cloudflare Workers** (gratuito hasta 100k peticiones/día)
- **AWS CloudFront** (CDN con proxy)
- **Vercel Edge Functions**

Estos están diseñados para streaming y no tienen los límites de Netlify Functions.

### Solución D: Servidor proxy dedicado (Recomendado)
La mejor solución para producción:

1. **Servidor VPS** (DigitalOcean, Linode, AWS EC2)
2. **Instalar Nginx** como proxy reverso
3. **Configurar CORS** y SSL
4. **Apuntar tus streams** al proxy

**Ventajas:**
- Sin límites de tiempo
- Mejor rendimiento
- Control total
- Puede cachear segmentos HLS

**Costo aproximado:**
- VPS básico: $5-10/mes
- Suficiente para varios streams simultáneos

### Solución E: Contactar al proveedor del servidor
Si tienes acceso al servidor `azyleg.club:8443`:

1. Pedir que agreguen tu dominio a CORS:
   ```
   Access-Control-Allow-Origin: https://tu-sitio.netlify.app
   ```

2. Verificar que el certificado SSL sea válido

3. Verificar que no haya restricciones de IP

## Solución temporal: Iframe embed

Si el servidor tiene una página web que reproduce el stream, puedes usar iframe:

```typescript
// En lugar de HLS directo
tipo: 'iframe'
url_stream: 'https://azyleg.club:8443/player.php?stream=...'
```

Esto evita CORS porque el navegador carga el contenido dentro del iframe.

## Recomendación final

Para un sitio de noticias profesional:

1. **Corto plazo:** Usa solo canales de YouTube, Twitch, o servidores con HTTPS válido
2. **Mediano plazo:** Implementa un proxy con Cloudflare Workers
3. **Largo plazo:** Servidor proxy dedicado con Nginx

## Verificación rápida

Para saber exactamente cuál es tu problema:

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Filtra por "m3u8"
4. Intenta reproducir un canal
5. Haz clic en la petición fallida
6. Ve a "Headers" y luego "Response Headers"

Si ves:
- **403 Forbidden** → Restricción del servidor
- **CORS error** → Falta configuración CORS
- **SSL error** → Certificado inválido
- **Timeout** → Servidor muy lento o caído

Comparte el error exacto y te puedo dar una solución más específica.
