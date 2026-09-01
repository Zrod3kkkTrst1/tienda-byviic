import { useState, useCallback, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { CartProvider } from './context/CartContext'
import { SesionClienteProvider, useSesionCliente } from './context/SesionClienteContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CategorySection from './components/CategorySection'
import Catalog from './components/Catalog'
import MobilePreview from './components/MobilePreview'
import AboutSection from './components/AboutSection'
import Footer from './components/Footer'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import LoginCliente from './components/Cliente/LoginCliente'
import ChatPanel from './components/Cliente/ChatPanel'
import AdminLogin from './components/Admin/AdminLogin'
import AdminPanel from './components/Admin/AdminPanel'
import HorarioEntregas from './components/HorarioEntregas'
import MobileDevPreview from './components/Dev/MobileDevPreview'

function ChatGateway({ open, onClose }) {
  const { sesion } = useSesionCliente()
  if (!open) return null
  return sesion
    ? <ChatPanel isOpen={open} onClose={onClose} />
    : <LoginCliente onSuccess={() => {}} onClose={onClose} />
}

export default function App() {
  const [vista, setVista] = useState('tienda')
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [chatAbierto, setChatAbierto] = useState(false)
  const [esAdmin, setEsAdmin] = useState(false)

  useEffect(() => {
    let activo = true

    async function chequearAdmin(session) {
      if (!session) {
        if (activo) setEsAdmin(false)
        return
      }
      const { data } = await supabase.from('admins').select('user_id').eq('user_id', session.user.id).maybeSingle()
      if (activo) setEsAdmin(!!data)
    }

    supabase.auth.getSession().then(({ data: { session } }) => chequearAdmin(session))

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      chequearAdmin(session)
    })

    return () => {
      activo = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const handleAdminAccess = useCallback(() => {
    if (esAdmin) {
      setVista('admin')
    } else {
      setShowAdminLogin(true)
    }
  }, [esAdmin])

  const handleAdminSuccess = useCallback(() => {
    setShowAdminLogin(false)
    setVista('admin')
  }, [])

  if (vista === 'admin') {
    return <AdminPanel onClose={() => setVista('tienda')} />
  }

  return (
    <SesionClienteProvider>
      <CartProvider>
        <Navbar onAdminAccess={handleAdminAccess} onChatAccess={() => setChatAbierto(true)} />
        <HorarioEntregas />
        <Hero />
        <CategorySection />
        <Catalog />
        <MobilePreview />
        <AboutSection />
        <Footer />
        <Cart onCheckout={() => setShowCheckout(true)} />
        {showCheckout && (
          <Checkout
            onClose={() => setShowCheckout(false)}
            onPedidoEnviado={() => setChatAbierto(true)}
          />
        )}
        {showAdminLogin && (
          <AdminLogin
            onSuccess={handleAdminSuccess}
            onClose={() => setShowAdminLogin(false)}
          />
        )}
        <ChatGateway open={chatAbierto} onClose={() => setChatAbierto(false)} />
        <MobileDevPreview />
      </CartProvider>
    </SesionClienteProvider>
  )
}
