# 🎥 Videos en Noticias

## Descripción

El sistema ahora soporta la inclusión de videos en las noticias, permitiendo agregar contenido multimedia de diferentes plataformas y formatos.

## Tipos de Video Soportados

### 1. Subir desde tu Dispositivo (NUEVO) 📤
- **Formato**: Sube videos directamente desde tu computadora
- **Formatos Aceptados**: MP4, WebM, MOV, AVI
- **Tamaño Máximo**: 500 MB
- **Ventajas**:
  - Control total del contenido
  - Sin dependencias de terceros
  - Privacidad garantizada
  - Alojamiento en Supabase Storage
- **Consideraciones**:
  - Comprime el video antes de subirlo
  - Recomendado para videos cortos (< 5 minutos)
  - Para videos más largos, usa YouTube o Vimeo

### 2. YouTube
- **Formato**: Videos alojados en YouTube
- **URL Ejemplo**: 
  - `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
  - `https://youtu.be/dQw4w9WgXcQ`
- **Ventajas**: 
  - Gratis y sin límites de ancho de banda
  - Reproductor optimizado
  - Subtítulos automáticos

### 2. Vimeo
- **Formato**: Videos alojados en Vimeo
- **URL Ejemplo**: `https://vimeo.com/123456789`
- **Ventajas**:
  - Alta calidad de video
  - Sin publicidad
  - Más profesional

### 3. MP4 (URL Directa)
- **Formato**: Archivo MP4 alojado en tu servidor o CDN
- **URL Ejemplo**: `https://ejemplo.com/videos/noticia.mp4`
- **Ventajas**:
  - Control total del contenido
  - Sin dependencias externas
- **Consideraciones**:
  - Requiere hosting propio
  - Consume ancho de banda

### 4. HLS (Streaming)
- **Formato**: HTTP Live Streaming para videos en vivo o bajo demanda
- **URL Ejemplo**: `https://ejemplo.com/stream/video.m3u8`
- **Ventajas**:
  - Streaming adaptativo
  - Ideal para transmisiones en vivo
  - Mejor rendimiento en conexiones lentas

## Cómo Agregar un Video a una Noticia

### Paso 1: Crear o Editar Noticia

1. Ve al panel de administración
2. Navega a "Noticias" → "Nueva Noticia"
3. Completa los campos básicos (título, imagen, categoría, contenido)

### Paso 2: Agregar Video

1. En la sección **"Video (Opcional)"**, selecciona el tipo de video:
   - **📤 Subir desde mi dispositivo** (NUEVO)
   - YouTube
   - Vimeo
   - MP4 (URL directa)
   - HLS (Streaming)

2. **Si seleccionas "Subir desde mi dispositivo"**:
   - Haz clic en el área de subida
   - Selecciona tu video (MP4, WebM, MOV o AVI)
   - Espera a que se complete la subida
   - El video se almacenará en Supabase Storage

3. **Si seleccionas otro tipo**:
   - Ingresa la URL del video según el tipo seleccionado
   - El sistema validará automáticamente la URL

### Paso 3: Publicar

1. Completa el resto de los campos
2. Marca "Publicar inmediatamente" si deseas que sea visible
3. Haz clic en "Crear Noticia"

## Visualización en el Sitio

### En la Lista de Noticias
- Las noticias con video muestran un **ícono de reproducción** sobre la imagen
- Esto ayuda a los usuarios a identificar contenido multimedia

### En la Página de Detalle
- El video se muestra **debajo de la imagen principal**
- Reproductor integrado según el tipo de video
- Controles de reproducción nativos

## Ejemplos de URLs Válidas

