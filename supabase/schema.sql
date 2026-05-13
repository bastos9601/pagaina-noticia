-- Habilitar extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  correo TEXT UNIQUE NOT NULL,
  rol TEXT NOT NULL DEFAULT 'usuario' CHECK (rol IN ('admin', 'usuario')),
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  color TEXT DEFAULT '#DC2626'
);

-- Tabla de noticias
CREATE TABLE IF NOT EXISTS noticias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  contenido JSONB,
  imagen TEXT,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  autor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  destacada BOOLEAN DEFAULT FALSE,
  publicada BOOLEAN DEFAULT FALSE,
  vistas INTEGER DEFAULT 0,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de canales
CREATE TABLE IF NOT EXISTS canales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  logo TEXT,
  url_stream TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('hls', 'youtube', 'twitch', 'iframe', 'mp4', 'mkv')),
  categoria TEXT,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de publicidad
CREATE TABLE IF NOT EXISTS publicidad (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  imagen TEXT NOT NULL,
  enlace TEXT,
  activo BOOLEAN DEFAULT TRUE,
  posicion TEXT DEFAULT 'lateral' CHECK (posicion IN ('superior', 'lateral', 'contenido')),
  fecha_inicio TIMESTAMP WITH TIME ZONE,
  fecha_fin TIMESTAMP WITH TIME ZONE
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_noticias_slug ON noticias(slug);
CREATE INDEX IF NOT EXISTS idx_noticias_categoria ON noticias(categoria_id);
CREATE INDEX IF NOT EXISTS idx_noticias_publicada ON noticias(publicada);
CREATE INDEX IF NOT EXISTS idx_noticias_destacada ON noticias(destacada);
CREATE INDEX IF NOT EXISTS idx_noticias_fecha ON noticias(fecha_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_categorias_slug ON categorias(slug);
CREATE INDEX IF NOT EXISTS idx_canales_activo ON canales(activo);

-- Función para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION actualizar_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_actualizacion = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar fecha_actualizacion en noticias
CREATE TRIGGER trigger_actualizar_fecha_noticias
  BEFORE UPDATE ON noticias
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_fecha_actualizacion();

-- Row Level Security (RLS)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE canales ENABLE ROW LEVEL SECURITY;
ALTER TABLE publicidad ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública
CREATE POLICY "Lectura pública de categorías" ON categorias FOR SELECT USING (true);
CREATE POLICY "Lectura pública de noticias publicadas" ON noticias FOR SELECT USING (publicada = true);
CREATE POLICY "Lectura pública de canales activos" ON canales FOR SELECT USING (activo = true);
CREATE POLICY "Lectura pública de publicidad activa" ON publicidad FOR SELECT USING (activo = true);

-- Políticas de administración (requiere autenticación)
CREATE POLICY "Admin puede todo en usuarios" ON usuarios FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin puede todo en categorías" ON categorias FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin puede todo en noticias" ON noticias FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin puede todo en canales" ON canales FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin puede todo en publicidad" ON publicidad FOR ALL USING (auth.role() = 'authenticated');

-- Datos de ejemplo
INSERT INTO categorias (nombre, slug, descripcion, color) VALUES
  ('Política', 'politica', 'Noticias de política nacional e internacional', '#DC2626'),
  ('Deportes', 'deportes', 'Últimas noticias deportivas', '#2563EB'),
  ('Tecnología', 'tecnologia', 'Innovación y tecnología', '#7C3AED'),
  ('Economía', 'economia', 'Noticias económicas y financieras', '#059669'),
  ('Entretenimiento', 'entretenimiento', 'Espectáculos y cultura', '#D97706')
ON CONFLICT (slug) DO NOTHING;

-- Usuario admin de ejemplo (cambiar en producción)
INSERT INTO usuarios (nombre, correo, rol) VALUES
  ('Administrador', 'admin@noticiasLive.com', 'admin')
ON CONFLICT (correo) DO NOTHING;
