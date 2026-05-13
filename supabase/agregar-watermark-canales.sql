-- Agregar campo para controlar el watermark en canales
ALTER TABLE canales
ADD COLUMN IF NOT EXISTS mostrar_watermark BOOLEAN DEFAULT true;

-- Actualizar canales existentes para mostrar watermark por defecto
UPDATE canales SET mostrar_watermark = true WHERE mostrar_watermark IS NULL;
