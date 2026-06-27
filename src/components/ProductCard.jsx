import { useState } from 'react'
import { useCart } from '../context/CartContext'

const fmt = (n) => new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'USD' }).format(n)

export default function ProductCard({ product, onDetail }) {
  const { addItem } = useCart()
  const [hovered, setHovered] = useState(false)

  return (
    <article
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHovered : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onDetail && onDetail(product)}
    >
      <div style={styles.imageWrap}>
        {product.foto_url ? (
          <img
            src={product.foto_url}
            alt={product.nombre}
            style={{
              ...styles.image,
              ...(hovered ? styles.imageHovered : {}),
            }}
            loading="lazy"
          />
        ) : (
          <div style={styles.imagePlaceholder}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
        <div style={styles.badgeWrap}>
          {product.por_encargo ? (
            <span className="badge badge-order">Por encargo</span>
          ) : (
            <span className="badge badge-available">Disponible</span>
          )}
        </div>
      </div>

      <div style={styles.body}>
        <h3 style={styles.nombre}>{product.nombre}</h3>
        {product.descripcion && (
          <p style={styles.descripcion}>{product.descripcion}</p>
        )}

        <div style={styles.footer}>
          <div>
            <p style={styles.precio}>{fmt(product.precio)}</p>
            {product.por_encargo && (
              <p style={styles.abono}>Abono desde {fmt(product.precio / 2)}</p>
            )}
          </div>
          <button
            className="btn btn-primary"
            style={{ padding: '10px 18px', fontSize: 12 }}
            onClick={e => {
              e.stopPropagation()
              addItem(product)
            }}
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  )
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid var(--color-border-light)',
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
    transition: 'box-shadow 0.25s ease, transform 0.25s ease',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
  cardHovered: {
    transform: 'scale(1.02)',
    boxShadow: '0 12px 36px rgba(0,0,0,0.14)',
  },
  imageWrap: {
    position: 'relative',
    aspectRatio: '4/3',
    overflow: 'hidden',
    background: 'var(--color-bg-warm)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },
  imageHovered: {
    transform: 'scale(1.05)',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeWrap: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  body: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1,
  },
  nombre: {
    fontFamily: 'var(--font-serif)',
    fontSize: 18,
    fontWeight: 400,
    color: 'var(--color-text)',
  },
  descripcion: {
    fontSize: 13,
    color: 'var(--color-text-muted)',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  footer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: 12,
  },
  precio: {
    fontSize: 18,
    fontWeight: 600,
    color: 'var(--color-gold)',
    fontFamily: 'var(--font-serif)',
  },
  abono: {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    marginTop: 2,
  },
}
