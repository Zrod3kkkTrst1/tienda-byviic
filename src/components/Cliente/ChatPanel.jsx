import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useSesionCliente } from '../../context/SesionClienteContext'

export default function ChatPanel({ isOpen, onClose }) {
  const { sesion } = useSesionCliente()
  const [mensajes, setMensajes] = useState([])
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(true)
  const listRef = useRef(null)

  useEffect(() => {
    if (!isOpen || !sesion) return

    let activo = true
    setLoading(true)

    supabase
      .from('mensajes')
      .select('*')
      .eq('telefono', sesion.telefono)
      .order('creado_en')
      .then(({ data }) => {
        if (!activo) return
        setMensajes(data || [])
        setLoading(false)
      })

    const canal = supabase
      .channel(`mensajes-cliente-${sesion.telefono}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'mensajes',
        filter: `telefono=eq.${sesion.telefono}`,
      }, (payload) => {
        setMensajes(prev => prev.some(m => m.id === payload.new.id) ? prev : [...prev, payload.new])
      })
      .subscribe()

    return () => {
      activo = false
      supabase.removeChannel(canal)
    }
  }, [isOpen, sesion])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [mensajes])

  async function enviar(e) {
    e.preventDefault()
    const contenido = texto.trim()
    if (!contenido || !sesion) return
    setTexto('')
    // Se agrega localmente de una vez (no depende de que Realtime ya esté
    // suscrito) — si el evento de Realtime llega después, el dedup por id
    // en el handler de arriba evita que se duplique.
    const { data } = await supabase.from('mensajes').insert({
      telefono: sesion.telefono,
      autor: 'cliente',
      texto: contenido,
    }).select().single()

    if (data) {
      setMensajes(prev => prev.some(m => m.id === data.id) ? prev : [...prev, data])
    }
  }

  if (!isOpen || !sesion) return null

  return (
    <>
      <div style={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <aside style={styles.drawer} role="dialog" aria-label="Chat con la tienda">
        <div style={styles.header}>
          <h2 style={styles.title}>Chat con nosotras</h2>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Cerrar chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={styles.mensajes} ref={listRef}>
          {loading ? (
            <div style={styles.centered}><div className="spinner" /></div>
          ) : mensajes.length === 0 ? (
            <p style={styles.empty}>Aún no hay mensajes — escríbenos por aquí.</p>
          ) : (
            mensajes.map(m => (
              <div
                key={m.id}
                style={{
                  ...styles.burbuja,
                  ...(m.autor === 'cliente' ? styles.burbujaCliente : styles.burbujaAdmin),
                }}
              >
                {m.texto}
              </div>
            ))
          )}
        </div>

        <form onSubmit={enviar} style={styles.inputRow}>
          <input
            className="input"
            type="text"
            placeholder="Escribe un mensaje..."
            value={texto}
            onChange={e => setTexto(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" type="submit" disabled={!texto.trim()}>
            Enviar
          </button>
        </form>
      </aside>
    </>
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
  mensajes: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 0',
  },
  empty: {
    color: 'var(--color-text-muted)',
    fontSize: 14,
    textAlign: 'center',
    padding: '40px 0',
  },
  burbuja: {
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.5,
    whiteSpace: 'pre-line',
  },
  burbujaCliente: {
    alignSelf: 'flex-end',
    background: 'var(--color-gold)',
    color: '#fff',
    borderBottomRightRadius: 2,
  },
  burbujaAdmin: {
    alignSelf: 'flex-start',
    background: 'var(--color-bg-warm)',
    color: 'var(--color-text)',
    borderBottomLeftRadius: 2,
  },
  inputRow: {
    display: 'flex',
    gap: 8,
    padding: '16px 20px',
    borderTop: '1px solid var(--color-border-light)',
  },
}
