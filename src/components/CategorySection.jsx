import useScrollReveal from '../hooks/useScrollReveal'

const CATEGORIAS = [
  {
    nombre: 'Pestañas',
    imagen: '/pestanas/i1.jpg',
    sub: 'Clusters · Curva D',
  },
  {
    nombre: 'Maquillaje',
    imagen: '/maquillaje/m1.jpg',
    sub: 'Correctores · Delineadores',
  },
  {
    nombre: 'Accesorios',
    imagen: '/accesorios/a1.jpg',
    sub: 'Lentes · Complementos',
  },
]

function CategoryCard({ categoria, delay }) {
  const [ref, isVisible] = useScrollReveal(delay)

  function handleClick() {
    window.dispatchEvent(new CustomEvent('setCategoria', { detail: categoria.nombre }))
  }

  return (
    <div
      ref={ref}
      className={`reveal${isVisible ? ' visible' : ''}${delay ? ` reveal-delay-${delay}` : ''}`}
      style={styles.cardOuter}
    >
      <a
        href="#productos"
        className="cat-card"
        style={styles.card}
        onClick={handleClick}
      >
        <img src={categoria.imagen} alt={categoria.nombre} style={styles.img} loading="lazy" />

        {/* Overlay base */}
        <div style={styles.overlay} />

        {/* Shimmer dorado en hover */}
        <div className="cat-shimmer" style={styles.shimmer} />

        {/* Contenido */}
        <div style={styles.content} className="cat-content">
          <span style={styles.nombre} className="cat-nombre">{categoria.nombre}</span>
          <span className="cat-sub" style={styles.sub}>{categoria.sub}</span>
          <span className="cat-ver" style={styles.ver}>Ver productos →</span>
        </div>
      </a>
    </div>
  )
}

export default function CategorySection() {
  const [titleRef, titleVisible] = useScrollReveal()

  return (
    <section id="categorias" style={styles.section}>
      <style>{`
        .cat-card {
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .cat-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 24px 48px rgba(0,0,0,0.22), 0 0 0 1px rgba(160,112,64,0.3) !important;
        }
        .cat-card:hover img {
          transform: scale(1.08);
        }
        .cat-card:hover .cat-shimmer {
          opacity: 1;
          animation: shimmer-cat 1.2s ease forwards;
        }
        .cat-sub {
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s;
        }
        .cat-card:hover .cat-sub {
          opacity: 1;
          transform: translateY(0);
        }
        .cat-ver {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;
        }
        .cat-card:hover .cat-ver {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes shimmer-cat {
          0%   { transform: translateX(-100%) skewX(-15deg); opacity: 0.5; }
          100% { transform: translateX(200%) skewX(-15deg); opacity: 0; }
        }

        /* ── MÓVIL ── */
        @media (max-width: 640px) {
          .cat-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .cat-card {
            aspect-ratio: 16/7 !important;
            border-radius: 14px !important;
          }
          .cat-card:hover {
            transform: none !important;
          }
          .cat-sub, .cat-ver {
            opacity: 1 !important;
            transform: none !important;
          }
          .cat-nombre {
            font-size: 1.6rem !important;
          }
          .cat-content {
            padding: 20px 22px !important;
          }
        }
      `}</style>

      <div style={styles.inner}>
        <h2
          ref={titleRef}
          className={`reveal${titleVisible ? ' visible' : ''}`}
          style={styles.title}
        >
          Explora por categoría
        </h2>
        <div style={styles.grid} className="cat-grid">
          {CATEGORIAS.map((cat, i) => (
            <CategoryCard key={cat.nombre} categoria={cat} delay={i + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

const styles = {
  section: {
    background: 'var(--color-bg-warm)',
    padding: '80px 24px',
  },
  inner: {
    maxWidth: 1000,
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    fontFamily: 'var(--font-serif)',
    fontWeight: 300,
    fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
    letterSpacing: '0.02em',
    color: 'var(--color-text)',
    marginBottom: 48,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24,
  },
  cardOuter: {
    display: 'block',
  },
  card: {
    position: 'relative',
    display: 'block',
    aspectRatio: '3/4',
    overflow: 'hidden',
    borderRadius: 12,
    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.15) 100%)',
  },
  shimmer: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(105deg, transparent 40%, rgba(196,149,106,0.35) 50%, transparent 60%)',
    opacity: 0,
    pointerEvents: 'none',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  nombre: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
    fontWeight: 400,
    letterSpacing: '0.08em',
    color: '#fff',
    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
  },
  sub: {
    fontFamily: 'var(--font-sans)',
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.75)',
  },
  ver: {
    fontFamily: 'var(--font-sans)',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.06em',
    color: '#C4956A',
  },
}
