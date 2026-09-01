import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { normalizarTelefono } from '../lib/telefono'

// No hay verificación (OTP) del teléfono — riesgo aceptado. La persistencia
// y el aislamiento entre clientes ya no dependen de localStorage: cada
// sesión usa una cuenta anónima real de Supabase Auth (auth.signInAnonymously),
// y las políticas RLS de `clientes`/`mensajes` solo dejan ver/escribir las
// filas asociadas al auth.uid() de esa sesión.
const SesionClienteContext = createContext(null)

export function SesionClienteProvider({ children }) {
  const [sesion, setSesion] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true

    async function hidratar() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (activo) setCargando(false)
        return
      }
      const { data } = await supabase
        .from('clientes')
        .select('telefono, nombre')
        .eq('auth_uid', session.user.id)
        .maybeSingle()

      if (activo) {
        if (data) setSesion({ nombre: data.nombre, telefono: data.telefono })
        setCargando(false)
      }
    }

    hidratar()
    return () => { activo = false }
  }, [])

  const iniciarSesion = useCallback(async ({ nombre, telefono }) => {
    const telefonoNormalizado = normalizarTelefono(telefono)
    if (!telefonoNormalizado || !nombre?.trim()) return

    let { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      const { data, error } = await supabase.auth.signInAnonymously()
      if (error) return
      session = data.session
    }

    const nueva = { nombre: nombre.trim(), telefono: telefonoNormalizado }

    await supabase.from('clientes').upsert({
      auth_uid: session.user.id,
      telefono: telefonoNormalizado,
      nombre: nueva.nombre,
      ultima_actividad: new Date().toISOString(),
    })

    setSesion(nueva)
    return nueva
  }, [])

  const cerrarSesion = useCallback(async () => {
    await supabase.auth.signOut()
    setSesion(null)
  }, [])

  return (
    <SesionClienteContext.Provider value={{ sesion, cargando, iniciarSesion, cerrarSesion }}>
      {children}
    </SesionClienteContext.Provider>
  )
}

export function useSesionCliente() {
  const ctx = useContext(SesionClienteContext)
  if (!ctx) throw new Error('useSesionCliente debe usarse dentro de SesionClienteProvider')
  return ctx
}
