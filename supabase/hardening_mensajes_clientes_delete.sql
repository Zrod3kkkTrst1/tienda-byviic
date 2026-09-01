-- Permite al admin borrar conversaciones completas (mensajes + la fila de
-- clientes). No existia ninguna policy de DELETE para estas tablas, asi
-- que RLS las bloqueaba por defecto.
CREATE POLICY "mensajes_delete_admin" ON mensajes FOR DELETE
  USING (is_admin());

CREATE POLICY "clientes_delete_admin" ON clientes FOR DELETE
  USING (is_admin());
