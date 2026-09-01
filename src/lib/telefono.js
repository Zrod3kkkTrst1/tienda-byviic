// Normaliza un teléfono panameño a dígitos con código de país (507...),
// usado como identificador único del cliente en `clientes`/`mensajes`.
export function normalizarTelefono(tel) {
  const digitos = (tel || '').replace(/\D/g, '')
  if (!digitos) return ''
  return digitos.startsWith('507') ? digitos : `507${digitos}`
}
