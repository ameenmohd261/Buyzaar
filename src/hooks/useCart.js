import { useState, useEffect, useCallback } from 'react'
import { useCartStore } from '../store/cartStore'
import { toast } from '../components/ui/toast'

export const useCart = () => {
  const { 
    items, 
    addItem: storeAddItem, 
    removeItem: storeRemoveItem, 
    updateQuantity: storeUpdateQuantity,
    clearCart: storeClearCart,
    subtotal,
    shipping,
    tax,
    total,
    calculateTotals
  } = useCartStore()
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  // Calculate totals when items change
  useEffect(() => {
    calculateTotals()
  }, [items, calculateTotals])
  
  // Add item to cart
  const addItem = useCallback((product, quantity = 1, showNotification = true) => {
    if (!product) return
    
    // Ensure quantity is valid
    const validQuantity = Math.max(1, quantity)
    
    try {
      storeAddItem({
        ...product,
        quantity: validQuantity
      })
      
      if (showNotification) {
        toast.success(`${product.name} added to cart`)
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error)
      toast.error('Failed to add item to cart')
    }
  }, [storeAddItem])
  
  // Remove item from cart
  const removeItem = useCallback((index) => {
    try {
      const item = items[index]
      storeRemoveItem(index)
      
      if (item) {
        toast.success(`${item.name} removed from cart`)
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error)
      toast.error('Failed to remove item from cart')
    }
  }, [items, storeRemoveItem])
  
  // Update item quantity
  const updateQuantity = useCallback((index, quantity) => {
    // Don't allow quantities less than 1
    if (quantity < 1) return
    
    try {
      storeUpdateQuantity(index, quantity)
    } catch (error) {
      console.error('Failed to update item quantity:', error)
      toast.error('Failed to update item quantity')
    }
  }, [storeUpdateQuantity])
  
  // Clear cart
  const clearCart = useCallback(() => {
    try {
      storeClearCart()
      toast.success('Cart cleared')
    } catch (error) {
      console.error('Failed to clear cart:', error)
      toast.error('Failed to clear cart')
    }
  }, [storeClearCart])
  
  // Toggle cart visibility
  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev)
  }, [])
  
  // Open cart
  const openCart = useCallback(() => {
    setIsCartOpen(true)
  }, [])
  
  // Close cart
  const closeCart = useCallback(() => {
    setIsCartOpen(false)
  }, [])
  
  return {
    items,
    itemCount: items.length,
    subtotal,
    shipping,
    tax,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isCartOpen,
    toggleCart,
    openCart,
    closeCart
  }
}