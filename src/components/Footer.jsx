import { NOMBRE_TIENDA, WHATSAPP_NUMERO } from '../lib/constants'

const ICON_INSTAGRAM = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const ICON_FACEBOOK = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const ICON_TIKTOK = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
  </svg>
)

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        {/* Col 1: Brand */}
        <div style={styles.col}>
          <span style={styles.brandName}>{NOMBRE_TIENDA}</span>
          <p style={styles.tagline}>
            Belleza que inspira, productos que transforman.
          </p>
          <div style={styles.socials}>
            <a href="https://www.instagram.com/byviicc__?igsh=MXEyZjQzMzVmNTF1NQ==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={styles.socialLink}>
              {ICON_INSTAGRAM}
            </a>
            <a href="https://www.tiktok.com/@1byviic?_r=1&_t=ZS-97YO455nvvj" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={styles.socialLink}>
              {ICON_TIKTOK}
            </a>
          </div>
        </div>

        {/* Col 2: Tienda */}
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Tienda</h4>
          <nav style={styles.linkList}>
            <a href="#productos" style={styles.link}>Ver productos</a>
            <a href="#categorias" style={styles.link}>Categorías</a>
            <a href="#productos" style={styles.link}>Novedades</a>
            <a href="#productos" style={styles.link}>Por encargo</a>
          </nav>
        </div>

        {/* Col 3: Contacto */}
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Contacto</h4>
          <nav style={styles.linkList}>
            <a
              href={`https://wa.me/${WHATSAPP_NUMERO}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              WhatsApp
            </a>
            <a href="mailto:contacto@mitienda.com" style={styles.link}>
              Email
            </a>
            <a href="#productos" style={styles.link}>Pedidos por encargo</a>
            <a href="#nosotras" style={styles.link}>Sobre nosotras</a>
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={styles.bottomBar}>
        <p style={styles.copy}>
          © {year} {NOMBRE_TIENDA}. Todos los derechos reservados.
        </p>
        <p style={styles.madeWith}>
          Hecho con amor en Panamá 🇵🇦
        </p>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background: '#1a1a1a',
    color: 'rgba(255,255,255,0.75)',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '64px 24px 40px',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: 48,
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  brandName: {
    fontFamily: 'var(--font-serif)',
    fontSize: 26,
    fontWeight: 400,
    letterSpacing: '0.04em',
    color: 'var(--color-gold-light)',
    lineHeight: 1,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.6,
    fontWeight: 300,
  },
  socials: {
    display: 'flex',
    gap: 12,
    marginTop: 4,
  },
  socialLink: {
    color: 'rgba(255,255,255,0.5)',
    transition: 'color 0.2s',
    display: 'flex',
    alignItems: 'center',
  },
  colTitle: {
    fontSize: 11,
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--color-gold-light)',
    marginBottom: 4,
  },
  linkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  link: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    transition: 'color 0.2s',
    fontWeight: 300,
  },
  bottomBar: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '20px 24px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  copy: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: 300,
  },
  madeWith: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: 300,
  },
}
