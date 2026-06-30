import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import ProductForm from './ProductForm'

const fmt = (n) => new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'USD' }).format(n ?? 0)

const ESTADOS_FLUJO = [
  { key: 'nuevo',              label: 'Nuevo',               bg: '#e8f4fd', color: '#2980b9' },
  { key: 'confirmado',         label: 'Confirmado',          bg: '#f0e8fd', color: '#7b2fb9' },
  { key: 'en preparación',     label: 'En preparación',      bg: '#fdf6e8', color: '#9B6B42' },
  { key: 'listo para entrega', label: 'Listo para entrega',  bg: '#fdeee8', color: '#c0442b' },
  { key: 'entregado',          label: 'Entregado',           bg: '#eef6f0', color: '#4a7c59' },
  { key: 'completado',         label: 'Completado',          bg: '#f0f0f0', color: '#888'    },
]

function estadoInfo(key) {
  return ESTADOS_FLUJO.find(e => e.key === key) || { label: key, bg: '#f5f5f5', color: '#888' }
}

export default function AdminPanel({ onClose }) {
  const [tab, setTab] = useState('pedidos')

  return (
    <div style={styles.wrap}>
      <div style={styles.topbar}>
        <span style={styles.topbarTitle}>Panel · BY VIIC</span>
        <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={onClose}>
          Salir del panel
        </button>
      </div>

      <div style={styles.tabs}>
        <TabBtn active={tab === 'pedidos'}   onClick={() => setTab('pedidos')}>Pedidos</TabBtn>
        <TabBtn active={tab === 'productos'} onClick={() => setTab('productos')}>Productos</TabBtn>
        <TabBtn active={tab === 'entregas'}  onClick={() => setTab('entregas')}>Horario de entregas</TabBtn>
      </div>

      <div style={styles.content}>
        {tab === 'pedidos'   && <PedidosTab />}
        {tab === 'productos' && <ProductosTab />}
        {tab === 'entregas'  && <EntregasTab />}
      </div>
    </div>
  )
}

function TabBtn({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{ ...styles.tab, ...(active ? styles.tabActive : {}) }}>
      {children}
    </button>
  )
}

