import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'

const isVideo = (url) => /\.(mp4|webm|mov)(\?.*)?$/i.test(url || '')

const CAMPOS_INICIALES = {
  nombre: '', descripcion: '', precio: '', foto_url: '',
  fotos: [],
  categoria: '', por_encargo: false, stock: '', activo: true, agotado: false,
}

export default function ProductForm({ producto, onSave, onClose }) {
  const [form, setForm] = useState(CAMPOS_INICIALES)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(null) // null | 'cover' | index | 'nueva'
  const [error, setError] = useState(null)
  const fileInputsRef = useRef({})

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio?.toString() || '',
        foto_url: producto.foto_url || '',
        fotos: Array.isArray(producto.fotos) ? producto.fotos : [],
        categoria: producto.categoria || '',
        por_encargo: producto.por_encargo || false,
        stock: producto.stock?.toString() || '',
        activo: producto.activo !== false,
        agotado: producto.agotado || false,
      })
    }
  }, [producto])

  function set(field, val) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  async function uploadFile(file) {
    const ext = file.name.split('.').pop().toLowerCase()
    const path = `producto-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('fotos-productos')
      .upload(path, file, { upsert: true })
    if (uploadError) throw uploadError
    const { data } = supabase.storage.from('fotos-productos').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleCoverUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading('cover')
    setError(null)
    try {
      const url = await uploadFile(file)
      set('foto_url', url)
    } catch (err) {
      setError(`Error al subir la foto: ${err.message || 'Verifica que el bucket "fotos-productos" existe y es público en Supabase Storage.'}`)
    }
    setUploading(null)
    e.target.value = ''
  }

  async function handleGaleriaUpload(e, key) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(key)
    setError(null)
    try {
      const url = await uploadFile(file)
      setForm(prev => {
        const fotos = [...prev.fotos]
        if (key === 'nueva') {
          fotos.push(url)
        } else {
          fotos[key] = url
        }
        return { ...prev, fotos }
      })
    } catch (err) {
      setError(`Error al subir el archivo: ${err.message || 'Verifica que el bucket "fotos-productos" existe y es público en Supabase Storage.'}`)
    }
    setUploading(null)
    e.target.value = ''
  }

  function quitarDeGaleria(index) {
    setForm(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index),
    }))
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
      fotos: form.fotos,
      categoria: form.categoria.trim(),
      por_encargo: form.por_encargo,
      stock: form.stock !== '' ? parseInt(form.stock) : null,
      activo: form.activo,
      agotado: form.agotado,
    }
    const err = await onSave(payload)
    setSaving(false)
    if (err) setError('Error al guardar: ' + (err.message || 'Intenta de nuevo.'))
  }

  // Calcular etiqueta de cada item de galería
  function galeriaLabel(fotos, index) {
    let imgCount = 0, vidCount = 0
    for (let j = 0; j <= index; j++) {
      if (isVideo(fotos[j])) { vidCount++; if (j === index) return `Video ${vidCount}` }
      else { imgCount++; if (j === index) return `Foto ${imgCount}` }
    }
  }

  const isUploading = uploading !== null

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
          {/* Info básica */}
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

          {/* Foto de portada */}
          <Field label="Foto de portada">
            <input
              ref={el => fileInputsRef.current['cover'] = el}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleCoverUpload}
            />
            {form.foto_url ? (
              <div style={styles.fotoWrap}>
                <img
                  src={form.foto_url}
                  alt="Portada"
                  style={styles.preview}
                  onError={e => { e.target.style.display = 'none'; setError('⚠️ La foto subió pero no se puede previsualizar. Verifica que el bucket "fotos-productos" sea público en Supabase Storage → Buckets → fotos-productos → Make public.') }}
                />
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={styles.cambiarFotoBtn}
                  onClick={() => fileInputsRef.current['cover']?.click()}
                  disabled={isUploading}
                >
                  {uploading === 'cover' ? 'Subiendo...' : 'Cambiar foto de portada'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-ghost"
                style={styles.subirFotoBtn}
                onClick={() => fileInputsRef.current['cover']?.click()}
                disabled={isUploading}
              >
                {uploading === 'cover' ? 'Subiendo...' : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 6 }}>
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    Subir foto de portada
                  </>
                )}
              </button>
            )}
          </Field>

          {/* Galería */}
          <Field label={`Galería · ${form.fotos.length} archivo${form.fotos.length !== 1 ? 's' : ''} (fotos y videos)`}>
            {/* Inputs ocultos por cada slot de galería */}
            {form.fotos.map((_, i) => (
              <input
                key={`gi-${i}`}
                ref={el => fileInputsRef.current[i] = el}
                type="file"
                accept="image/*,video/*"
                style={{ display: 'none' }}
                onChange={e => handleGaleriaUpload(e, i)}
              />
            ))}
            <input
              ref={el => fileInputsRef.current['nueva'] = el}
              type="file"
              accept="image/*,video/*"
              style={{ display: 'none' }}
              onChange={e => handleGaleriaUpload(e, 'nueva')}
            />

            {form.fotos.length === 0 && (
              <p style={styles.galeriaVacia}>Sin fotos ni videos en la galería.</p>
            )}

            <div style={styles.galeriaGrid}>
              {form.fotos.map((url, i) => {
                const esVideo = isVideo(url)
                const label = galeriaLabel(form.fotos, i)
                return (
                  <div key={`${i}-${url.slice(-8)}`} style={styles.galeriaItem}>
                    <div style={styles.galeriaPreview}>
                      {esVideo ? (
                        <div style={styles.videoIconWrap}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A07040" strokeWidth="1.5">
                            <polygon points="5 3 19 12 5 21 5 3" fill="#A07040" opacity="0.2"/>
                            <polygon points="5 3 19 12 5 21 5 3"/>
                          </svg>
                          <span style={styles.videoExt}>.{url.split('.').pop().split('?')[0].toUpperCase()}</span>
                        </div>
                      ) : (
                        <img
                          src={url}
                          alt={label}
                          style={styles.galeriaImg}
                          onError={e => { e.target.style.opacity = '0.2'; setError('⚠️ Una foto de la galería no se puede previsualizar. Verifica que el bucket "fotos-productos" sea público en Supabase Storage.') }}
                        />
                      )}
                    </div>
                    <p style={styles.galeriaLabel}>{label}</p>
                    <div style={styles.galeriaActions}>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={styles.galeriaBtnSmall}
                        onClick={() => fileInputsRef.current[i]?.click()}
                        disabled={isUploading}
                      >
                        {uploading === i ? 'Subiendo...' : 'Cambiar'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ ...styles.galeriaBtnSmall, color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                        onClick={() => quitarDeGaleria(i)}
                        disabled={isUploading}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              type="button"
              className="btn btn-ghost"
              style={styles.agregarBtn}
              onClick={() => fileInputsRef.current['nueva']?.click()}
              disabled={isUploading}
            >
              {uploading === 'nueva' ? 'Subiendo...' : '+ Agregar foto o video'}
            </button>
          </Field>

          {/* Opciones */}
          <div style={styles.checkboxRow}>
            <label style={styles.checkLabel}>
              <input type="checkbox" checked={form.por_encargo} onChange={e => set('por_encargo', e.target.checked)} style={{ accentColor: 'var(--color-gold)' }} />
              Por encargo (permite abono del 50%)
            </label>
            <label style={styles.checkLabel}>
              <input type="checkbox" checked={form.activo} onChange={e => set('activo', e.target.checked)} style={{ accentColor: 'var(--color-gold)' }} />
              Activo (visible en la tienda)
            </label>
            <label style={{ ...styles.checkLabel, ...(form.agotado ? { color: '#c0392b' } : {}) }}>
              <input type="checkbox" checked={form.agotado} onChange={e => set('agotado', e.target.checked)} style={{ accentColor: '#c0392b' }} />
              Marcar como agotado
            </label>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.buttons}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={saving || isUploading}>
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
  fotoWrap: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid var(--color-border-light)',
  },
  preview: {
    width: '100%',
    maxHeight: 180,
    objectFit: 'cover',
    display: 'block',
  },
  cambiarFotoBtn: {
    width: '100%',
    borderRadius: 0,
    borderTop: '1px solid var(--color-border-light)',
    fontSize: 13,
    padding: '10px',
  },
  subirFotoBtn: {
    width: '100%',
    minHeight: 100,
    border: '2px dashed var(--color-border)',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    gap: 4,
  },
  galeriaVacia: {
    fontSize: 13,
    color: 'var(--color-text-muted)',
    margin: '0 0 8px',
  },
  galeriaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: 10,
    marginBottom: 10,
  },
  galeriaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    border: '1px solid var(--color-border-light)',
    borderRadius: 8,
    overflow: 'hidden',
    background: '#fafaf8',
  },
  galeriaPreview: {
    width: '100%',
    aspectRatio: '1 / 1',
    background: '#f5f3ef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  galeriaImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  videoIconWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  videoExt: {
    fontSize: 10,
    fontWeight: 700,
    color: '#A07040',
    letterSpacing: '0.05em',
  },
  galeriaLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--color-text-muted)',
    textAlign: 'center',
    padding: '6px 4px 4px',
  },
  galeriaActions: {
    display: 'flex',
    gap: 4,
    padding: '0 6px 8px',
  },
  galeriaBtnSmall: {
    flex: 1,
    padding: '4px 4px',
    fontSize: 11,
  },
  agregarBtn: {
    width: '100%',
    border: '2px dashed var(--color-border)',
    borderRadius: 8,
    padding: '10px',
    fontSize: 13,
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
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
    lineHeight: 1.5,
  },
}
