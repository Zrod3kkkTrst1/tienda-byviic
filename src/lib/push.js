export async function registrarServiceWorker() {
  if (!('serviceWorker' in navigator)) return null
  try {
    return await navigator.serviceWorker.register('/sw.js')
  } catch {
    return null
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

export async function suscribirAPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { error: 'Este navegador no soporta notificaciones push.' }
  }

  const permiso = await Notification.requestPermission()
  if (permiso !== 'granted') {
    return { error: 'Permiso de notificaciones denegado.' }
  }

  const registration = await navigator.serviceWorker.ready
  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
  if (!vapidPublicKey) {
    return { error: 'Falta configurar VITE_VAPID_PUBLIC_KEY.' }
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  })

  return { subscription: subscription.toJSON() }
}
