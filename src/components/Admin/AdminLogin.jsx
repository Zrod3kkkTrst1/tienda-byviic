import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminLogin({ onSuccess, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Email o contraseña incorrectos')
      setShake(true)
      setPassword('')
      setTimeout(() => setShake(false), 400)
      setLoading(false)
      return
    }

    onSuccess()
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ ...styles.card, animation: shake ? 'shake 0.4s ease' : 'slideInUp 0.25s ease' }}>
        <h2 style={styles.title}>Acceso privado</h2>
        <p style={styles.sub}>Inicia sesión para continuar</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(null) }}
            autoComplete="email"
            autoFocus
          />
          <input
            className="input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(null) }}
            autoComplete="current-password"
          />
          {error && <p style={styles.error}>{error}</p>}
          <button className="btn btn-primary" style={{ width: '100%' }} type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  card: {
    background: '#fff',
    borderRadius: 8,
    padding: '36px 32px',
    width: '100%',
    maxWidth: 340,
    boxShadow: 'var(--shadow-lg)',
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
}
