import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ProductCard from './ProductCard'
import useScrollReveal from '../hooks/useScrollReveal'
import { useCart } from '../context/CartContext'

const fmt = (n) => new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'USD' }).format(n)

function ProductModal({ product, onClose }) {
  const { addItem } = useCart()
  const [imgIndex, setImgIndex] = useState(0)

  if (!product) return null

  const todasLasMedia = [
    product.foto_url,
    ...((product.fotos && Array.isArray(product.fotos)) ? product.fotos : [])
  ].filter(Boolean)

  const isVideo = (url) => /\.(mp4|webm|mov)$/i.test(url)

  return (
    <div className="overlay" onClick={onClose} style={styles.modalOverlay}>
      <div
        style={styles.modal}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button style={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Product gallery (images + video) */}
        <div style={styles.modalImgWrap}>
          {todasLasMedia.length > 0 ? (
            <>
              {isVideo(todasLasMedia[imgIndex]) ? (
                <video
                  key={todasLasMedia[imgIndex]}
                  src={todasLasMedia[imgIndex]}
                  style={styles.modalImg}
                  controls
                  playsInline
                  loop
                />
              ) : (
                <img
                  src={todasLasMedia[imgIndex]}
                  alt={product.nombre}
                  style={styles.modalImg}
                />
              )}
              {todasLasMedia.length > 1 && (
                <div style={styles.dots}>
                  {todasLasMedia.map((url, i) => (
                    <button
                      key={i}
                      onClick={e => { e.stopPropagation(); setImgIndex(i) }}
                      style={{ ...styles.dot, ...(imgIndex === i ? styles.dotActive : {}) }}
                      aria-label={isVideo(url) ? 'Ver video' : `Foto ${i + 1}`}
                    >
                      {isVideo(url) && (
                        <svg width="6" height="6" viewBox="0 0 10 10" fill="currentColor" style={{ display: 'block' }}>
                          <polygon points="2,1 9,5 2,9" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={styles.modalImgPlaceholder}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          )}
        </div>

        {/* Details */}
        <div style={styles.modalBody}>
          <div style={styles.modalTop}>
            {product.por_encargo ? (
              <span className="badge badge-order">Por encargo</span>
            ) : (
              <span className="badge badge-available">Disponible</span>
            )}
            {product.categoria && (
              <span style={styles.modalCat}>{product.categoria}</span>
            )}
          </div>
          <h2 style={styles.modalNombre}>{product.nombre}</h2>
          {product.descripcion && (
            <p style={styles.modalDesc}>{product.descripcion}</p>
          )}
          <div style={styles.modalFooter}>
            <div>
              <p style={styles.modalPrecio}>{fmt(product.precio)}</p>
              <p style={styles.modalAbono}>Abono desde {fmt(product.precio / 2)}</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                addItem(product)
                onClose()
              }}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function RevealCard({ product, delay, onDetail }) {
  const [ref, isVisible] = useScrollReveal(delay)
  return (
    <div
      ref={ref}
      className={`reveal${isVisible ? ' visible' : ''}${delay ? ` reveal-delay-${delay}` : ''}`}
    >
      <ProductCard product={product} onDetail={onDetail} />
    </div>
  )
}

export default function Catalog() {
  const [productos, setProductos] = useState([])
  const [categoriaActiva, setCategoriaActiva] = useState('Pestañas')
  const categorias = ['Pestañas', 'Maquillaje', 'Accesorios']
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    const handler = (e) => setCategoriaActiva(e.detail)
    window.addEventListener('setCategoria', handler)
    return () => window.removeEventListener('setCategoria', handler)
  }, [])

  useEffect(() => {
    async function cargarProductos() {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('activo', true)
        .order('nombre')

      if (error) {
        setError('No se pudieron cargar los productos. Intenta nuevamente.')
        setLoading(false)
        return
      }

      setProductos(data || [])

      setLoading(false)
    }

    cargarProductos()
  }, [])

  const productosFiltrados = productos.filter(p => p.categoria === categoriaActiva)

  return (
    <main id="productos" style={styles.main}>
      <div style={styles.filtros}>
          {categorias.map(cat => (
            <button
              key={cat}
              style={{
                ...styles.filtroBtn,
                ...(categoriaActiva === cat ? styles.filtroBtnActive : {}),
              }}
              onClick={() => setCategoriaActiva(cat)}
            >
              {cat}
            </button>
          ))}
      </div>

      {loading && (
        <div style={styles.centered}>
          <div className="spinner" />
        </div>
      )}

      {error && (
        <div style={styles.error}>{error}</div>
      )}

      {!loading && !error && productosFiltrados.length === 0 && (
        <div style={styles.empty}>
          <p>No hay productos disponibles en este momento.</p>
        </div>
      )}

      {!loading && !error && (
        <div style={styles.grid}>
          {productosFiltrados.map((p, i) => (
            <RevealCard
              key={p.id}
              product={p}
              delay={(i % 4) + 1}
              onDetail={setSelectedProduct}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  )
}

const styles = {
  main: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '56px 24px 80px',
  },
  filtros: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 36,
  },
  filtroBtn: {
    padding: '8px 20px',
    border: '1px solid var(--color-border)',
    borderRadius: 20,
    background: 'transparent',
    color: 'var(--color-text-muted)',
    fontSize: 13,
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    letterSpacing: '0.04em',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filtroBtnActive: {
    background: 'var(--color-gold)',
    borderColor: 'var(--color-gold)',
    color: '#fff',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 28,
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    padding: '80px 0',
  },
  error: {
    textAlign: 'center',
    padding: '48px 0',
    color: 'var(--color-error)',
    fontSize: 14,
  },
  empty: {
    textAlign: 'center',
    padding: '48px 0',
    color: 'var(--color-text-muted)',
    fontSize: 14,
  },
  modalOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    background: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 560,
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
    animation: 'slideInUp 0.3s ease',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    background: 'rgba(0,0,0,0.06)',
    border: 'none',
    borderRadius: '50%',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-text)',
    zIndex: 2,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  modalImgWrap: {
    aspectRatio: '16/9',
    overflow: 'hidden',
    background: 'var(--color-bg-warm)',
    borderRadius: '12px 12px 0 0',
    position: 'relative',
  },
  modalImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.2s ease',
  },
  dots: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255,255,255,0.55)',
    cursor: 'pointer',
    padding: 0,
    transition: 'background 0.2s, transform 0.2s',
  },
  dotActive: {
    background: '#fff',
    transform: 'scale(1.25)',
  },
  modalImgPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  modalTop: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  modalCat: {
    fontSize: 11,
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--color-text-muted)',
  },
  modalNombre: {
    fontFamily: 'var(--font-serif)',
    fontWeight: 400,
    fontSize: 26,
    lineHeight: 1.2,
    color: 'var(--color-text)',
  },
  modalDesc: {
    fontSize: 14,
    color: 'var(--color-text-muted)',
    lineHeight: 1.7,
    fontWeight: 300,
  },
  modalFooter: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
    flexWrap: 'wrap',
    gap: 12,
  },
  modalPrecio: {
    fontSize: 24,
    fontWeight: 600,
    color: 'var(--color-gold)',
    fontFamily: 'var(--font-serif)',
  },
  modalAbono: {
    fontSize: 12,
    color: 'var(--color-text-muted)',
    marginTop: 2,
  },
}
