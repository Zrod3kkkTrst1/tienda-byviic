-- Chat entre cliente y Victoria (reemplaza el flujo de WhatsApp)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Nota: pedido_id asume que pedidos.id es BIGINT (default del wizard de tablas
-- de Supabase). Si tu tabla `pedidos` usa otro tipo de id, quita la cláusula
-- REFERENCES y deja la columna como BIGINT/UUID/TEXT según corresponda.
CREATE TABLE IF NOT EXISTS mensajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telefono TEXT NOT NULL,
  autor TEXT NOT NULL CHECK (autor IN ('cliente', 'admin')),
  texto TEXT NOT NULL,
  pedido_id BIGINT REFERENCES pedidos(id),
  leido_admin BOOLEAN DEFAULT false,
  leido_cliente BOOLEAN DEFAULT false,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mensajes_telefono ON mensajes(telefono, creado_en);

ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura publica" ON mensajes FOR SELECT USING (true);
CREATE POLICY "Escritura publica" ON mensajes FOR INSERT WITH CHECK (true);
CREATE POLICY "Actualizacion publica" ON mensajes FOR UPDATE USING (true);

-- IMPORTANTE: después de correr esto, activa Realtime para esta tabla en
-- el dashboard de Supabase: Database → Replication → mensajes → ON.
