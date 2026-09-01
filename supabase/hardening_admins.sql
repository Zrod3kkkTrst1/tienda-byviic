-- Tabla de administradores reales (reemplaza el PIN en texto plano)
CREATE TABLE IF NOT EXISTS admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los admins pueden verse a si mismos" ON admins
  FOR SELECT USING (auth.uid() = user_id);

-- Usada por las policies de las demas tablas para chequear si la sesion
-- actual es de un admin. SECURITY DEFINER + search_path fijo para evitar
-- que RLS recursiva bloquee la lectura de "admins" y para que no sea
-- vulnerable a search_path hijacking.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid());
$$;

-- IMPORTANTE: después de crear el usuario admin en
-- Authentication -> Users -> Add user, corre esto reemplazando el UID:
-- INSERT INTO admins (user_id) VALUES ('<UID_DE_VICTORIA>');
