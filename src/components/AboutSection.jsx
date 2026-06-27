import { useState, useEffect, useRef } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

const VIDEOS = [
  '/P/P111.mp4',
  '/P/P333.mp4',
  '/P/P555.mp4',
  '/P/P777.mp4',
  '/P/PP111.mp4',
  '/P/PP333.mp4',
]

export default function AboutSection() {
  const [current, setCurrent]   = useState(0)
  const [visible, setVisible]   = useState(true)
  const videoRef                = useRef(null)
  const [textRef, textVisible]  = useScrollReveal()

  function goTo(index) {
    setVisible(false)
    setTimeout(() => {
      setCurrent(index)
      setVisible(true)
    }, 400)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      goTo((current + 1) % VIDEOS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [current])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.load()
    v.play().catch(() => {})
  }, [current])

  return (
    <section id="nosotras" style={styles.section}>
      <div style={styles.inner} className="about-inner">

        {/* Video */}
        <div style={styles.videoCol} className="about-video">
          <div style={{ ...styles.videoWrap, opacity: visible ? 1 : 0 }}>
            <video
              ref={videoRef}
              src={VIDEOS[current]}
              style={styles.video}
              muted
              playsInline
              loop
              autoPlay
            />
            <div style={styles.dots}>
              {VIDEOS.map((_, i) => (
                <button
                  key={i}
                  style={{ ...styles.dot, ...(i === current ? styles.dotActive : {}) }}
                  onClick={() => goTo(i)}
                  aria-label={`Video ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Text */}
        <div
          ref={textRef}
          className={`reveal reveal-delay-2${textVisible ? ' visible' : ''}`}
          style={styles.textCol}
        >
          <span style={styles.label}>BELLEZA · CONFIANZA · ESTILO</span>
          <h2 style={styles.title}>
            Tu mirada<br />
            <em style={styles.titleGold}>lo dice todo</em>
          </h2>
          <p style={styles.para}>
            Las pestañas no son solo un accesorio — son la primera pincelada de tu historia.
            Cada extensión, cada curva, cada detalle habla de ti antes de que digas una sola palabra.
          </p>
          <p style={styles.para}>
            Una mirada poderosa transforma cómo te ves y cómo te sientes. Porque la mujer que sabe lo que quiere
            empieza por mirarse al espejo y reconocerse completamente.
          </p>
          <p style={styles.para}>
            En BYVIIC elegimos cada producto para que ese momento sea tuyo — auténtico, elegante y sin esfuerzo.
          </p>
          <div style={styles.rule} />
          <p style={styles.firma}>— Victoria, fundadora de BYVIIC</p>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-inner {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .about-video {
            order: -1;
          }
        }
      `}</style>
    </section>
  )
}

const styles = {
  section: {
    padding: '90px 24px',
    background: 'linear-gradient(160deg, #140f0a 0%, #1e1610 100%)',
  },
  inner: {
    maxWidth: 1100,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 72,
    alignItems: 'center',
  },
  videoCol: {
    display: 'flex',
    justifyContent: 'center',
  },
  videoWrap: {
    position: 'relative',
    width: '100%',
    maxWidth: 460,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 32px 80px rgba(0,0,0,0.55)',
    transition: 'opacity 0.4s ease',
    background: '#0a0806',
  },
  video: {
    width: '100%',
    height: 520,
    objectFit: 'cover',
    display: 'block',
  },
  dots: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    gap: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255,255,255,0.35)',
    cursor: 'pointer',
    padding: 0,
    transition: 'background 0.2s, transform 0.2s',
  },
  dotActive: {
    background: 'var(--color-gold)',
    transform: 'scale(1.35)',
  },
  textCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  label: {
    fontSize: 10,
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    letterSpacing: '0.22em',
    color: 'var(--color-gold)',
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontWeight: 300,
    fontSize: 'clamp(2rem, 3.5vw, 3rem)',
    lineHeight: 1.15,
    color: '#fff',
  },
  titleGold: {
    color: 'var(--color-gold)',
    fontStyle: 'italic',
  },
  para: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.62)',
    lineHeight: 1.9,
    fontWeight: 300,
  },
  rule: {
    border: 'none',
    borderTop: '1px solid rgba(160,112,64,0.35)',
    margin: '4px 0',
  },
  firma: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    letterSpacing: '0.04em',
  },
}
