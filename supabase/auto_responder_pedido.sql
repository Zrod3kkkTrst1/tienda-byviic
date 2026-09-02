-- Envia automaticamente el mensaje de instrucciones de pago apenas se crea
-- un pedido. SECURITY DEFINER porque el cliente (rol anon/authenticated)
-- NO tiene permiso de insertar mensajes con autor='admin' (RLS lo bloquea
-- a proposito) — este trigger corre con privilegios elevados, como una
-- accion legitima del sistema, no del cliente.
--
-- Texto identico al de MENSAJE_BIENVENIDA en src/lib/mensajes.js — si se
-- cambia uno, actualizar el otro.
CREATE OR REPLACE FUNCTION auto_responder_pedido()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_telefono TEXT;
BEGIN
  SELECT telefono INTO v_telefono FROM clientes WHERE auth_uid = NEW.auth_uid;

  IF v_telefono IS NOT NULL THEN
    INSERT INTO mensajes (telefono, autor, texto, pedido_id)
    VALUES (
      v_telefono,
      'admin',
      'Bienvenida a BYVIIC. Para realizar tu pedido debes enviar el 50% o cancelar por Yappy al 6540-4105 Ana Rivera, y enviarnos el comprobante al 6681-1682. No hacemos devoluciones una vez realizado el abono.',
      NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS auto_responder_pedido_trigger ON pedidos;
CREATE TRIGGER auto_responder_pedido_trigger
AFTER INSERT ON pedidos
FOR EACH ROW
EXECUTE FUNCTION auto_responder_pedido();
