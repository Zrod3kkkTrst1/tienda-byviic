-- Equivalente del Database Webhook usando pg_net directo (el esquema
-- supabase_functions no existe en este proyecto porque nunca se creo un
-- webhook desde la UI). SECURITY DEFINER para que el trigger funcione sin
-- importar que rol (anon/authenticated) hizo el INSERT del mensaje.
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION trigger_send_push()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, net, pg_temp
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://byviic.netlify.app/.netlify/functions/send-push',
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'mensajes',
      'schema', 'public',
      'record', to_jsonb(NEW)
    ),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', '6TriXEVyCWphg8ZulRcBKGMNqFAstkDOLb57P4xU'
    ),
    timeout_milliseconds := 5000
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS send_push_on_new_mensaje ON mensajes;
CREATE TRIGGER send_push_on_new_mensaje
AFTER INSERT ON mensajes
FOR EACH ROW
EXECUTE FUNCTION trigger_send_push();
