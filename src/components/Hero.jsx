export default function Hero() {
  return (
    <section id="inicio" style={styles.section}>
      {/* Decorative floating circles */}
      <div style={{ ...styles.circle, ...styles.circle1 }} />
      <div style={{ ...styles.circle, ...styles.circle2 }} />
      <div style={{ ...styles.circle, ...styles.circle3 }} />
      <div style={{ ...styles.circle, ...styles.circle4 }} />

      <div style={styles.content}>
        <img
          src="/logo.jpg"
          alt="BYVIIC"
          style={styles.logoImg}
          className="reveal visible"
        />
      </div>

      {/* Bottom gold rule */}
      <div style={styles.rule} />
    </section>
  )
}

const styles = {
  section: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffffff',
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  circle1: {
    width: 420,
    height: 420,
    top: '-80px',
    right: '-80px',
    background: 'radial-gradient(circle, rgba(155,107,66,0.12) 0%, transparent 70%)',
    animation: 'float 7s ease-in-out infinite',
  },
  circle2: {
    width: 260,
    height: 260,
    top: '15%',
    right: '8%',
    background: 'rgba(155,107,66,0.07)',
    border: '1px solid rgba(155,107,66,0.15)',
    animation: 'float 9s ease-in-out infinite',
    animationDelay: '1.5s',
  },
  circle3: {
    width: 180,
    height: 180,
    bottom: '18%',
    left: '4%',
    background: 'rgba(155,107,66,0.06)',
    border: '1px solid rgba(155,107,66,0.1)',
    animation: 'float 11s ease-in-out infinite',
    animationDelay: '3s',
  },
  circle4: {
    width: 100,
    height: 100,
    bottom: '30%',
    right: '20%',
    background: 'rgba(155,107,66,0.08)',
    animation: 'float 6s ease-in-out infinite',
    animationDelay: '0.5s',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 24px',
    width: '100%',
  },
  logoImg: {
    width: 'min(720px, 86vw)',
    height: 'auto',
    mixBlendMode: 'multiply',
    maskImage: 'radial-gradient(ellipse 68% 68% at 50% 50%, black 38%, transparent 82%)',
    WebkitMaskImage: 'radial-gradient(ellipse 68% 68% at 50% 50%, black 38%, transparent 82%)',
    animation: 'fadeUp 1s ease both',
  },
  rule: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    background: 'linear-gradient(90deg, transparent, var(--color-gold-light), transparent)',
    opacity: 0.5,
  },
}
