-- Agregar campo de video a la tabla de noticias
ALTER TABLE noticias 
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS video_tipo TEXT CHECK (video_tipo IN ('youtube', 'vimeo', 'mp4', 'hls')),
ADD COLUMN IF NOT EXISTS video_thumbnail TEXT;

-- Comentarios para documentación
COMMENT ON COLUMN noticias.video_url IS 'URL del video (YouTube, Vimeo, MP4, HLS)';
COMMENT ON COLUMN noticias.video_tipo IS 'Tipo de video: youtube, vimeo, mp4, hls';
COMMENT ON COLUMN noticias.video_thumbnail IS 'URL de la miniatura del video (generada automáticamente para videos subidos)';
