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

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Permitir subir videos públicamente" ON storage.objects;
DROP POLICY IF EXISTS "Permitir leer videos públicamente" ON storage.objects;
DROP POLICY IF EXISTS "Permitir eliminar videos con service role" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualizar videos con service role" ON storage.objects;

-- Crear políticas nuevas
CREATE POLICY "Permitir subir videos públicamente"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Permitir leer videos públicamente"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

CREATE POLICY "Permitir eliminar videos con service role"
ON storage.objects FOR DELETE
USING (bucket_id = 'videos');

CREATE POLICY "Permitir actualizar videos con service role"
ON storage.objects FOR UPDATE
USING (bucket_id = 'videos');
