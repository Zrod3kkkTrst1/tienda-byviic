import { useState, useEffect } from 'react'

const CAMPOS_INICIALES = {
  nombre: '', descripcion: '', precio: '', foto_url: '',
  categoria: '', por_encargo: false, stock: '', activo: true,
}

export default function ProductForm({ producto, onSave, onClose }) {
  const [form, setForm] = useState(CAMPOS_INICIALES)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio?.toString() || '',
        foto_url: producto.foto_url || '',
        categoria: producto.categoria || '',
        por_encargo: producto.por_encargo || false,
        stock: producto.stock?.toString() || '',
        activo: producto.activo !== false,
      })
    }
  }, [producto])

  function set(field, val) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.precio) {
      setError('Nombre y precio son obligatorios.')
      return
    }
    setSaving(true)
    setError(null)
    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: parseFloat(form.precio),
      foto_url: form.foto_url.trim(),
      categoria: form.categoria.trim(),
      por_encargo: form.por_encargo,
      stock: form.stock !== '' ? parseInt(form.stock) : null,
      activo: form.activo,
    }
    const err = await onSave(payload)
    setSaving(false)
    if (err) setError('Error al guardar. Intenta de nuevo.')
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>{producto ? 'Editar producto' : 'Nuevo producto'}</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <Field label="Nombre *">
            <input className="input" value={form.nombre} onChange={e => set('nombre', e.target.value)} required />
          </Field>
          <Field label="Descripción">
            <textarea className="input" value={form.descripcion} onChange={e => set('descripcion', e.target.value)} rows={3} />
          </Field>
          <div style={styles.row}>
            <Field label="Precio (USD) *">
              <input className="input" type="number" min="0" step="0.01" value={form.precio} onChange={e => set('precio', e.target.value)} required />
            </Field>
            <Field label="Stock">
              <input className="input" type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="Sin límite" />
            </Field>
          </div>
          <Field label="Categoría">
            <input className="input" value={form.categoria} onChange={e => set('categoria', e.target.value)} placeholder="Ej: Maquillaje, Skincare" />
          </Field>
          <Field label="URL de foto">
            <input className="input" type="text" value={form.foto_url} onChange={e => set('foto_url', e.target.value)} placeholder="https://..." />
          </Field>
          {form.foto_url && (
            <img src={form.foto_url} alt="Vista previa" style={styles.preview} onError={e => e.target.style.display='none'} />
          )}
          <div style={styles.checkboxRow}>
            <label style={styles.checkLabel}>
              <input type="checkbox" checked={form.por_encargo} onChange={e => set('por_encargo', e.target.checked)} style={{ accentColor: 'var(--color-gold)' }} />
              Por encargo (permite abono del 50%)
            </label>
            <label style={styles.checkLabel}>
              <input type="checkbox" checked={form.activo} onChange={e => set('activo', e.target.checked)} style={{ accentColor: 'var(--color-gold)' }} />
              Activo (visible en la tienda)
            </label>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.buttons}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const styles = {
  modal: {
    background: '#fff',
    borderRadius: 8,
    width: '100%',
    maxWidth: 520,
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
  form: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  preview: {
    width: '100%',
    maxHeight: 160,
    objectFit: 'cover',
    borderRadius: 4,
    border: '1px solid var(--color-border-light)',
  },
  checkboxRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    cursor: 'pointer',
    userSelect: 'none',
  },
  buttons: {
    display: 'flex',
    gap: 10,
    justifyContent: 'flex-end',
    paddingTop: 8,
  },
  error: {
    color: 'var(--color-error)',
    fontSize: 13,
  },
}
