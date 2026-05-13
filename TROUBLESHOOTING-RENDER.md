# Troubleshooting - Render

## Error: "Failed to load resource: 404"

### Causa
El proxy HLS no está funcionando correctamente o la ruta no existe.

### Solución

1. **Verificar que el build se completó correctamente**
   - Ve a Render Dashboard → Logs
   - Busca "Build succeeded"
   - Si falló, revisa los errores de build

2. **Verificar que la API route existe**
   ```
   Debe existir: src/app/api/hls/route.ts
   ```

3. **Redeploy manual**
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push origin main
   ```

## Error: "MIME type ('text/plain') is not executable"

### Causa
Next.js no está sirviendo correctamente los archivos JavaScript.

### Solución

1. **Verificar el build command en Render**
   ```
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

2. **Agregar variable de entorno**
   En Render → Environment:
   ```
   NODE_ENV=production
   ```

3. **Limpiar caché y redeploy**
   - En Render Dashboard
   - Settings → Clear build cache
   - Manual Deploy → Deploy latest commit

## Error: "ChunkLoadError: Loading chunk failed"

### Causa
Problemas con la carga de módulos de HLS.js

### Solución

1. **Verificar que hls.js esté instalado**
   ```bash
   npm list hls.js
   ```

2. **Si no está, instalarlo**
   ```bash
   npm install hls.js
   git add package.json package-lock.json
   git commit -m "Add hls.js dependency"
   git push origin main
   ```

## Streams HTTP no reproducen

### Diagnóstico

1. **Abrir consola del navegador** (F12)
2. **Ir a Network tab**
3. **Filtrar por "hls"**
4. **Intentar reproducir un canal**
5. **Ver qué peticiones fallan**

### Soluciones según el error

#### Error 404 en /api/hls
```bash
# Verificar que el archivo existe
ls -la src/app/api/hls/route.ts

# Si no existe, crearlo de nuevo
# Ver DESPLIEGUE-RENDER.md
```

#### Error 500 en /api/hls
```bash
# Ver logs en Render
# Buscar "[HLS Proxy] Error:"
# El error específico te dirá qué está fallando
```

#### Timeout
```bash
# El servidor del stream es muy lento
# Solución: Usar streams HTTPS directamente
# O considerar Cloudflare Workers
```

## Logs útiles

### Ver logs del proxy HLS

En Render Dashboard → Logs, busca:
```
[HLS Proxy] Solicitando: http://...
[HLS Proxy] Respuesta: 200 OK
[HLS Proxy] Procesando manifest m3u8
```

Si ves errores, te dirán exactamente qué está fallando.

### Ver logs de Next.js

```
Ready on http://0.0.0.0:3000
```

Si no ves esto, el servidor no inició correctamente.

## Solución rápida: Usar HTTPS directo

Si el proxy sigue fallando, la mejor solución es actualizar los canales a HTTPS:

### Paso 1: Verificar si el servidor tiene HTTPS

Prueba cambiar:
```
http://95.143.42.125:8080/... 
```

Por:
```
https://azyleg.club:8443/...
```

### Paso 2: Si funciona, actualizar en Supabase

```sql
UPDATE canales
SET url_stream = REPLACE(url_stream, 'http://95.143.42.125:8080', 'https://azyleg.club:8443')
WHERE url_stream LIKE 'http://95.143.42.125:8080%';
```

### Paso 3: Verificar

Refresca el sitio y prueba los canales.

## Comandos de diagnóstico

### Probar el proxy directamente

```bash
curl "https://tu-app.onrender.com/api/hls?url=http://ejemplo.com/stream.m3u8"
```

Debería devolver el contenido del manifest.

### Probar un canal HTTPS

Primero prueba con un canal que uses HTTPS para verificar que el reproductor funciona:

1. Edita un canal en el admin
2. Cambia la URL a HTTPS
3. Prueba que reproduzca
4. Si funciona, el problema es solo el proxy

## Configuración recomendada para Render

### Variables de entorno mínimas

```
NODE_ENV=production
NODE_VERSION=20
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=https://tu-app.onrender.com
```

### Build settings

```
Build Command: npm install && npm run build
Start Command: npm start
```

### Health check

Render hace health checks a `/`. Asegúrate de que tu página principal carga correctamente.

## Si nada funciona

### Opción 1: Volver a Netlify

Netlify tiene mejor soporte para Next.js out-of-the-box, aunque con límites de timeout.

### Opción 2: Usar solo HTTPS

Actualiza todos los canales a HTTPS y evita el proxy completamente.

### Opción 3: Cloudflare Workers

Usa Cloudflare Workers para el proxy (ver PROXY-CLOUDFLARE-WORKER.md).

### Opción 4: Usar solo YouTube/Twitch

Estos siempre funcionan sin problemas.

## Contactar soporte

Si sigues teniendo problemas:

1. **Render Discord**: https://render.com/discord
2. **Render Support**: support@render.com
3. **Incluye**:
   - URL de tu app
   - Logs del error
   - Pasos para reproducir

## Checklist de verificación

- [ ] Build completado sin errores
- [ ] Variables de entorno configuradas
- [ ] `src/app/api/hls/route.ts` existe
- [ ] Logs no muestran errores
- [ ] Página principal carga
- [ ] Login funciona
- [ ] Canales HTTPS reproducen
- [ ] Proxy HLS funciona (ver logs)

Si todos los checks pasan pero los streams HTTP no funcionan, el problema es del servidor de streaming, no de tu aplicación.
