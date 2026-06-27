-- Tabla de configuración general de la tienda
CREATE TABLE IF NOT EXISTS configuracion (
  clave TEXT PRIMARY KEY,
  valor TEXT NOT NULL,
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura publica" ON configuracion FOR SELECT USING (true);
CREATE POLICY "Escritura admin" ON configuracion FOR ALL USING (true);

INSERT INTO configuracion (clave, valor) VALUES
  ('horario_entrega', 'Entregas los domingos · Horario por confirmar — pronto te avisamos'),
  ('horario_tienda',  'Escribe aquí el horario de retiro en tienda')
ON CONFLICT (clave) DO NOTHING;
