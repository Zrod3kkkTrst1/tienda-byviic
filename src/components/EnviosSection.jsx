import { useState } from 'react'
import { WHATSAPP_NUMERO, NOMBRE_TIENDA } from '../lib/constants'

const CARRIERS = [
  { key: 'ferguson',   label: 'Ferguson',    desc: 'Envíos a todo Panamá' },
  { key: 'unoexpress', label: 'Uno Express', desc: 'Entregas rápidas a provincias' },
]

const PROVINCIAS = [
  'Bocas del Toro', 'Chiriquí', 'Coclé', 'Colón', 'Darién',
  'Herrera', 'Los Santos', 'Panamá Oeste', 'Veraguas', 'Ngäbe-Buglé', 'Otra',
]

export default function EnviosSection() {
  const [carrier, setCarrier] = useState('ferguson')
  const [form, setForm] = useState({ nombre: '', apellido: '', cedula: '', telefono: '', destino: '' })
  const [enviado, setEnviado] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const valido = form.nombre.trim() && form.apellido.trim() && form.cedula.trim() &&
    form.telefono.trim().length > 6 && form.destino.trim()

  function handleEnviar() {
    const empresa = CARRIERS.find(c => c.key === carrier)?.label || carrier
    const mensaje = [
      `Hola! Quisiera solicitar un *envío por ${empresa}* desde *${NOMBRE_TIENDA}*:`,
      '',
      `👤 *Nombre:* ${form.nombre.trim()} ${form.apellido.trim()}`,
      `🪪 *Cédula:* ${form.cedula.trim()}`,
      `📱 *Teléfono:* ${form.telefono.trim()}`,
      `📍 *Destino:* ${form.destino.trim()}`,
      `🚚 *Empresa:* ${empresa}`,
    ].join('\n')

    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`, '_blank', 'noopener')
    setEnviado(true)
    setTimeout(() => setEnviado(false), 5000)
  }

  return (
    <section id="envios" style={styles.section}>
      <div style={styles.inner}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.label}>ENVÍOS A PROVINCIAS</span>
          <h2 style={styles.title}>¿Estás fuera de nuestra zona de entrega?</h2>
          <p style={styles.subtitle}>
            Te enviamos tu pedido a través de Ferguson o Uno Express a cualquier parte de Panamá.
          </p>
        </div>

        {/* Selector de empresa */}
        <div style={styles.carrierRow}>
          {CARRIERS.map(c => (
            <button
              key={c.key}
              onClick={() => setCarrier(c.key)}
              style={{ ...styles.carrierBtn, ...(carrier === c.key ? styles.carrierBtnActive : {}) }}
            >
              <span style={styles.carrierName}>{c.label}</span>
              <span style={styles.carrierDesc}>{c.desc}</span>
            </button>
          ))}
        </div>

        {/* Formulario */}
        <div style={styles.form}>
          <div style={styles.row2}>
            <Field label="Nombre" value={form.nombre} onChange={v => set('nombre', v)} placeholder="Tu nombre" />
            <Field label="Apellido" value={form.apellido} onChange={v => set('apellido', v)} placeholder="Tu apellido" />
          </div>
          <div style={styles.row2}>
            <Field label="Cédula" value={form.cedula} onChange={v => set('cedula', v)} placeholder="0-000-000" />
            <Field label="Teléfono / WhatsApp" value={form.telefono} onChange={v => set('telefono', v)} placeholder="6000-0000" type="tel" />
          </div>
          <div>
            <label style={styles.fieldLabel}>Destino (provincia / ciudad)</label>
            <select
              className="input"
              value={form.destino}
              onChange={e => set('destino', e.target.value)}
              style={{ marginTop: 6 }}
            >
              <option value="">Selecciona tu provincia...</option>
              {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div style={styles.note}>
            El costo exacto del envío lo coordinamos por WhatsApp según el peso y destino.
          </div>

          <button
            className="btn btn-primary"
            style={styles.submitBtn}
            disabled={!valido}
            onClick={handleEnviar}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
            </svg>
            Solicitar envío por WhatsApp
          </button>

          {enviado && (
            <p style={styles.successMsg}>
              ¡Mensaje enviado! Pronto te respondemos para coordinar tu envío.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label style={styles.fieldLabel}>{label}</label>
      <input
        className="input"
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ marginTop: 6 }}
      />
    </div>
  )
}

const styles = {
  section: {
    padding: '80px 24px',
    background: 'var(--color-bg-warm)',
  },
  inner: {
    maxWidth: 720,
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: 40,
  },
  label: {
    fontSize: 11,
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    letterSpacing: '0.18em',
    color: 'var(--color-gold)',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontWeight: 300,
    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
    color: 'var(--color-text)',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: 'var(--color-text-muted)',
    lineHeight: 1.7,
  },
  carrierRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 32,
  },
  carrierBtn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: '16px 20px',
    borderRadius: 8,
    border: '1.5px solid var(--color-border)',
    background: '#fff',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
  },
  carrierBtnActive: {
    border: '1.5px solid var(--color-gold)',
    background: 'linear-gradient(135deg, #faf3eb, #fff)',
    boxShadow: '0 2px 12px rgba(160,112,64,0.12)',
  },
  carrierName: {
    fontFamily: 'var(--font-sans)',
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--color-text)',
  },
  carrierDesc: {
    fontSize: 12,
    color: 'var(--color-text-muted)',
  },
  form: {
    background: '#fff',
    borderRadius: 10,
    border: '1px solid var(--color-border-light)',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    boxShadow: 'var(--shadow-sm)',
  },
  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
  },
  fieldLabel: {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--color-text-muted)',
  },
  note: {
    fontSize: 12,
    color: 'var(--color-text-muted)',
    background: 'var(--color-bg-warm)',
    padding: '10px 14px',
    borderRadius: 6,
    borderLeft: '3px solid var(--color-gold-light)',
    lineHeight: 1.6,
  },
  submitBtn: {
    gap: 10,
  },
  successMsg: {
    textAlign: 'center',
    color: '#4a7c59',
    fontSize: 13,
    fontWeight: 500,
  },
}
