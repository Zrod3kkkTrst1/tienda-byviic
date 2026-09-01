-- Suscripciones de notificaciones push del navegador (panel admin de Victoria)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura publica" ON push_subscriptions FOR SELECT USING (true);
CREATE POLICY "Escritura publica" ON push_subscriptions FOR ALL USING (true) WITH CHECK (true);