/* ─── PESTAÑA PEDIDOS ──────────────────────────────────────── */
function PedidosTab() {
  const [pedidos, setPedidos]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [expandido, setExpandido] = useState(null)
  const [filtro, setFiltro]     = useState('todos')
  const [notaEdit, setNotaEdit] = useState({})

  async function cargar() {
    setLoading(true)
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('creado_en', { ascending: false })
    if (error) console.error('Error cargando pedidos:', error)
    setPedidos(data || [])
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  async function cambiarEstado(id, estado) {
    await supabase.from('pedidos').update({ estado }).eq('id', id)
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado } : p))
  }

  async function marcarSaldoPagado(id) {
    await supabase.from('pedidos').update({ saldo_pendiente: 0, estado: 'completado' }).eq('id', id)
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, saldo_pendiente: 0, estado: 'completado' } : p))
  }

  async function guardarNota(id) {
    const notas = notaEdit[id] ?? ''
    await supabase.from('pedidos').update({ notas }).eq('id', id)
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, notas } : p))
  }

  async function eliminarPedido(id) {
    if (!confirm('¿Eliminar este pedido? Esta acción no se puede deshacer.')) return
    await supabase.from('pedidos').delete().eq('id', id)
    setPedidos(prev => prev.filter(p => p.id !== id))
    setExpandido(null)
  }

  async function eliminarTodos() {
    if (!confirm('¿Eliminar TODOS los pedidos? Esta acción no se puede deshacer.')) return
    await supabase.from('pedidos').delete().neq('id', 0)
    setPedidos([])
    setExpandido(null)
  }

  const pedidosFiltrados = filtro === 'todos'
    ? pedidos
    : pedidos.filter(p => p.estado === filtro)

  const stats = {
    nuevos:          pedidos.filter(p => p.estado === 'nuevo').length,
    pendienteCobrar: pedidos.reduce((s, p) => s + (p.saldo_pendiente || 0), 0),
    listos:          pedidos.filter(p => p.estado === 'listo para entrega').length,
  }

  const FILTROS = [
    { key: 'todos', label: 'Todos' },
    { key: 'nuevo', label: 'Nuevos' },
    { key: 'confirmado', label: 'Confirmados' },
    { key: 'en preparación', label: 'En preparación' },
    { key: 'listo para entrega', label: 'Listos' },
    { key: 'entregado', label: 'Entregados' },
    { key: 'completado', label: 'Completados' },
  ]

  return (
    <div>
      {/* Stats */}
      <div style={styles.statsRow}>
        <StatCard label="Pedidos nuevos" value={stats.nuevos} accent="#2980b9" />
        <StatCard label="Por cobrar" value={fmt(stats.pendienteCobrar)} accent="#9B6B42" />
        <StatCard label="Listos para entregar" value={stats.listos} accent="#4a7c59" />
      </div>

      {/* Filtros */}
      <div style={styles.filtrosRow}>
        {FILTROS.map(f => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            style={{
              ...styles.filtroBtn,
              ...(filtro === f.key ? styles.filtroBtnActive : {}),
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          {filtro === 'todos' ? `Todos los pedidos (${pedidos.length})` : `${pedidosFiltrados.length} pedido${pedidosFiltrados.length !== 1 ? 's' : ''}`}
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={cargar}>Actualizar</button>
          {pedidos.length > 0 && (
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12, color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
              onClick={eliminarTodos}
            >
              Eliminar todos
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={styles.centered}><div className="spinner" /></div>
      ) : pedidosFiltrados.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', padding: '40px 0', textAlign: 'center' }}>
          No hay pedidos en este estado.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pedidosFiltrados.map(p => {
            const info = estadoInfo(p.estado)
            const abierto = expandido === p.id
            return (
              <div key={p.id} style={styles.pedidoCard}>
                {/* Header */}
                <div style={styles.pedidoHeader} onClick={() => setExpandido(abierto ? null : p.id)}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 15 }}>{p.cliente_nombre}</p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                      {p.cliente_tel} · {new Date(p.creado_en).toLocaleDateString('es-PA', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', marginRight: 8 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-gold)' }}>{fmt(p.total)}</p>
                    {p.saldo_pendiente > 0 && (
                      <p style={{ fontSize: 11, color: '#c0442b' }}>Pendiente: {fmt(p.saldo_pendiente)}</p>
                    )}
                    {!p.saldo_pendiente && (
                      <p style={{ fontSize: 11, color: '#4a7c59' }}>Pago completo</p>
                    )}
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: info.bg, color: info.color, whiteSpace: 'nowrap' }}>
                    {info.label}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" style={{ marginLeft: 8, transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>

                {/* Detalle expandido */}
                {abierto && (
                  <div style={styles.pedidoBody}>
                    <hr className="divider" />

                    {/* Productos del pedido */}
                    <p style={styles.subLabel}>Productos</p>
                    <div style={styles.itemsList}>
                      {(p.items || []).map((item, i) => (
                        <div key={i} style={styles.itemRow}>
                          <span>{item.nombre} × {item.cantidad}{item.por_encargo ? ' (por encargo)' : ''}</span>
                          <span>{fmt(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Resumen de pago */}
                    <div style={styles.resumenPago}>
                      <span style={styles.resumenItem}>
                        Abono recibido: <strong>{fmt(p.pagado_ahora)}</strong>
                      </span>
                      {p.saldo_pendiente > 0 && (
                        <span style={{ ...styles.resumenItem, color: '#c0442b' }}>
                          Saldo pendiente: <strong>{fmt(p.saldo_pendiente)}</strong>
                        </span>
                      )}
                    </div>

                    <hr className="divider" />

                    {/* Flujo de estado */}
                    <p style={styles.subLabel}>Estado del pedido</p>
                    <div style={styles.estadoFlujo}>
                      {ESTADOS_FLUJO.map((e, i) => (
                        <button
                          key={e.key}
                          onClick={() => cambiarEstado(p.id, e.key)}
                          style={{
                            ...styles.estadoStep,
                            background: p.estado === e.key ? e.bg : 'transparent',
                            color: p.estado === e.key ? e.color : 'var(--color-text-muted)',
                            border: `1.5px solid ${p.estado === e.key ? e.color : 'var(--color-border)'}`,
                            fontWeight: p.estado === e.key ? 700 : 400,
                          }}
                        >
                          {i + 1}. {e.label}
                        </button>
                      ))}
                    </div>

                    {/* Acciones de pago */}
                    {p.saldo_pendiente > 0 && (
                      <button
                        className="btn btn-outline"
                        style={{ fontSize: 12, marginTop: 8, alignSelf: 'flex-start' }}
                        onClick={() => marcarSaldoPagado(p.id)}
                      >
                        Marcar saldo pagado ({fmt(p.saldo_pendiente)})
                      </button>
                    )}

                    <hr className="divider" />

                    {/* Notas */}
                    <p style={styles.subLabel}>Notas internas</p>
                    <textarea
                      className="input"
                      placeholder="Ej: cliente confirmó entrega el domingo 29, apartamento 4B..."
                      value={notaEdit[p.id] ?? p.notas ?? ''}
                      onChange={e => setNotaEdit(prev => ({ ...prev, [p.id]: e.target.value }))}
                      style={{ fontSize: 13, minHeight: 64 }}
                    />
                    {notaEdit[p.id] !== undefined && notaEdit[p.id] !== (p.notas ?? '') && (
                      <button
                        className="btn btn-primary"
                        style={{ fontSize: 12, alignSelf: 'flex-start', marginTop: 4 }}
                        onClick={() => guardarNota(p.id)}
                      >
                        Guardar nota
                      </button>
                    )}

                    <hr className="divider" />
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: 12, color: 'var(--color-error)', borderColor: 'var(--color-error)', alignSelf: 'flex-start' }}
                      onClick={() => eliminarPedido(p.id)}
                    >
                      Eliminar pedido
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{ ...styles.statCard, borderTop: `3px solid ${accent}` }}>
      <p style={{ fontSize: 22, fontWeight: 700, color: accent, fontFamily: 'var(--font-serif)' }}>{value}</p>
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{label}</p>
    </div>
  )
}

/* ─── PESTAÑA PRODUCTOS ────────────────────────────────────── */
function ProductosTab() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading]     = useState(true)
  const [formProducto, setFormProducto] = useState(null)
  const [showForm, setShowForm]   = useState(false)

  async function cargar() {
    setLoading(true)
    const { data } = await supabase.from('productos').select('*').order('nombre')
    setProductos(data || [])
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  async function handleSave(payload) {
    let error
    if (formProducto?.id) {
      ({ error } = await supabase.from('productos').update(payload).eq('id', formProducto.id))
    } else {
      ({ error } = await supabase.from('productos').insert(payload))
    }
    if (!error) { await cargar(); setShowForm(false); setFormProducto(null) }
    return error
  }

  async function toggleActivo(p) {
    await supabase.from('productos').update({ activo: !p.activo }).eq('id', p.id)
    cargar()
  }

  async function toggleAgotado(p) {
    await supabase.from('productos').update({ agotado: !p.agotado }).eq('id', p.id)
    cargar()
  }

  async function eliminar(id) {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    await supabase.from('productos').delete().eq('id', id)
    cargar()
  }

  return (
    <div>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Productos ({productos.length})</h2>
        <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => { setFormProducto(null); setShowForm(true) }}>
          + Nuevo producto
        </button>
      </div>

      {loading ? (
        <div style={styles.centered}><div className="spinner" /></div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Precio</th>
                <th style={styles.th}>Categoría</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {p.foto_url && <img src={p.foto_url} alt="" style={styles.miniImg} />}
                      <div>
                        <p style={{ fontWeight: 500, fontSize: 14 }}>{p.nombre}</p>
                        {p.por_encargo && <span style={{ fontSize: 11, color: 'var(--color-gold-dark)' }}>Por encargo</span>}
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>{fmt(p.precio)}</td>
                  <td style={styles.td}>{p.categoria || '—'}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span className={p.activo ? 'badge badge-available' : 'badge'} style={!p.activo ? { background: '#f5f5f5', color: '#999', border: '1px solid #e0e0e0' } : {}}>
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </span>
                      {p.agotado && (
                        <span className="badge" style={{ background: '#fff0f0', color: '#c0392b', border: '1px solid #f0c0b8' }}>Agotado</span>
                      )}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button className="btn btn-ghost" style={styles.actionBtn} onClick={() => { setFormProducto(p); setShowForm(true) }}>Editar</button>
                      <button
                        className="btn btn-ghost"
                        style={{ ...styles.actionBtn, ...(p.agotado ? { background: '#fff0f0', color: '#c0392b', borderColor: '#e0a09a' } : {}) }}
                        onClick={() => toggleAgotado(p)}
                      >
                        {p.agotado ? 'Reponer' : 'Agotado'}
                      </button>
                      <button className="btn btn-ghost" style={styles.actionBtn} onClick={() => toggleActivo(p)}>{p.activo ? 'Desactivar' : 'Activar'}</button>
                      <button className="btn btn-ghost" style={{ ...styles.actionBtn, color: 'var(--color-error)', borderColor: 'var(--color-error)' }} onClick={() => eliminar(p.id)}>Borrar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductForm
          producto={formProducto}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setFormProducto(null) }}
        />
      )}
    </div>
  )
}

/* ─── PESTAÑA ENTREGAS ─────────────────────────────────────── */
function EntregasTab() {
  return (
    <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 48 }}>
      <ConfigField
        clave="horario_entrega"
        titulo="Banner de la tienda"
        descripcion="Texto breve que aparece en la barra dorada superior de la tienda. Cámbialo si el horario cambia un día específico."
        placeholder="Ej: Entregas de lunes a viernes · Ver horarios completos"
        minHeight={60}
      />
      <ConfigField
        clave="horario_detalle"
        titulo="Horario detallado (sección desplegable)"
        descripcion="Texto completo con días, horarios, costos e instrucciones. Aparece en la sección desplegable de la tienda que los clientes pueden abrir. Puedes usar emojis y saltos de línea."
        placeholder={"DÍAS DE ENTREGA\n📍LUNES — S.M 4:30\n📍MARTES — 24 DE DIC 1:30\n..."}
        minHeight={280}
      />
      <ConfigField
        clave="horario_tienda"
        titulo="Horario de retiro en tienda"
        descripcion="Días y horas en que los clientes pueden retirar su pedido en la tienda. Se muestra en el checkout cuando el cliente elige retirar en tienda."
        placeholder={"Ej:\nLunes a viernes: 9am – 6pm\nSábados: 9am – 2pm"}
        minHeight={120}
      />
      <ConfigField
        clave="horario_metro"
        titulo="Horario de entregas en estación de metro"
        descripcion="Días, estaciones y horarios para entregas en el metro. Se muestra en el checkout cuando el cliente elige entrega en estación de metro."
        placeholder={"DÍAS DE ENTREGA\n📍LUNES — Estación 4:30\n📍MARTES — Estación 1:30\n\nIMPORTANTE\nSean puntuales..."}
        minHeight={280}
      />
    </div>
  )
}

