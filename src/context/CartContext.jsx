import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback((product) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      }
      return [...prev, {
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        foto_url: product.foto_url,
        por_encargo: product.por_encargo,
        cantidad: 1,
        abonar: true,
      }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const updateCantidad = useCallback((id, cantidad) => {
    if (cantidad < 1) return
    setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad } : i))
  }, [])

  const toggleAbonar = useCallback((id) => {
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, abonar: !i.abonar } : i)
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalProductos = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0)

  const pagarAhora = items.reduce((sum, i) =>
    sum + (i.abonar ? (i.precio * i.cantidad) / 2 : i.precio * i.cantidad)
  , 0)

  const saldoPendiente = totalProductos - pagarAhora

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0)

  return (
    <CartContext.Provider value={{
      items,
      isOpen,
      setIsOpen,
      addItem,
      removeItem,
      updateCantidad,
      toggleAbonar,
      clearCart,
      totalProductos,
      pagarAhora,
      saldoPendiente,
      totalItems,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
