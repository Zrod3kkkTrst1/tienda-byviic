import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'

export default function ConversacionAdmin({ telefono, onVolver }) {
  const [mensajes, setMensajes] = useState([])
  const [nombre, setNombre] = useState('')
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(true)
  const listRef = useRef(null)

  useEffect(() => {
    let activo = true
    setLoading(true)

    async function cargar() {
      const [{ data: cliente }, { data: msgs }] = await Promise.all([
        supabase.from('clientes').select('nombre').eq('telefono', telefono).single(),
        supabase.from('mensajes').select('*').eq('telefono', telefono).order('creado_en'),
      ])
      if (!activo) return
      setNombre(cliente?.nombre || telefono)
      setMensajes(msgs || [])
      setLoading(false)

      await supabase.from('mensajes').update({ leido_admin: true }).eq('telefono', telefono).eq('leido_admin', false)
    }
    cargar()

    const canal = supabase
      .channel(`mensajes-admin-${telefono}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'mensajes',
        filter: `telefono=eq.${telefono}`,
      }, (payload) => {
        setMensajes(prev => prev.some(m => m.id === payload.new.id) ? prev : [...prev, payload.new])
        if (payload.new.autor === 'cliente') {
          supabase.from('mensajes').update({ leido_admin: true }).eq('id', payload.new.id)
        }
      })
      .subscribe()

    return () => {
      activo = false
      supabase.removeChannel(canal)
    }
  }, [telefono])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [mensajes])

  async function enviar(e) {
    e.preventDefault()
    const contenido = texto.trim()
    if (!contenido) return
    setTexto('')
    const { data } = await supabase.from('mensajes').insert({ telefono, autor: 'admin', texto: contenido }).select().single()
    if (data) {
      setMensajes(prev => prev.some(m => m.id === data.id) ? prev : [...prev, data])
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={onVolver}>← Volver a chats</button>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontWeight: 600 }}>{nombre}</p>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{telefono}</p>
        </div>
      </div>

      <div style={styles.mensajes} ref={listRef}>
        {loading ? (
          <div style={styles.centered}><div className="spinner" /></div>
        ) : mensajes.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px 0' }}>
            Todavía no hay mensajes con este cliente.
          </p>
        ) : (
          mensajes.map(m => (
            <div
              key={m.id}
              style={{ ...styles.burbuja, ...(m.autor === 'admin' ? styles.burbujaAdmin : styles.burbujaCliente) }}
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
          placeholder="Escribe una respuesta..."
          value={texto}
          onChange={e => setTexto(e.target.value)}
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" type="submit" disabled={!texto.trim()}>Enviar</button>
      </form>
    </div>
  )
}

const styles = {
  wrap: {
    background: '#fff',
    borderRadius: 8,
    border: '1px solid var(--color-border-light)',
    display: 'flex',
    flexDirection: 'column',
    height: '70vh',
    boxShadow: 'var(--shadow-sm)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid var(--color-border-light)',
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
  burbuja: {
    maxWidth: '70%',
    padding: '10px 14px',
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.5,
    whiteSpace: 'pre-line',
  },
  burbujaAdmin: {
    alignSelf: 'flex-end',
    background: 'var(--color-gold)',
    color: '#fff',
    borderBottomRightRadius: 2,
  },
  burbujaCliente: {
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
