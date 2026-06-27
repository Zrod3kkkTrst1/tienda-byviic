import useScrollReveal from '../hooks/useScrollReveal'

const FEATURES = [
  'Catálogo completo desde tu celular',
  'Agrega al carrito con un toque',
  'Pide por WhatsApp en segundos',
  'Abona el 50% en productos por encargo',
]

export default function MobilePreview() {
  const [textRef, textVisible] = useScrollReveal()
  const [phoneRef, phoneVisible] = useScrollReveal()

  return (
    <section style={styles.section}>
      <div style={styles.inner}>
        {/* Text column */}
        <div
          ref={textRef}
          className={`reveal${textVisible ? ' visible' : ''}`}
          style={styles.textCol}
        >
          <span style={styles.label}>DISEÑADA PARA TI</span>
          <h2 style={styles.title}>Tu tienda en la<br />palma de tu mano</h2>
          <ul style={styles.list}>
            {FEATURES.map((f, i) => (
              <li key={i} style={styles.listItem}>
                <span style={styles.check}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="var(--color-gold)" opacity="0.15" />
                    <path d="M4 8l3 3 5-5" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span style={styles.featureText}>{f}</span>
              </li>
            ))}
          </ul>
          <a href="#productos" className="btn btn-primary" style={{ marginTop: 8, alignSelf: 'flex-start' }}>
            Ver productos
          </a>
        </div>

        {/* Phone column */}
        <div
          ref={phoneRef}
          className={`reveal reveal-delay-2${phoneVisible ? ' visible' : ''}`}
          style={styles.phoneCol}
        >
          <div style={styles.phone}>
            {/* Notch */}
            <div style={styles.notch} />
            {/* Phone screen content */}
            <div style={styles.screen}>
              {/* Mini navbar */}
              <div style={styles.miniNav}>
                <div style={styles.miniLogo}>
                  <span style={styles.miniLogoDot} />
                  <span style={styles.miniLogoText}>Cosméticos</span>
                </div>
                <div style={styles.miniCart}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#b08d3f" strokeWidth="2">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                  </svg>
                </div>
              </div>
              {/* Mini hero */}
              <div style={styles.miniHero}>
                <div style={styles.miniHeroLine1} />
                <div style={styles.miniHeroLine2} />
                <div style={styles.miniHeroBtn} />
              </div>
              {/* Mini product grid */}
              <div style={styles.miniGrid}>
                {[
                  { bg: '#f5e6d3', label: 'Labial' },
                  { bg: '#e8d5eb', label: 'Paleta' },
                  { bg: '#d5e8e3', label: 'Sérum' },
                  { bg: '#e8e3d5', label: 'Crema' },
                ].map((p, i) => (
                  <div key={i} style={{ ...styles.miniCard, background: p.bg }}>
                    <div style={styles.miniCardImg} />
                    <div style={styles.miniCardBody}>
                      <div style={{ ...styles.miniCardLine, width: '70%' }} />
                      <div style={{ ...styles.miniCardLine, width: '45%', background: '#b08d3f', opacity: 0.7 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Shine pseudo-effect */}
            <div style={styles.shine} />
          </div>
        </div>
      </div>
    </section>
  )
}

const styles = {
  section: {
    background: 'var(--color-bg-warm)',
    padding: '80px 24px',
    position: 'relative',
    overflow: 'hidden',
  },
  inner: {
    maxWidth: 1100,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 80,
    alignItems: 'center',
  },
  textCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  label: {
    fontSize: 11,
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    letterSpacing: '0.18em',
    color: 'var(--color-gold)',
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontWeight: 300,
    fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
    lineHeight: 1.2,
    color: 'var(--color-text)',
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  check: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: 'var(--color-text-muted)',
    lineHeight: 1.4,
  },
  phoneCol: {
    display: 'flex',
    justifyContent: 'center',
  },
  phone: {
    position: 'relative',
    width: 280,
    height: 560,
    borderRadius: 36,
    border: '8px solid #1a1a1a',
    background: '#fff',
    boxShadow: '0 24px 64px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  notch: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 80,
    height: 22,
    background: '#1a1a1a',
    borderRadius: '0 0 14px 14px',
    zIndex: 10,
  },
  screen: {
    position: 'absolute',
    inset: 0,
    overflowY: 'auto',
    background: '#faf7f0',
    paddingTop: 22,
  },
  miniNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    background: '#fff',
    borderBottom: '1px solid #f0ebe0',
  },
  miniLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  miniLogoDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--color-gold)',
    display: 'block',
  },
  miniLogoText: {
    fontFamily: 'var(--font-serif)',
    fontSize: 9,
    color: '#1a1a1a',
    letterSpacing: '0.04em',
  },
  miniCart: {
    display: 'flex',
    alignItems: 'center',
  },
  miniHero: {
    padding: '16px 12px 14px',
    background: 'linear-gradient(135deg, #faf7f0, #fff)',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    alignItems: 'flex-start',
  },
  miniHeroLine1: {
    height: 7,
    width: '60%',
    borderRadius: 4,
    background: '#1a1a1a',
    opacity: 0.7,
  },
  miniHeroLine2: {
    height: 5,
    width: '40%',
    borderRadius: 4,
    background: '#6b6b6b',
    opacity: 0.5,
  },
  miniHeroBtn: {
    marginTop: 4,
    height: 12,
    width: 56,
    borderRadius: 3,
    background: 'var(--color-gold)',
    opacity: 0.85,
  },
  miniGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 6,
    padding: '10px 10px',
  },
  miniCard: {
    borderRadius: 6,
    overflow: 'hidden',
    border: '1px solid rgba(0,0,0,0.06)',
  },
  miniCardImg: {
    height: 52,
    background: 'rgba(0,0,0,0.07)',
  },
  miniCardBody: {
    padding: '5px 6px 6px',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    background: '#fff',
  },
  miniCardLine: {
    height: 4,
    borderRadius: 2,
    background: '#1a1a1a',
    opacity: 0.25,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '40%',
    height: '100%',
    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)',
    pointerEvents: 'none',
    borderRadius: 'inherit',
  },
}
