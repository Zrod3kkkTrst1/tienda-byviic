import { useState } from 'react'

const DEVICES = [
  { label: 'iPhone SE',     w: 375, h: 667 },
  { label: 'iPhone 14',     w: 390, h: 844 },
  { label: 'Samsung S23',   w: 393, h: 851 },
  { label: 'Pixel 7',       w: 412, h: 915 },
]

export default function MobileDevPreview() {
  const [open, setOpen]     = useState(false)
  const [device, setDevice] = useState(DEVICES[1])
  const [landscape, setLandscape] = useState(false)

  if (!import.meta.env.DEV) return null

  const w = landscape ? device.h : device.w
  const h = landscape ? device.w : device.h

  return (
    <>
      {/* Botón flotante */}
      <button onClick={() => setOpen(true)} style={styles.fab} title="Preview móvil (solo visible en desarrollo)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
          <line x1="12" y1="18" x2="12.01" y2="18"/>
        </svg>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em' }}>MÓVIL</span>
      </button>

      {/* Modal preview */}
      {open && (
        <div style={styles.overlay} onClick={e => e.target === e.currentTarget && setOpen(false)}>
          <div style={styles.panel}>

            {/* Toolbar */}
            <div style={styles.toolbar}>
              <span style={styles.toolbarTitle}>Preview móvil</span>

              <div style={styles.deviceBtns}>
                {DEVICES.map(d => (
                  <button
                    key={d.label}
                    onClick={() => setDevice(d)}
                    style={{ ...styles.deviceBtn, ...(device.label === d.label ? styles.deviceBtnActive : {}) }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  onClick={() => setLandscape(l => !l)}
                  style={styles.iconBtn}
                  title="Rotar"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
                  </svg>
                </button>
                <button onClick={() => setOpen(false)} style={styles.iconBtn} title="Cerrar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Dimensiones */}
            <div style={styles.dimLabel}>
              {w} × {h} px — {device.label}{landscape ? ' (horizontal)' : ''}
            </div>

            {/* Phone frame + iframe */}
            <div style={styles.frameWrap}>
              <div style={{ ...styles.phoneFrame, width: w + 24, height: h + 48 }}>
                <div style={styles.phoneSpeaker} />
                <iframe
                  src="http://localhost:5173"
                  width={w}
                  height={h}
                  style={styles.iframe}
                  title="Preview móvil"
                />
                <div style={styles.phoneHome} />
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  )
}

const styles = {
  fab: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 9999,
    background: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: 28,
    padding: '10px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    fontFamily: 'var(--font-sans)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    zIndex: 99999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
    overflow: 'auto',
  },
  panel: {
    background: '#1e1e1e',
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  toolbar: {
    width: '100%',
    background: '#111',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '12px 20px',
    flexWrap: 'wrap',
    borderBottom: '1px solid #333',
  },
  toolbarTitle: {
    color: '#aaa',
    fontSize: 13,
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginRight: 8,
    whiteSpace: 'nowrap',
  },
  deviceBtns: {
    display: 'flex',
    gap: 6,
    flex: 1,
    flexWrap: 'wrap',
  },
  deviceBtn: {
    padding: '5px 12px',
    borderRadius: 6,
    border: '1px solid #444',
    background: 'transparent',
    color: '#888',
    fontSize: 12,
    fontFamily: 'var(--font-sans)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  deviceBtnActive: {
    background: '#A07040',
    color: '#fff',
    borderColor: '#A07040',
  },
  iconBtn: {
    background: 'transparent',
    border: '1px solid #444',
    color: '#aaa',
    borderRadius: 6,
    padding: 6,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  dimLabel: {
    color: '#666',
    fontSize: 11,
    fontFamily: 'monospace',
    padding: '8px 0 16px',
  },
  frameWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '0 20px 40px',
  },
  phoneFrame: {
    background: '#111',
    borderRadius: 40,
    border: '2px solid #333',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '14px 12px',
    boxShadow: '0 0 0 1px #222, 0 20px 60px rgba(0,0,0,0.6)',
    gap: 10,
  },
  phoneSpeaker: {
    width: 60,
    height: 5,
    background: '#333',
    borderRadius: 3,
    flexShrink: 0,
  },
  iframe: {
    border: 'none',
    borderRadius: 4,
    display: 'block',
    flexShrink: 0,
  },
  phoneHome: {
    width: 36,
    height: 5,
    background: '#333',
    borderRadius: 3,
    flexShrink: 0,
  },
}
