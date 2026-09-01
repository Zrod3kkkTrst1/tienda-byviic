import { useState, useCallback } from 'react'
import { useCart } from '../context/CartContext'
import { NOMBRE_TIENDA } from '../lib/constants'

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Productos', href: '#productos' },
  { label: 'Categorías', href: '#categorias' },
  { label: 'Nosotras', href: '#nosotras' },
]

export default function Navbar({ onAdminAccess, onChatAccess }) {
  const { totalItems, setIsOpen } = useCart()
  const [logoClicks, setLogoClicks] = useState(0)
  const [clickTimer, setClickTimer] = useState(null)

  const handleLogoClick = useCallback(() => {
    const newCount = logoClicks + 1
    setLogoClicks(newCount)

    if (clickTimer) clearTimeout(clickTimer)

    if (newCount >= 5) {
      setLogoClicks(0)
      onAdminAccess()
      return
    }

    const timer = setTimeout(() => setLogoClicks(0), 2000)
    setClickTimer(timer)
  }, [logoClicks, clickTimer, onAdminAccess])

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <button style={styles.logo} onClick={handleLogoClick} aria-label="Inicio" className="navbar-logo">
          <span style={styles.logoText}>{NOMBRE_TIENDA}</span>
        </button>

        {/* Center nav links — hidden on mobile via inline media workaround */}
        <nav style={styles.nav} className="navbar-links">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} style={styles.navLink} className="navbar-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            style={styles.cartBtn}
            className="navbar-cart"
            onClick={onChatAccess}
            aria-label="Chat con la tienda"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </button>

          <button
            style={styles.cartBtn}
            className="navbar-cart"
            onClick={() => setIsOpen(true)}
            aria-label={`Carrito: ${totalItems} artículos`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span style={styles.badge}>{totalItems}</span>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .navbar-links { display: none !important; }
        }
        @keyframes logo-appear {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .navbar-logo {
          animation: logo-appear 0.7s ease both;
        }
        .navbar-logo:hover img {
          filter: drop-shadow(0 2px 10px rgba(160,112,64,0.38)) brightness(1.06) !important;
          transform: scale(1.03);
          transition: all 0.3s ease;
        }
        .navbar-link:hover {
          color: #A07040 !important;
        }
        .navbar-cart:hover {
          color: #A07040 !important;
        }
      `}</style>
    </header>
  )
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(255,255,255,0.97)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(160,112,64,0.18)',
    boxShadow: '0 1px 16px rgba(160,112,64,0.07)',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 32px',
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    userSelect: 'none',
  },
  logoText: {
    fontFamily: 'var(--font-serif)',
    fontSize: 28,
    fontWeight: 400,
    letterSpacing: '0.12em',
    color: 'var(--color-gold)',
    display: 'block',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 36,
  },
  navLink: {
    fontFamily: 'var(--font-sans)',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--color-text-muted)',
    transition: 'color 0.2s',
    textDecoration: 'none',
  },
  cartBtn: {
    position: 'relative',
    background: 'none',
    border: 'none',
    color: 'var(--color-text-muted)',
    display: 'flex',
    alignItems: 'center',
    padding: 8,
    borderRadius: 'var(--radius)',
    transition: 'color var(--transition)',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    background: 'var(--color-gold)',
    color: '#fff',
    borderRadius: '50%',
    width: 18,
    height: 18,
    fontSize: 10,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  },
}
