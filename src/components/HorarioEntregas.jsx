import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function HorarioEntregas() {
  const [abierto, setAbierto] = useState(false)
  const [texto, setTexto]     = useState('')

  useEffect(() => {
    supabase
      .from('configuracion')
      .select('valor')
      .eq('clave', 'horario_detalle')
      .single()
      .then(({ data }) => { if (data?.valor) setTexto(data.valor) })
  }, [])

  if (!texto) return null

  return (
    <section style={styles.section}>
      <div style={styles.inner}>
        <button style={styles.toggle} onClick={() => setAbierto(a => !a)}>
          <div style={styles.toggleLeft}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A07040" strokeWidth="2" style={{ flexShrink: 0 }}>
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span style={styles.toggleLabel}>Días y horarios de entrega</span>
          </div>
          <svg
            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A07040" strokeWidth="2"
            style={{ transition: 'transform 0.3s ease', transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {abierto && (
          <div style={styles.content}>
            <pre style={styles.texto}>{texto}</pre>
          </div>
        )}
      </div>
    </section>
  )
}

const styles = {
  section: {
    padding: '0 24px',
    background: '#fff',
  },
  inner: {
    maxWidth: 860,
    margin: '0 auto',
    borderRadius: 10,
    border: '1.5px solid rgba(160,112,64,0.25)',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(160,112,64,0.07)',
  },
  toggle: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 24px',
    background: 'linear-gradient(90deg, #faf3eb, #fdf8f2)',
    border: 'none',
    cursor: 'pointer',
    gap: 12,
  },
  toggleLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  toggleLabel: {
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#7a5530',
  },
  content: {
    borderTop: '1px solid rgba(160,112,64,0.15)',
    background: '#fffdf9',
    padding: '24px 28px',
    animation: 'slideInUp 0.2s ease',
  },
  texto: {
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    lineHeight: 2,
    color: 'var(--color-text)',
    whiteSpace: 'pre-line',
    margin: 0,
  },
}
