self.addEventListener('push', (event) => {
  let data = {}
  try { data = event.data.json() } catch { data = { title: 'BYVIIC', body: event.data?.text() || 'Nuevo mensaje' } }

  event.waitUntil(
    self.registration.showNotification(data.title || 'BYVIIC', {
      body: data.body || 'Tienes un mensaje nuevo',
      icon: '/logo.png',
      badge: '/logo.png',
      data: { url: data.url || '/' },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(self.clients.openWindow(url))
})
