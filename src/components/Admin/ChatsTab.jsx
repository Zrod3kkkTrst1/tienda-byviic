import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import ConversacionAdmin from './ConversacionAdmin'

export default function ChatsTab({ telefonoInicial, onTelefonoConsumido }) {
  const [conversaciones, setConversaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [seleccionado, setSeleccionado] = useState(null)

  async function cargar() {
    setLoading(true)
    const { data: clientesData } = await supabase
      .from('clientes')
      .select('*')
      .order('ultima_actividad', { ascending: false })

    const conDetalle = await Promise.all((clientesData || []).map(async (c) => {
      const [{ data: ultimos }, { count }] = await Promise.all([
        supabase.from('mensajes').select('texto, autor, creado_en').eq('telefono', c.telefono).order('creado_en', { ascending: false }).limit(1),
        supabase.from('mensajes').select('id', { count: 'exact', head: true }).eq('telefono', c.telefono).eq('leido_admin', false).eq('autor', 'cliente'),
      ])
      return { ...c, ultimoMensaje: ultimos?.[0] || null, noLeidos: count || 0 }
    }))

    setConversaciones(conDetalle)
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  useEffect(() => {
    if (telefonoInicial) {
      setSeleccionado(telefonoInicial)
      onTelefonoConsumido?.()
    }
  }, [telefonoInicial])

  useEffect(() => {
    const canal = supabase
      .channel('mensajes-admin-lista')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes' }, () => cargar())
      .subscribe()
    return () => supabase.removeChannel(canal)
  }, [])

  if (seleccionado) {
    return (
      <ConversacionAdmin
        telefono={seleccionado}
        onVolver={() => { setSeleccionado(null); cargar() }}
      />
    )
  }

  return (
    <div>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Chats ({conversaciones.length})</h2>
        <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={cargar}>Actualizar</button>
      </div>

      {loading ? (
        <div style={styles.centered}><div className="spinner" /></div>
      ) : conversaciones.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', padding: '40px 0', textAlign: 'center' }}>
          No hay conversaciones todavía.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {conversaciones.map(c => (
            <button
              key={c.telefono}
              style={styles.convCard}
              onClick={() => setSeleccionado(c.telefono)}
            >
              <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 15 }}>{c.nombre || c.telefono}</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{c.telefono}</p>
                {c.ultimoMensaje && (
                  <p style={styles.preview}>
                    {c.ultimoMensaje.autor === 'admin' ? 'Tú: ' : ''}{c.ultimoMensaje.texto}
                  </p>
                )}
              </div>
              {c.noLeidos > 0 && (
                <span style={styles.badge}>{c.noLeidos}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
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
  centered: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px 0',
  },
  convCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: '#fff',
    borderRadius: 8,
    border: '1px solid var(--color-border-light)',
    padding: '14px 20px',
    boxShadow: 'var(--shadow-sm)',
    cursor: 'pointer',
    textAlign: 'left',
  },
  preview: {
    fontSize: 13,
    color: 'var(--color-text-muted)',
    marginTop: 4,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  badge: {
    background: 'var(--color-gold)',
    color: '#fff',
    borderRadius: '50%',
    minWidth: 22,
    height: 22,
    fontSize: 12,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
    flexShrink: 0,
  },
}
