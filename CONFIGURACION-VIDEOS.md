# ⚙️ Configuración para Subir Videos

## Pasos de Configuración

### 1. Ejecutar Scripts SQL en Supabase

Accede a tu proyecto de Supabase y ejecuta los siguientes scripts en el SQL Editor:

#### Script 1: Agregar campos de video a noticias
```sql
-- Archivo: supabase/agregar-video-noticias.sql

ALTER TABLE noticias 
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS video_tipo TEXT CHECK (video_tipo IN ('youtube', 'vimeo', 'mp4', 'hls'));

COMMENT ON COLUMN noticias.video_url IS 'URL del video (YouTube, Vimeo, MP4, HLS)';
COMMENT ON COLUMN noticias.video_tipo IS 'Tipo de video: youtube, vimeo, mp4, hls';
```

#### Script 2: Configurar Storage para videos
```sql
-- Archivo: supabase/storage-videos-setup.sql

-- Crear bucket para videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos', 
  'videos', 
  true,
  524288000, -- 500 MB límite
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 524288000,
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];

-- Políticas de acceso
CREATE POLICY IF NOT EXISTS "Permitir subir videos públicamente"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'videos');

CREATE POLICY IF NOT EXISTS "Permitir leer videos públicamente"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

CREATE POLICY IF NOT EXISTS "Permitir eliminar videos con service role"
ON storage.objects FOR DELETE
USING (bucket_id = 'videos');

CREATE POLICY IF NOT EXISTS "Permitir actualizar videos con service role"
ON storage.objects FOR UPDATE
USING (bucket_id = 'videos');
```

### 2. Verificar la Configuración

1. Ve a **Storage** en tu panel de Supabase
2. Deberías ver un nuevo bucket llamado **"videos"**
3. Verifica que esté marcado como **público**

### 3. Configurar Variables de Entorno

Asegúrate de que tu archivo `.env.local` tenga las credenciales correctas:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

### 4. Probar la Funcionalidad

1. Ve al panel de administración
2. Crea una nueva noticia
3. En la sección "Video (Opcional)", selecciona "📤 Subir desde mi dispositivo"
4. Sube un video de prueba (pequeño, < 50 MB)
5. Verifica que se suba correctamente

## Límites y Consideraciones

### Límites de Supabase Storage (Plan Gratuito)
- **Storage total**: 1 GB
- **Transferencia mensual**: 2 GB
- **Tamaño máximo por archivo**: 50 MB (configurable hasta 500 MB en planes pagos)

### Límites Configurados en la App
- **Tamaño máximo por video**: 500 MB
- **Formatos permitidos**: MP4, WebM, MOV, AVI
- **Bucket**: Público (accesible sin autenticación)

### Recomendaciones

1. **Para el plan gratuito de Supabase**:
   - Limita los videos a 50 MB o menos
   - Usa YouTube/Vimeo para videos más grandes
   - Monitorea el uso de storage regularmente

2. **Para planes pagos**:
   - Puedes aumentar el límite a 500 MB o más
   - Considera usar un CDN para mejor rendimiento
   - Implementa limpieza automática de videos antiguos

3. **Optimización**:
   - Comprime videos antes de subirlos
   - Usa resolución 720p o 1080p máximo
   - Codec H.264 para mejor compatibilidad

## Solución de Problemas

### Error: "Bucket not found"
**Solución**: Ejecuta el script `storage-videos-setup.sql` en Supabase

### Error: "File too large"
**Solución**: 
1. Comprime el video
2. O ajusta el límite en Supabase Storage settings
3. O usa YouTube/Vimeo para videos grandes

### Error: "Invalid file type"
**Solución**: Asegúrate de usar MP4, WebM, MOV o AVI

### El video no se reproduce
**Solución**:
1. Verifica que el bucket sea público
2. Revisa las políticas de acceso en Supabase
3. Comprueba que el video esté en formato compatible

### Subida muy lenta
**Solución**:
1. Comprime el video antes de subirlo
2. Usa una conexión a internet más rápida
3. Considera usar YouTube para videos grandes

## Actualizar Límites

### Cambiar el tamaño máximo de archivo

En Supabase Dashboard:
1. Ve a **Storage** → **Policies**
2. Edita el bucket "videos"
3. Cambia `file_size_limit` al valor deseado (en bytes)

En el código (`src/componentes/SubidorVideo.tsx`):
```typescript
// Cambiar esta línea:
const tamañoMaximo = 500 * 1024 * 1024 // 500 MB

// Por ejemplo, para 100 MB:
const tamañoMaximo = 100 * 1024 * 1024 // 100 MB
```

### Agregar más formatos de video

En Supabase SQL:
```sql
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY[
  'video/mp4', 
  'video/webm', 
  'video/quicktime', 
  'video/x-msvideo',
  'video/x-matroska' -- Agregar MKV
]
WHERE id = 'videos';
```

En el código (`src/componentes/SubidorVideo.tsx`):
```typescript
const tiposPermitidos = [
  'video/mp4', 
  'video/webm', 
  'video/quicktime', 
  'video/x-msvideo',
  'video/x-matroska' // Agregar MKV
]
```

## Monitoreo de Uso

### Ver uso de Storage en Supabase
1. Ve a **Settings** → **Usage**
2. Revisa "Storage" y "Bandwidth"
3. Configura alertas si te acercas al límite

### Limpiar videos antiguos (opcional)

Puedes crear una función para eliminar videos de noticias antiguas:

```sql
-- Eliminar videos de noticias no publicadas de más de 30 días
DELETE FROM storage.objects
WHERE bucket_id = 'videos'
AND created_at < NOW() - INTERVAL '30 days'
AND name IN (
  SELECT video_url FROM noticias 
  WHERE publicada = false 
  AND fecha_creacion < NOW() - INTERVAL '30 days'
);
```

## Migración desde Sistema Anterior

Si ya tienes noticias con videos en URLs externas:

1. Los videos existentes seguirán funcionando
2. No necesitas migrar nada
3. Los nuevos videos pueden usar cualquier método
4. Puedes mezclar videos subidos y externos

## Costos Estimados

### Supabase (Plan Pro - $25/mes)
- 8 GB de storage incluido
- 50 GB de transferencia incluida
- Suficiente para ~100-200 videos de 5 minutos

### Alternativas Gratuitas
- **YouTube**: Ilimitado y gratis
- **Vimeo**: 500 MB/semana (plan gratuito)
- **Cloudflare Stream**: $1 por 1000 minutos vistos

## Conclusión

La funcionalidad de subir videos está lista para usar. Ejecuta los scripts SQL, verifica la configuración y comienza a subir videos directamente desde el panel de administración.

Para videos grandes o de larga duración, sigue recomendando YouTube o Vimeo para ahorrar storage y ancho de banda.
