-- Script para actualizar URLs HTTP a HTTPS
-- Ejecutar en Supabase SQL Editor

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

-- Ver cuántos canales se actualizaron
SELECT 
  COUNT(*) as total_canales,
  COUNT(CASE WHEN url_stream LIKE 'https://%' THEN 1 END) as con_https,
  COUNT(CASE WHEN url_stream LIKE 'http://%' THEN 1 END) as con_http
FROM canales;
