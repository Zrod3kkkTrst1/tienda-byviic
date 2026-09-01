-- Recrea clientes con auth_uid (sesion anonima real de Supabase Auth) como
-- llave, en vez de telefono. Solo hay datos de prueba hoy, por eso se
-- dropea directo en vez de migrar.
DROP TABLE IF EXISTS clientes;

CREATE TABLE clientes (
  auth_uid UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  telefono TEXT NOT NULL,
  nombre TEXT,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  ultima_actividad TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clientes_telefono ON clientes(telefono);

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- El admin ve todos los clientes (para listar conversaciones); cada sesion
-- (incluida una anonima) solo puede ver/tocar su propia fila.
CREATE POLICY "Admin ve todos los clientes" ON clientes
  FOR SELECT USING (is_admin());

CREATE POLICY "Cliente ve su propia fila" ON clientes
  FOR SELECT USING (auth.uid() = auth_uid);

CREATE POLICY "Cliente crea/actualiza su propia fila" ON clientes
  FOR INSERT WITH CHECK (auth.uid() = auth_uid);

CREATE POLICY "Cliente actualiza su propia fila" ON clientes
  FOR UPDATE USING (auth.uid() = auth_uid) WITH CHECK (auth.uid() = auth_uid);
