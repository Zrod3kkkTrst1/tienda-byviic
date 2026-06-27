import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function DeliveryBanner() {
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    supabase
      .from('configuracion')
      .select('valor')
      .eq('clave', 'horario_entrega')
      .single()
      .then(({ data }) => { if (data?.valor) setMensaje(data.valor) })
  }, [])

  if (!mensaje) return null

  return (
    <div style={styles.banner}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 5v4h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
      <span style={styles.text}>{mensaje}</span>
    </div>
  )
}

const styles = {
  banner: {
    background: 'linear-gradient(90deg, #faf3eb, #fdf8f2, #faf3eb)',
    borderBottom: '1px solid rgba(160,112,64,0.2)',
    padding: '9px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    color: '#A07040',
    fontSize: 13,
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    letterSpacing: '0.03em',
  },
  text: {
    color: '#7a5530',
  },
}
