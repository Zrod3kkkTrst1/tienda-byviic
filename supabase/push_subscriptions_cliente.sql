-- Permite que los clientes tambien se suscriban a push (para avisarles
-- cuando Victoria responde). telefono NULL = suscripcion de admin;
-- telefono con valor = suscripcion de ese cliente especifico.
ALTER TABLE push_subscriptions ADD COLUMN IF NOT EXISTS telefono TEXT;

DROP POLICY IF EXISTS "push_subscriptions_admin" ON push_subscriptions;

CREATE POLICY "push_subscriptions_select" ON push_subscriptions FOR SELECT
  USING (
    is_admin()
    OR (telefono IS NOT NULL AND telefono IN (SELECT telefono FROM clientes WHERE auth_uid = auth.uid()))
  );

CREATE POLICY "push_subscriptions_insert" ON push_subscriptions FOR INSERT
  WITH CHECK (
    (telefono IS NULL AND is_admin())
    OR (telefono IS NOT NULL AND telefono IN (SELECT telefono FROM clientes WHERE auth_uid = auth.uid()))
  );

CREATE POLICY "push_subscriptions_update" ON push_subscriptions FOR UPDATE
  USING (
    is_admin()
    OR (telefono IS NOT NULL AND telefono IN (SELECT telefono FROM clientes WHERE auth_uid = auth.uid()))
  );

CREATE POLICY "push_subscriptions_delete" ON push_subscriptions FOR DELETE
  USING (is_admin());
