-- Tabla de clientes logueados por teléfono (sin verificación OTP)
CREATE TABLE IF NOT EXISTS clientes (
  telefono TEXT PRIMARY KEY,
  nombre TEXT,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  ultima_actividad TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura publica" ON clientes FOR SELECT USING (true);
CREATE POLICY "Escritura publica" ON clientes FOR ALL USING (true) WITH CHECK (true);
