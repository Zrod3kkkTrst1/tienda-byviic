import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import { WHATSAPP_NUMERO, NOMBRE_TIENDA } from '../lib/constants'

const fmt = (n) => new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'USD' }).format(n)

const METODOS_ENTREGA = [
  { key: 'retiro',     label: 'Retiro en Tienda',   desc: 'Según el horario de entregas' },
  { key: 'ferguson',   label: 'Ferguson',           desc: 'Envío a provincias' },
  { key: 'unoexpress', label: 'Uno Express',        desc: 'Envío a provincias' },
]

const PROVINCIAS = [
  'Panamá','Panamá Oeste','Chiriquí','Coclé','Colón',
  'Herrera','Los Santos','Veraguas','Bocas del Toro','Darién','Ngäbe-Buglé',
]

export default function Checkout({ onClose }) {
  const { items, totalProductos, pagarAhora, saldoPendiente, clearCart } = useCart()

  const [nombre,        setNombre]        = useState('')
  const [telefono,      setTelefono]      = useState('')
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [cedula,        setCedula]        = useState('')
  const [telefonoEnvio, setTelefonoEnvio] = useState('')
  const [provincia,     setProvincia]     = useState('')
  const [sucursal,      setSucursal]      = useState('')
  const [metodoEntrega, setMetodoEntrega] = useState('retiro')

  const [diaRetiro,      setDiaRetiro]      = useState('')
  const [horarioTienda,  setHorarioTienda]  = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    supabase
      .from('configuracion')
      .select('valor')
      .eq('clave', 'horario_tienda')
      .single()
      .then(({ data }) => { if (data?.valor) setHorarioTienda(data.valor) })
  }, [])

  const esEnvio = metodoEntrega !== 'retiro'

  function cambiarCarrier(key) {
    setMetodoEntrega(key)
    setProvincia('')
    setSucursal('')
    setDiaRetiro('')
  }

  function cambiarProvincia(p) {
    setProvincia(p)
    setSucursal('')
  }


  const esValido =
    nombre.trim().length > 1 &&
    telefono.trim().length > 6 &&
    (!esEnvio || (nombreCompleto.trim() && cedula.trim() && telefonoEnvio.trim().length > 6 && provincia && sucursal))

  async function guardarPedido() {
    const hayAbonos = items.some(i => i.abonar)
    const estado = hayAbonos ? 'abonado' : 'nuevo'
    const empresa = METODOS_ENTREGA.find(m => m.key === metodoEntrega)?.label || metodoEntrega

    const notasEnvio = esEnvio
      ? `Envío por ${empresa} — Nombre: ${nombreCompleto.trim()} | Cédula: ${cedula.trim()} | Tel: ${telefonoEnvio.trim()} | Sucursal: ${sucursal}, ${provincia}`
      : `Retiro en tienda${diaRetiro.trim() ? ` — Día: ${diaRetiro.trim()}` : ''}`

    const { error } = await supabase.from('pedidos').insert({
      cliente_nombre: nombre.trim(),
      cliente_tel: telefono.trim(),
      items: items.map(i => ({
        id: i.id, nombre: i.nombre, precio: i.precio,
        cantidad: i.cantidad, por_encargo: i.por_encargo,
        abonar: i.abonar, subtotal: i.precio * i.cantidad,
      })),
      total: totalProductos,
      pagado_ahora: pagarAhora,
      saldo_pendiente: saldoPendiente,
      metodo_pago: 'whatsapp',
      estado,
      notas: notasEnvio,
    })

    return error
  }

  function armarMensajeWA() {
    const empresa = METODOS_ENTREGA.find(m => m.key === metodoEntrega)?.label || metodoEntrega
    const lineas = items.map(i => {
      const sub  = fmt(i.precio * i.cantidad)
      const pago = i.abonar
        ? `(abona ${fmt((i.precio * i.cantidad) / 2)})`
        : '(pago completo)'
      return `• ${i.nombre} x${i.cantidad} — ${sub} ${pago}`
    })

    const entregaInfo = esEnvio
      ? [
          ``,
          `🚚 *Envío por ${empresa}*`,
          `👤 Nombre completo: ${nombreCompleto.trim()}`,
          `🪪 Cédula: ${cedula.trim()}`,
          `📱 Teléfono: ${telefonoEnvio.trim()}`,
          `📍 Sucursal: ${sucursal} — ${provincia}`,
        ]
      : [``, `📍 *Retiro en tienda*`, ...(diaRetiro.trim() ? [`📅 Día de retiro: ${diaRetiro.trim()}`] : []), `📱 Tel: ${telefono.trim()}`]

    return [
      `¡Hola! Soy ${nombre.trim()} y quisiera hacer este pedido en *${NOMBRE_TIENDA}*:`,
      '',
      ...lineas,
      '',
      `*Total:* ${fmt(totalProductos)}`,
      `*Pago ahora:* ${fmt(pagarAhora)}`,
      saldoPendiente > 0 ? `*Pendiente al entregar:* ${fmt(saldoPendiente)}` : '',
      ...entregaInfo,
    ].filter(l => l !== null).join('\n')
  }

  async function handleWhatsApp() {
    if (!esValido || loading) return
    setLoading(true)
    setError(null)

    const err = await guardarPedido()
    if (err) {
      setError('Hubo un problema al guardar tu pedido. Intenta de nuevo.')
      setLoading(false)
      return
    }

    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(armarMensajeWA())}`
    window.open(url, '_blank', 'noopener')
    clearCart()
    onClose()
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal} role="dialog" aria-label="Finalizar pedido">

        <div style={styles.header}>
          <h2 style={styles.title}>Finalizar pedido</h2>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={styles.body}>
          {/* Resumen */}
          <div style={styles.resumen}>
            <div style={styles.resumenRow}>
              <span>Total</span>
              <span style={{ fontWeight: 600 }}>{fmt(totalProductos)}</span>
            </div>
            <div style={{ ...styles.resumenRow, color: 'var(--color-gold)' }}>
              <span>A pagar ahora</span>
              <span style={{ fontWeight: 700 }}>{fmt(pagarAhora)}</span>
            </div>
            {saldoPendiente > 0 && (
              <div style={{ ...styles.resumenRow, fontSize: 13, color: 'var(--color-text-muted)' }}>
                <span>Pendiente al entregar</span>
                <span>{fmt(saldoPendiente)}</span>
              </div>
            )}
          </div>

          <hr className="divider" />

          {/* Datos del cliente */}
          <div style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Nombre</label>
              <input className="input" type="text" placeholder="Tu nombre" value={nombre} onChange={e => setNombre(e.target.value)} autoComplete="given-name" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>WhatsApp / Teléfono</label>
              <input className="input" type="tel" placeholder="6000-0000" value={telefono} onChange={e => setTelefono(e.target.value)} autoComplete="tel" />
            </div>
          </div>

          <hr className="divider" />

          {/* Método de entrega */}
          <div>
            <p style={styles.label}>¿Cómo quieres recibir tu pedido?</p>
            <div style={styles.metodoRow}>
              {METODOS_ENTREGA.map(m => (
                <button
                  key={m.key}
                  onClick={() => cambiarCarrier(m.key)}
                  style={{ ...styles.metodoBtn, ...(metodoEntrega === m.key ? styles.metodoBtnActive : {}) }}
                >
                  <span style={styles.metodoLabel}>{m.label}</span>
                  <span style={styles.metodoDesc}>{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Día de retiro */}
          {!esEnvio && (
            <div style={styles.form}>
              {horarioTienda && (
                <div style={styles.horarioBox}>
                  <p style={styles.horarioTitle}>Horario de la tienda</p>
                  <p style={styles.horarioTexto}>{horarioTienda}</p>
                </div>
              )}
              <div style={styles.field}>
                <label style={styles.label}>¿Qué día vas a retirar?</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Ej: Lunes 30, martes en la tarde..."
                  value={diaRetiro}
                  onChange={e => setDiaRetiro(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Campos extra si es envío */}
          {esEnvio && (
            <div style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Nombre completo</label>
                <input className="input" type="text" placeholder="Nombre y apellido completo" value={nombreCompleto} onChange={e => setNombreCompleto(e.target.value)} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Cédula</label>
                <input className="input" type="text" placeholder="0-000-000" value={cedula} onChange={e => setCedula(e.target.value)} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Teléfono</label>
                <input className="input" type="tel" placeholder="6000-0000" value={telefonoEnvio} onChange={e => setTelefonoEnvio(e.target.value)} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Provincia</label>
                <select className="input" value={provincia} onChange={e => cambiarProvincia(e.target.value)}>
                  <option value="">Selecciona tu provincia...</option>
                  {PROVINCIAS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {provincia && (
                <div style={styles.field}>
                  <label style={styles.label}>
                    ¿Cuál {metodoEntrega === 'ferguson' ? 'Ferguson' : 'Uno Express'} te queda más cerca?
                  </label>
                  <input
                    className="input"
                    type="text"
                    placeholder={`Ej: ${metodoEntrega === 'ferguson' ? 'Ferguson Via España' : 'Uno Express El Dorado'}`}
                    value={sucursal}
                    onChange={e => setSucursal(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {error && <p style={styles.error}>{error}</p>}

          {/* Botón WhatsApp */}
          <button
            className="btn btn-primary"
            style={{ width: '100%', gap: 8 }}
            onClick={handleWhatsApp}
            disabled={!esValido || loading}
          >
            {loading ? (
              <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                </svg>
                Pedir por WhatsApp
              </>
            )}
          </button>

          <div style={styles.yappyWrap}>
            <button className="btn btn-ghost" style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }} disabled title="Próximamente">
              Pagar con Yappy — Próximamente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  modal: {
    background: '#fff',
    borderRadius: 8,
    width: '100%',
    maxWidth: 480,
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: 'var(--shadow-lg)',
    animation: 'slideInUp 0.25s ease',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid var(--color-border-light)',
    position: 'sticky',
    top: 0,
    background: '#fff',
    zIndex: 1,
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: 22,
    fontWeight: 400,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-muted)',
    display: 'flex',
  },
  body: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  resumen: {
    background: 'var(--color-bg-warm)',
    borderRadius: 6,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  resumenRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 15,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--color-text-muted)',
    letterSpacing: '0.04em',
  },
  metodoRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginTop: 10,
  },
  metodoBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderRadius: 8,
    border: '1.5px solid var(--color-border)',
    background: '#fff',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s',
  },
  metodoBtnActive: {
    border: '1.5px solid var(--color-gold)',
    background: 'linear-gradient(90deg, #faf3eb, #fff)',
  },
  metodoLabel: {
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--color-text)',
  },
  metodoDesc: {
    fontSize: 12,
    color: 'var(--color-text-muted)',
  },
  horarioBox: {
    background: 'var(--color-bg-warm)',
    borderRadius: 8,
    padding: '14px 16px',
    border: '1px solid rgba(160,112,64,0.18)',
  },
  horarioTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--color-gold)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  horarioTexto: {
    fontSize: 13,
    color: 'var(--color-text-muted)',
    lineHeight: 1.7,
    whiteSpace: 'pre-line',
  },
  yappyWrap: {
    marginTop: -4,
  },
  error: {
    color: 'var(--color-error)',
    fontSize: 13,
    textAlign: 'center',
  },
}
