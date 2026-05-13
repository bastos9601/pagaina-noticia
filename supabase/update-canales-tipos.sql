-- Actualizar constraint de la tabla canales para soportar MP4 y MKV
-- Este script actualiza la base de datos existente sin perder datos

-- Primero, eliminar el constraint existente
ALTER TABLE canales DROP CONSTRAINT IF EXISTS canales_tipo_check;

-- Agregar el nuevo constraint con los tipos adicionales
ALTER TABLE canales ADD CONSTRAINT canales_tipo_check 
  CHECK (tipo IN ('hls', 'youtube', 'twitch', 'iframe', 'mp4', 'mkv'));

-- Verificar que el cambio se aplicó correctamente
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'canales_tipo_check';
