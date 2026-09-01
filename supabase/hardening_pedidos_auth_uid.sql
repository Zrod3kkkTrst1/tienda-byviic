-- Necesario para que el cliente pueda "ver de vuelta" el pedido que acaba
-- de crear (Postgres/PostgREST exige que la fila sea visible por SELECT
-- para poder devolverla con `Prefer: return=representation`, si no el
-- INSERT mismo se reporta como violacion de RLS aunque haya sido valido).
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS auth_uid UUID REFERENCES auth.users(id);

DROP POLICY IF EXISTS "pedidos_select_admin" ON pedidos;
CREATE POLICY "pedidos_select_admin" ON pedidos FOR SELECT
  USING (is_admin() OR auth_uid = auth.uid());
