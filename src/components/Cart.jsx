import { useCart } from '../context/CartContext'

const fmt = (n) => new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'USD' }).format(n)

export default function Cart({ onCheckout }) {
  const {
    items, isOpen, setIsOpen,
    removeItem, updateCantidad, toggleAbonar,
    totalProductos, pagarAhora, saldoPendiente,
  } = useCart()

  if (!isOpen) return null

  return (
    <>
      <div
        style={styles.backdrop}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <aside style={styles.drawer} role="dialog" aria-label="Carrito de compras">
        <div style={styles.header}>
          <h2 style={styles.title}>Tu carrito</h2>
          <button
            style={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar carrito"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div style={styles.empty}>
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <div style={styles.items}>
              {items.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                  onUpdateCantidad={updateCantidad}
                  onToggleAbonar={toggleAbonar}
                />
              ))}
            </div>

            <div style={styles.summary}>
              <hr className="divider" />
              <div style={styles.summaryRow}>
                <span>Total productos</span>
                <span>{fmt(totalProductos)}</span>
              </div>
              <div style={{ ...styles.summaryRow, ...styles.summaryRowHighlight }}>
                <span>A pagar ahora</span>
                <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>{fmt(pagarAhora)}</span>
              </div>
              {saldoPendiente > 0 && (
                <div style={{ ...styles.summaryRow, fontSize: 13, color: 'var(--color-text-muted)' }}>
                  <span>Pendiente al entregar</span>
                  <span>{fmt(saldoPendiente)}</span>
                </div>
              )}
              <hr className="divider" />
              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 4 }}
                onClick={onCheckout}
              >
                Continuar
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

function CartItem({ item, onRemove, onUpdateCantidad, onToggleAbonar }) {
  return (
    <div style={itemStyles.wrap}>
      {item.foto_url && (
        <img src={item.foto_url} alt={item.nombre} style={itemStyles.img} />
      )}
      <div style={itemStyles.info}>
        <div style={itemStyles.top}>
          <p style={itemStyles.nombre}>{item.nombre}</p>
          <button
            style={itemStyles.removeBtn}
            onClick={() => onRemove(item.id)}
            aria-label="Eliminar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <p style={itemStyles.precio}>
          {new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'USD' }).format(item.precio)}
        </p>

        <label style={itemStyles.abonarLabel}>
          <input
            type="checkbox"
            checked={item.abonar}
            onChange={() => onToggleAbonar(item.id)}
            style={{ accentColor: 'var(--color-gold)', width: 14, height: 14 }}
          />
          <span>Abonar 50% ahora</span>
        </label>

        <div style={itemStyles.cantidadWrap}>
          <button
            style={itemStyles.cantBtn}
            onClick={() => onUpdateCantidad(item.id, item.cantidad - 1)}
            aria-label="Reducir"
          >−</button>
          <span style={itemStyles.cant}>{item.cantidad}</span>
          <button
            style={itemStyles.cantBtn}
            onClick={() => onUpdateCantidad(item.id, item.cantidad + 1)}
            aria-label="Aumentar"
          >+</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 98,
    animation: 'fadeIn 0.2s ease',
  },
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: 'min(420px, 100vw)',
    height: '100vh',
    background: '#fff',
    zIndex: 99,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-lg)',
    animation: 'slideIn 0.25s ease',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid var(--color-border-light)',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: 22,
    fontWeight: 400,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-muted)',
    padding: 4,
    display: 'flex',
    cursor: 'pointer',
  },
  items: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 0',
  },
  empty: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-text-muted)',
    fontSize: 14,
  },
  summary: {
    padding: '8px 24px 24px',
    borderTop: '1px solid var(--color-border-light)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 14,
    marginBottom: 8,
  },
  summaryRowHighlight: {
    fontSize: 16,
    fontWeight: 500,
  },
}

const itemStyles = {
  wrap: {
    display: 'flex',
    gap: 14,
    padding: '16px 24px',
    borderBottom: '1px solid var(--color-border-light)',
  },
  img: {
    width: 64,
    height: 64,
    objectFit: 'cover',
    borderRadius: 4,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  nombre: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.3,
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    padding: 2,
    flexShrink: 0,
  },
  precio: {
    fontSize: 14,
    color: 'var(--color-gold)',
    fontWeight: 600,
  },
  abonarLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    userSelect: 'none',
  },
  cantidadWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  cantBtn: {
    width: 26,
    height: 26,
    border: '1px solid var(--color-border)',
    borderRadius: 4,
    background: 'none',
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--color-text)',
  },
  cant: {
    fontSize: 14,
    fontWeight: 500,
    minWidth: 20,
    textAlign: 'center',
  },
}
