-- Crear bucket para imágenes
INSERT INTO storage.buckets (id, name, public)
VALUES ('imagenes', 'imagenes', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir subir imágenes (público)
CREATE POLICY "Permitir subir imágenes públicamente"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'imagenes');

-- Política para leer imágenes (público)
CREATE POLICY "Permitir leer imágenes públicamente"
ON storage.objects FOR SELECT
USING (bucket_id = 'imagenes');

-- Política para eliminar imágenes (service role)
CREATE POLICY "Permitir eliminar imágenes con service role"
ON storage.objects FOR DELETE
USING (bucket_id = 'imagenes');
