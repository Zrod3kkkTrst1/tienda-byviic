-- Reemplaza las policies permisivas ("USING (true)") por RLS real, ahora
-- que existen sesiones reales de Supabase Auth (admin real + anonimas de
-- cliente). Corre esto DESPUES de hardening_admins.sql y
-- hardening_clientes.sql.

-- Utilidad: borra todas las policies existentes de una tabla sin necesitar
-- saber sus nombres exactos (algunas, como las de productos/pedidos, se
-- crearon a mano desde el dashboard y no estan en el repo).
CREATE OR REPLACE FUNCTION _drop_all_policies(tabla text)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = tabla LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, tabla);
  END LOOP;
END;
$$;

-- ─── mensajes ────────────────────────────────────────────────
SELECT _drop_all_policies('mensajes');

CREATE POLICY "mensajes_select" ON mensajes FOR SELECT
  USING (
    is_admin()
    OR telefono IN (SELECT telefono FROM clientes WHERE auth_uid = auth.uid())
  );

CREATE POLICY "mensajes_insert" ON mensajes FOR INSERT
  WITH CHECK (
    (autor = 'admin' AND is_admin())
    OR (autor = 'cliente' AND telefono IN (SELECT telefono FROM clientes WHERE auth_uid = auth.uid()))
  );

CREATE POLICY "mensajes_update" ON mensajes FOR UPDATE
  USING (
    is_admin()
    OR telefono IN (SELECT telefono FROM clientes WHERE auth_uid = auth.uid())
  );

-- ─── pedidos ─────────────────────────────────────────────────
SELECT _drop_all_policies('pedidos');

CREATE POLICY "pedidos_select_admin" ON pedidos FOR SELECT
  USING (is_admin());

CREATE POLICY "pedidos_insert_autenticado" ON pedidos FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "pedidos_update_admin" ON pedidos FOR UPDATE
  USING (is_admin());

CREATE POLICY "pedidos_delete_admin" ON pedidos FOR DELETE
  USING (is_admin());

-- ─── push_subscriptions ──────────────────────────────────────
SELECT _drop_all_policies('push_subscriptions');

CREATE POLICY "push_subscriptions_admin" ON push_subscriptions FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- ─── productos ───────────────────────────────────────────────
SELECT _drop_all_policies('productos');

CREATE POLICY "productos_select_publico" ON productos FOR SELECT
  USING (true);

CREATE POLICY "productos_escritura_admin" ON productos FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "productos_update_admin" ON productos FOR UPDATE
  USING (is_admin());

CREATE POLICY "productos_delete_admin" ON productos FOR DELETE
  USING (is_admin());

-- ─── configuracion ───────────────────────────────────────────
SELECT _drop_all_policies('configuracion');

CREATE POLICY "configuracion_select_publico" ON configuracion FOR SELECT
  USING (true);

CREATE POLICY "configuracion_escritura_admin" ON configuracion FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

DROP FUNCTION _drop_all_policies(text);
