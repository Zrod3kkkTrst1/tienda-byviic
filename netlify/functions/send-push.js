import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const VAPID_PUBLIC_KEY = process.env.VITE_VAPID_PUBLIC_KEY
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  if (WEBHOOK_SECRET && event.headers['x-webhook-secret'] !== WEBHOOK_SECRET) {
    return { statusCode: 401, body: 'Unauthorized' }
  }

  let payload
  try {
    payload = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  const mensaje = payload.record
  if (!mensaje || (mensaje.autor !== 'cliente' && mensaje.autor !== 'admin')) {
    return { statusCode: 200, body: 'Ignorado' }
  }

  webpush.setVapidDetails('mailto:soporte@byviic.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  // Mensaje de cliente -> avisa a los admins (telefono NULL).
  // Mensaje de admin -> avisa solo al cliente de esa conversacion.
  let query = supabase.from('push_subscriptions').select('*').eq('activo', true)
  query = mensaje.autor === 'cliente'
    ? query.is('telefono', null)
    : query.eq('telefono', mensaje.telefono)

  const { data: subs, error } = await query

  if (error) {
    return { statusCode: 500, body: 'Error leyendo suscripciones: ' + error.message }
  }

  const notificacion = JSON.stringify({
    title: 'BYVIIC',
    body: mensaje.autor === 'cliente'
      ? (mensaje.texto?.slice(0, 120) || 'Tienes un mensaje nuevo')
      : `Victoria respondió: ${mensaje.texto?.slice(0, 100) || ''}`,
    url: '/',
  })

  await Promise.all((subs || []).map(async (sub) => {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: { p256dh: sub.p256dh, auth: sub.auth },
    }
    try {
      await webpush.sendNotification(pushSubscription, notificacion)
    } catch (err) {
      if (err.statusCode === 404 || err.statusCode === 410) {
        await supabase.from('push_subscriptions').update({ activo: false }).eq('id', sub.id)
      }
    }
  }))

  return { statusCode: 200, body: 'OK' }
}
