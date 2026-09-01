-- Permite borrar un pedido desde el admin sin romper por la referencia del
-- mensaje-resumen que el checkout crea automaticamente. Al borrar el
-- pedido, el mensaje se conserva (es historial de chat real), solo se le
-- limpia el pedido_id.
ALTER TABLE mensajes DROP CONSTRAINT mensajes_pedido_id_fkey;

ALTER TABLE mensajes
  ADD CONSTRAINT mensajes_pedido_id_fkey
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL;
