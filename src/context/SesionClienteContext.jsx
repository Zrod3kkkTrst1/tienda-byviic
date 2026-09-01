import { createContext, useContext, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { normalizarTelefono } from '../lib/telefono'

// No hay verificación (OTP) del teléfono — riesgo aceptado, mismo nivel de
// seguridad que el ADMIN_PIN en texto plano. La sesión vive en localStorage
// sin JWT ni backend de auth.
const STORAGE_KEY = 'byviic_cliente_session'

const SesionClienteContext = createContext(null)

function leerSesionGuardada() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function SesionClienteProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesionGuardada)

  const iniciarSesion = useCallback(async ({ nombre, telefono }) => {
    const telefonoNormalizado = normalizarTelefono(telefono)
    if (!telefonoNormalizado || !nombre?.trim()) return

    const nueva = { nombre: nombre.trim(), telefono: telefonoNormalizado }

    await supabase.from('clientes').upsert({
      telefono: telefonoNormalizado,
      nombre: nueva.nombre,
      ultima_actividad: new Date().toISOString(),
    })

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nueva))
    } catch {
      // localStorage no disponible (modo privado, etc.) — la sesión igual
      // funciona en memoria durante esta visita.
    }
    setSesion(nueva)
    return nueva
  }, [])

  const cerrarSesion = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ver nota en iniciarSesion
    }
    setSesion(null)
  }, [])

  return (
    <SesionClienteContext.Provider value={{ sesion, iniciarSesion, cerrarSesion }}>
      {children}
    </SesionClienteContext.Provider>
  )
}

export function useSesionCliente() {
  const ctx = useContext(SesionClienteContext)
  if (!ctx) throw new Error('useSesionCliente debe usarse dentro de SesionClienteProvider')
  return ctx
}
