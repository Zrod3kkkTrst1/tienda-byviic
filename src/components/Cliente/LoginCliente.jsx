import { useState } from 'react'
import { useSesionCliente } from '../../context/SesionClienteContext'

export default function LoginCliente({ onSuccess, onClose }) {
  const { iniciarSesion } = useSesionCliente()
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (nombre.trim().length < 2 || telefono.trim().length < 6) {
      setError(true)
      return
    }
    setLoading(true)
    const nuevaSesion = await iniciarSesion({ nombre, telefono })
    setLoading(false)
    onSuccess(nuevaSesion)
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.card} role="dialog" aria-label="Iniciar chat">
        <h2 style={styles.title}>Chatea con nosotras</h2>
        <p style={styles.sub}>Ingresa tu nombre y teléfono para empezar</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            className="input"
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={e => { setNombre(e.target.value); setError(false) }}
            autoComplete="given-name"
            autoFocus
          />
          <input
            className="input"
            type="tel"
            placeholder="6000-0000"
            value={telefono}
            onChange={e => { setTelefono(e.target.value); setError(false) }}
            autoComplete="tel"
          />
          {error && <p style={styles.error}>Escribe tu nombre y un teléfono válido</p>}
          <p style={styles.aviso}>
            No verificamos este número — cualquier persona que lo conozca podría ver esta conversación.
          </p>
          <button className="btn btn-primary" style={{ width: '100%' }} type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: '#fff',
    borderRadius: 8,
    padding: '36px 32px',
    width: '100%',
    maxWidth: 360,
    boxShadow: 'var(--shadow-lg)',
    animation: 'slideInUp 0.25s ease',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: 24,
    fontWeight: 400,
    marginBottom: 8,
    textAlign: 'center',
  },
  sub: {
    fontSize: 13,
    color: 'var(--color-text-muted)',
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  error: {
    color: 'var(--color-error)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: -6,
  },
  aviso: {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    textAlign: 'center',
    lineHeight: 1.5,
    marginTop: -4,
  },
}
