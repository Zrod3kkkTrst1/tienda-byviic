import { useState } from 'react'
import { ADMIN_PIN } from '../../lib/constants'

export default function AdminLogin({ onSuccess, onClose }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (pin === ADMIN_PIN) {
      onSuccess()
    } else {
      setError(true)
      setShake(true)
      setPin('')
      setTimeout(() => setShake(false), 400)
    }
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ ...styles.card, animation: shake ? 'shake 0.4s ease' : 'slideInUp 0.25s ease' }}>
        <h2 style={styles.title}>Acceso privado</h2>
        <p style={styles.sub}>Ingresa el PIN para continuar</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            className="input"
            type="password"
            inputMode="numeric"
            maxLength={8}
            placeholder="••••"
            value={pin}
            onChange={e => { setPin(e.target.value); setError(false) }}
            style={{ textAlign: 'center', fontSize: 20, letterSpacing: 8 }}
            autoFocus
          />
          {error && <p style={styles.error}>PIN incorrecto</p>}
          <button className="btn btn-primary" style={{ width: '100%' }} type="submit">
            Ingresar
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
