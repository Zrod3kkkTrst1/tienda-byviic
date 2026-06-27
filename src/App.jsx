import { useState, useCallback } from 'react'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CategorySection from './components/CategorySection'
import Catalog from './components/Catalog'
import MobilePreview from './components/MobilePreview'
import AboutSection from './components/AboutSection'
import Footer from './components/Footer'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import AdminLogin from './components/Admin/AdminLogin'
import AdminPanel from './components/Admin/AdminPanel'
import HorarioEntregas from './components/HorarioEntregas'
import MobileDevPreview from './components/Dev/MobileDevPreview'

export default function App() {
  const [vista, setVista] = useState('tienda')
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  const handleAdminAccess = useCallback(() => {
    setShowAdminLogin(true)
  }, [])

  const handleAdminSuccess = useCallback(() => {
    setShowAdminLogin(false)
    setVista('admin')
  }, [])

  if (vista === 'admin') {
    return <AdminPanel onClose={() => setVista('tienda')} />
  }

  return (
    <CartProvider>
      <Navbar onAdminAccess={handleAdminAccess} />
      <HorarioEntregas />
      <Hero />
      <CategorySection />
      <Catalog />
      <MobilePreview />
      <AboutSection />
      <Footer />
      <Cart onCheckout={() => setShowCheckout(true)} />
      {showCheckout && <Checkout onClose={() => setShowCheckout(false)} />}
      {showAdminLogin && (
        <AdminLogin
          onSuccess={handleAdminSuccess}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
      <MobileDevPreview />
    </CartProvider>
  )
}
