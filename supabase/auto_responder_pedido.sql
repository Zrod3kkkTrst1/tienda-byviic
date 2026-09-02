-- Envia automaticamente el mensaje de instrucciones de pago justo despues
-- del mensaje-resumen del pedido del cliente (no en el momento en que se
-- crea la fila de `pedidos`, que ocurre ANTES de que exista ese mensaje y
-- causaba que la auto-respuesta apareciera primero en el chat).
--
-- SECURITY DEFINER porque el cliente no tiene permiso de insertar
-- mensajes con autor='admin' (RLS lo bloquea a proposito) — este trigger
-- corre como una accion legitima del sistema, no del cliente.
--
-- Texto identico al de MENSAJE_BIENVENIDA en src/lib/mensajes.js — si se
-- cambia uno, actualizar el otro.
DROP TRIGGER IF EXISTS auto_responder_pedido_trigger ON pedidos;
DROP FUNCTION IF EXISTS auto_responder_pedido();

CREATE OR REPLACE FUNCTION auto_responder_pedido_mensaje()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.autor = 'cliente' AND NEW.pedido_id IS NOT NULL THEN
    INSERT INTO mensajes (telefono, autor, texto, pedido_id)
    VALUES (
      NEW.telefono,
      'admin',
      'Bienvenida a BYVIIC. Para realizar tu pedido debes enviar el 50% o cancelar por Yappy al 6540-4105 Ana Rivera, y enviarnos el comprobante al 6681-1682. No hacemos devoluciones una vez realizado el abono.',
      NEW.pedido_id
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS auto_responder_pedido_mensaje_trigger ON mensajes;
CREATE TRIGGER auto_responder_pedido_mensaje_trigger
AFTER INSERT ON mensajes
FOR EACH ROW
EXECUTE FUNCTION auto_responder_pedido_mensaje();
