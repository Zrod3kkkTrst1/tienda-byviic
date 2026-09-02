// Plantillas de mensajes reutilizadas por el boton de respuesta rapida del
// admin (ConversacionAdmin.jsx) y documentadas aqui para mantenerlas en un
// solo lugar. El trigger auto_responder_pedido() en Supabase (ver
// supabase/auto_responder_pedido.sql) tiene su propia copia en SQL — si
// cambias este texto, actualiza tambien ese trigger.
export const MENSAJE_BIENVENIDA = 'Bienvenida a BYVIIC. Para realizar tu pedido debes enviar el 50% o cancelar por Yappy al 6540-4105 Ana Rivera, y enviarnos el comprobante al 6681-1682. No hacemos devoluciones una vez realizado el abono.'

const fmt = (n) => new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'USD' }).format(n ?? 0)

export function armarConfirmacionPedido(p) {
  const lineas = (p.items || []).map(i => `• ${i.nombre} x${i.cantidad} — ${fmt(i.subtotal)}`)
  return [
    `¡Hola ${p.cliente_nombre}! Te escribo por tu pedido en BYVIIC:`,
    '',
    ...lineas,
    '',
    `Total: ${fmt(p.total)}`,
    p.saldo_pendiente > 0 ? `Saldo pendiente: ${fmt(p.saldo_pendiente)}` : 'Pago completo',
    '',
    '¿Vas a querer el pedido? Confírmame para seguir con la preparación 😊',
  ].join('\n')
}
