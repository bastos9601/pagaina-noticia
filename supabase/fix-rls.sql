-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Admin puede todo en usuarios" ON usuarios;
DROP POLICY IF EXISTS "Admin puede todo en categorías" ON categorias;
DROP POLICY IF EXISTS "Admin puede todo en noticias" ON noticias;
DROP POLICY IF EXISTS "Admin puede todo en canales" ON canales;
DROP POLICY IF EXISTS "Admin puede todo en publicidad" ON publicidad;

-- Políticas para service_role (bypass RLS automáticamente)
-- Políticas para operaciones de escritura (INSERT, UPDATE, DELETE)

-- Usuarios
CREATE POLICY "Service role puede todo en usuarios" ON usuarios FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Categorías
CREATE POLICY "Service role puede todo en categorías" ON categorias FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Noticias
CREATE POLICY "Service role puede todo en noticias" ON noticias FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Canales
CREATE POLICY "Service role puede todo en canales" ON canales FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Publicidad
CREATE POLICY "Service role puede todo en publicidad" ON publicidad FOR ALL 
  USING (true) 
  WITH CHECK (true);