### YouTube
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
dQw4w9WgXcQ (solo el ID)
```

### Vimeo
```
https://vimeo.com/123456789
https://player.vimeo.com/video/123456789
```

### MP4
```
https://ejemplo.com/videos/noticia.mp4
https://cdn.ejemplo.com/media/video-2024.mp4
```

### HLS
```
https://ejemplo.com/streams/live.m3u8
https://cdn.ejemplo.com/hls/video/playlist.m3u8
```

## Actualización de Base de Datos

Para habilitar esta funcionalidad, ejecuta los siguientes scripts SQL en tu base de datos Supabase:

### 1. Agregar campos de video a noticias
```sql
-- Ejecutar: supabase/agregar-video-noticias.sql
ALTER TABLE noticias 
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS video_tipo TEXT CHECK (video_tipo IN ('youtube', 'vimeo', 'mp4', 'hls'));
```

### 2. Configurar Storage para videos
```sql
-- Ejecutar: supabase/storage-videos-setup.sql
-- Crea el bucket 'videos' con políticas de acceso público
-- Límite de 500 MB por archivo
-- Formatos permitidos: MP4, WebM, MOV, AVI
```

## Mejores Prácticas

### 1. Optimización
- **Subir desde dispositivo**: Para videos cortos (< 5 min) y contenido exclusivo
- **YouTube/Vimeo**: Preferir para videos largos (ahorra ancho de banda y storage)
- **MP4 directo**: Solo para videos ya alojados en tu CDN
- **HLS**: Para transmisiones en vivo o contenido premium

### 2. Compresión de Videos
Antes de subir un video desde tu dispositivo, comprímelo para reducir el tamaño:
- **Herramientas recomendadas**:
  - HandBrake (gratis, multiplataforma)
  - FFmpeg (línea de comandos)
  - Compressor (Mac)
  - Adobe Media Encoder
- **Configuración recomendada**:
  - Codec: H.264
  - Resolución: 1920x1080 o 1280x720
  - Bitrate: 2-5 Mbps
  - Formato: MP4

### 2. Accesibilidad
- Siempre incluye una imagen principal atractiva
- La imagen se muestra mientras el video carga
- Agrega subtítulos cuando sea posible

### 3. SEO
- El título y descripción de la noticia son importantes
- YouTube y Vimeo ayudan con el SEO
- Usa palabras clave relevantes

### 4. Rendimiento
- Los videos no se cargan automáticamente
- El usuario debe hacer clic para reproducir
- Esto mejora la velocidad de carga de la página

## Casos de Uso

### Noticia con Entrevista
- **Tipo**: YouTube
- **Razón**: Fácil de compartir, sin costos de hosting
- **Ejemplo**: Entrevista a político o celebridad

### Cobertura en Vivo
- **Tipo**: HLS
- **Razón**: Streaming en tiempo real
- **Ejemplo**: Transmisión de evento deportivo

### Video Corporativo
- **Tipo**: Vimeo
- **Razón**: Profesional, sin publicidad
- **Ejemplo**: Anuncio oficial de empresa

### Clip Corto
- **Tipo**: MP4
- **Razón**: Control total, carga rápida
- **Ejemplo**: Video de 30 segundos de resumen

## Solución de Problemas

### El video no se reproduce
1. Verifica que la URL sea correcta
2. Asegúrate de que el video sea público
3. Revisa que el tipo de video coincida con la URL

### Error de YouTube
- El video puede estar restringido por región
- Verifica que el video no esté privado
- Algunos videos no permiten reproducción embebida

### Error de MP4/HLS
- Verifica que el servidor permita CORS
- Asegúrate de que la URL sea accesible públicamente
- Revisa el formato del archivo

## Componentes Técnicos

### Archivos Modificados/Creados
- `src/tipos/index.ts` - Tipos actualizados
- `src/componentes/ReproductorVideoNoticia.tsx` - Componente reproductor
- `src/componentes/SubidorVideo.tsx` - **NUEVO** Componente para subir videos
- `src/servicios/storage.ts` - **NUEVO** Servicio para gestionar archivos
- `src/app/admin/(dashboard)/noticias/nueva/page.tsx` - Formulario actualizado
- `src/app/noticias/[slug]/page.tsx` - Vista de detalle actualizada
- `src/componentes/TarjetaNoticia.tsx` - Indicador de video
- `supabase/agregar-video-noticias.sql` - Script de migración
- `supabase/storage-videos-setup.sql` - **NUEVO** Configuración de storage

### Dependencias
- Usa el componente `ReproductorVideo` existente para MP4 y HLS
- Iframes nativos para YouTube y Vimeo
- Sin dependencias adicionales necesarias

## Futuras Mejoras

- [ ] Subida directa de videos a Supabase Storage
- [ ] Generación automática de miniaturas
- [ ] Transcripción automática de audio
- [ ] Soporte para múltiples videos por noticia
- [ ] Playlist de videos relacionados
- [ ] Estadísticas de reproducción
