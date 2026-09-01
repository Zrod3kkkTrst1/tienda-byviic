import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { suscribirAPush } from '../lib/push'

// telefono: si se pasa, la suscripcion queda asociada a ese cliente
// (para avisarle cuando Victoria responda). Si se omite, es una
// suscripcion de admin (recibe aviso de mensajes nuevos de clientes).
export default function NotificacionesToggle({ telefono = null, etiqueta = 'Activar notificaciones' }) {
  const [estado, setEstado] = useState('verificando') // verificando | inactivo | activo | error
  const [mensajeError, setMensajeError] = useState('')

  useEffect(() => {
    async function verificar() {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setEstado('no-soportado')
        return
      }
      const registration = await navigator.serviceWorker.ready.catch(() => null)
      const sub = await registration?.pushManager.getSubscription()
      setEstado(sub ? 'activo' : 'inactivo')
    }
    verificar()
  }, [])

  async function activar() {
    setEstado('verificando')
    setMensajeError('')

    const { subscription, error } = await suscribirAPush()
    if (error) {
      setEstado('error')
      setMensajeError(error)
      return
    }

    const { error: dbError } = await supabase.from('push_subscriptions').upsert({
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      telefono,
      activo: true,
    }, { onConflict: 'endpoint' })

    if (dbError) {
      setEstado('error')
      setMensajeError(dbError.message)
      return
    }

    setEstado('activo')
  }

  if (estado === 'no-soportado') return null

  return (
    <div style={styles.wrap}>
      {estado === 'activo' && <span style={styles.badgeOk}>🔔 Notificaciones activas</span>}
      {estado === 'inactivo' && (
        <button className="btn btn-outline" style={{ fontSize: 12 }} onClick={activar}>
          {etiqueta}
        </button>
      )}
      {estado === 'verificando' && <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Verificando...</span>}
      {estado === 'error' && (
        <span style={{ fontSize: 12, color: 'var(--color-error)' }} title={mensajeError}>
          Error al activar notificaciones
        </span>
      )}
    </div>
  )
}

const styles = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
  },
  badgeOk: {
    fontSize: 12,
    color: '#4a7c59',
    fontWeight: 500,
  },
}
