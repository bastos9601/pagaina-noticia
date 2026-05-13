# Corregir URLs de Canales HTTP → HTTPS

## Problema
Los canales se importaron con URLs HTTP pero el servidor soporta HTTPS. Los navegadores bloquean contenido HTTP en sitios HTTPS.

## Solución Rápida: Script SQL

### Paso 1: Ir a Supabase
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Click en "SQL Editor" en el menú lateral

### Paso 2: Ejecutar el script
1. Click en "New query"
2. Copia y pega este código:

```sql
-- Actualizar canales que usan HTTP a HTTPS
UPDATE canales
SET url_stream = REPLACE(
  REPLACE(url_stream, 'http://95.143.42.125:8080', 'https://azyleg.club:8443'),
  'http://azyleg.club:8080', 'https://azyleg.club:8443'
)
WHERE url_stream LIKE 'http://%';

-- Verificar los cambios
SELECT id, nombre, url_stream
FROM canales
WHERE url_stream LIKE 'https://azyleg.club:8443%'
ORDER BY nombre;
```

3. Click en "Run" o presiona Ctrl+Enter
4. Verás cuántos canales se actualizaron

### Paso 3: Verificar
1. Ve a tu sitio: https://noticias-live.netlify.app/canales
2. Intenta reproducir un canal
3. ¡Debería funcionar! 🎉

## Verificación adicional

Para ver el estado de todos tus canales:

```sql
SELECT 
  COUNT(*) as total_canales,
  COUNT(CASE WHEN url_stream LIKE 'https://%' THEN 1 END) as con_https,
  COUNT(CASE WHEN url_stream LIKE 'http://%' THEN 1 END) as con_http
FROM canales;
```

Todos deberían estar con HTTPS.

## Si algunos canales siguen sin funcionar

Puede ser que tengan URLs diferentes. Para ver todas las URLs:

```sql
SELECT DISTINCT 
  SUBSTRING(url_stream FROM 1 FOR 50) as url_inicio,
  COUNT(*) as cantidad
FROM canales
GROUP BY url_inicio
ORDER BY cantidad DESC;
```

Si ves otras URLs con HTTP, actualízalas:

```sql
UPDATE canales
SET url_stream = REPLACE(url_stream, 'http://OTRA-URL', 'https://OTRA-URL')
WHERE url_stream LIKE 'http://OTRA-URL%';
```

## Prevenir el problema en el futuro

### Actualizar el código de importación

En `src/app/admin/(dashboard)/servidor-canales/page.tsx`, busca donde se construye la URL del stream y cámbialo para usar HTTPS:

```typescript
// ANTES
const streamUrl = `http://${servidor}:${puerto}/live/${usuario}/${password}/${canal.stream_id}.m3u8`

// DESPUÉS
const streamUrl = `https://azyleg.club:8443/live/${usuario}/${password}/${canal.stream_id}.m3u8`
```

O mejor aún, detectar automáticamente:

```typescript
const streamUrl = servidor.includes('azyleg.club')
  ? `https://azyleg.club:8443/live/${usuario}/${password}/${canal.stream_id}.m3u8`
  : `http://${servidor}:${puerto}/live/${usuario}/${password}/${canal.stream_id}.m3u8`
```

## Troubleshooting

### Algunos canales siguen sin funcionar
- Verifica que la URL sea correcta en la base de datos
- Abre la consola del navegador (F12) y busca errores
- Prueba la URL directamente en el navegador

### Error de certificado SSL
Si ves errores de certificado:
- El servidor puede tener un certificado autofirmado
- Necesitarás usar el proxy de Cloudflare Workers (ver PROXY-CLOUDFLARE-WORKER.md)

### Los canales funcionan pero se cortan
- Problema del servidor original, no de tu sitio
- Verifica la estabilidad del servidor
- Considera usar canales de YouTube/Twitch como respaldo