function ConfigField({ clave, titulo, descripcion, placeholder, minHeight = 80 }) {
  const [valor, setValor]     = useState('')
  const [original, setOriginal] = useState('')
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [ok, setOk]           = useState(false)

  useEffect(() => {
    supabase
      .from('configuracion')
      .select('valor')
      .eq('clave', clave)
      .single()
      .then(({ data }) => {
        const v = data?.valor || ''
        setValor(v)
        setOriginal(v)
        setLoading(false)
      })
  }, [clave])

  async function guardar() {
    setGuardando(true)
    await supabase
      .from('configuracion')
      .upsert({ clave, valor, actualizado_en: new Date().toISOString() })
    setOriginal(valor)
    setGuardando(false)
    setOk(true)
    setTimeout(() => setOk(false), 3000)
  }

  return (
    <div style={{ background: '#fff', borderRadius: 10, border: '1px solid var(--color-border-light)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, marginBottom: 8 }}>{titulo}</h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 18, lineHeight: 1.7 }}>{descripcion}</p>
      {loading ? (
        <div className="spinner" style={{ margin: '12px 0' }} />
      ) : (
        <textarea
          className="input"
          value={valor}
          onChange={e => setValor(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight, fontSize: 14, lineHeight: 1.8 }}
        />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
        <button
          className="btn btn-primary"
          style={{ fontSize: 13 }}
          onClick={guardar}
          disabled={guardando || valor === original || !valor.trim()}
        >
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
        {ok && <span style={{ color: '#4a7c59', fontSize: 13, fontWeight: 500 }}>Guardado — visible en la tienda</span>}
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    minHeight: '100vh',
    background: 'var(--color-bg-warm)',
  },
  topbar: {
    background: '#fff',
    borderBottom: '1px solid var(--color-border-light)',
    padding: '0 24px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    boxShadow: 'var(--shadow-sm)',
  },
  topbarTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: 20,
    fontWeight: 400,
    fontStyle: 'italic',
    color: '#A07040',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid var(--color-border-light)',
    background: '#fff',
    padding: '0 24px',
    gap: 4,
  },
  tab: {
    padding: '14px 20px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    fontSize: 14,
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: -1,
    whiteSpace: 'nowrap',
  },
  tabActive: {
    color: 'var(--color-gold)',
    borderBottomColor: 'var(--color-gold)',
  },
  content: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '32px 24px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: 22,
    fontWeight: 400,
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    background: '#fff',
    borderRadius: 8,
    padding: '16px 20px',
    border: '1px solid var(--color-border-light)',
    boxShadow: 'var(--shadow-sm)',
  },
  filtrosRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  filtroBtn: {
    padding: '6px 14px',
    borderRadius: 20,
    border: '1.5px solid var(--color-border)',
    background: '#fff',
    fontSize: 12,
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  filtroBtnActive: {
    background: 'var(--color-gold)',
    color: '#fff',
    borderColor: 'var(--color-gold)',
  },
  tableWrap: {
    overflowX: 'auto',
    background: '#fff',
    borderRadius: 8,
    border: '1px solid var(--color-border-light)',
    boxShadow: 'var(--shadow-sm)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--color-text-muted)',
    borderBottom: '1px solid var(--color-border-light)',
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid var(--color-border-light)',
  },
  td: {
    padding: '12px 16px',
    verticalAlign: 'middle',
  },
  miniImg: {
    width: 40,
    height: 40,
    objectFit: 'cover',
    borderRadius: 4,
    flexShrink: 0,
  },
  actionBtn: {
    padding: '5px 10px',
    fontSize: 11,
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px 0',
  },
  pedidoCard: {
    background: '#fff',
    borderRadius: 8,
    border: '1px solid var(--color-border-light)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
  },
  pedidoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 20px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  pedidoBody: {
    padding: '0 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--color-text-muted)',
    marginBottom: 4,
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    color: 'var(--color-text-muted)',
  },
  resumenPago: {
    display: 'flex',
    gap: 20,
    fontSize: 13,
    flexWrap: 'wrap',
  },
  resumenItem: {
    color: 'var(--color-text)',
  },
  estadoFlujo: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  estadoStep: {
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 12,
    fontFamily: 'var(--font-sans)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
}
