import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      
      // Calculate all cart totals
      calculateTotals: () => {
        const items = get().items
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const shipping = subtotal > 100 ? 0 : 9.99
        const tax = subtotal * 0.08
        const total = subtotal + shipping + tax
        
        set({
          subtotal,
          shipping,
          tax,
          total
        })
      },
      
      // Add an item to cart
      addItem: (product) => set((state) => {
        // Check if item already exists in cart
        const existingItemIndex = state.items.findIndex(
          item => item.id === product.id && 
                 item.selectedSize === product.selectedSize && 
                 item.selectedColor?.name === product.selectedColor?.name
        )
        
        let newItems
        
        if (existingItemIndex !== -1) {
          // Update quantity if item exists
          newItems = [...state.items]
          newItems[existingItemIndex].quantity += 1
        } else {
          // Add new item with quantity 1
          newItems = [...state.items, { ...product, quantity: 1 }]
        }
        
        const newState = { items: newItems }
        return newState
      }, false, 'cart/addItem'),
      
      // Remove an item from cart
      removeItem: (itemIndex) => set((state) => {
        const newItems = [...state.items]
        newItems.splice(itemIndex, 1)
        
        const newState = { items: newItems }
        return newState
      }, false, 'cart/removeItem'),
      
      // Update item quantity
      updateQuantity: (itemIndex, quantity) => set((state) => {
        if (quantity < 1) return state
        
        const newItems = [...state.items]
        newItems[itemIndex].quantity = quantity
        
        const newState = { items: newItems }
        return newState
      }, false, 'cart/updateQuantity'),
      
      // Clear cart
      clearCart: () => set({ items: [] }, false, 'cart/clearCart'),
    }),
    {
      name: 'buyzaar-cart',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) state.calculateTotals()
      },
    }
  )
)

useCartStore.subscribe((state) => state.calculateTotals())