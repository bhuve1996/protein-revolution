import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types'

export interface CartItem {
  id: string
  product: Product
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isLoading: boolean
  error: string | null

  // Actions
  addItem: (product: Product, quantity?: number) => Promise<void>
  removeItem: (cartItemId: string) => Promise<void>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  clearCart: () => void
  fetchCart: () => Promise<void>
  
  // Computed
  totalItems: () => number
  totalAmount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      addItem: async (product: Product, quantity = 1) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: product.id,
              quantity,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to add item to cart')
          }

          // Refresh cart after adding
          await get().fetchCart()
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add item to cart' })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      removeItem: async (cartItemId: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch(`/api/cart?id=${cartItemId}`, {
            method: 'DELETE',
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to remove item from cart')
          }

          // Refresh cart after removing
          await get().fetchCart()
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to remove item from cart' })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      updateQuantity: async (cartItemId: string, quantity: number) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch('/api/cart', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              cartItemId,
              quantity,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to update cart')
          }

          // Refresh cart after updating
          await get().fetchCart()
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update cart' })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      clearCart: () => {
        set({ items: [], error: null })
      },

      fetchCart: async () => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch('/api/cart')
          
          if (!response.ok) {
            throw new Error('Failed to fetch cart')
          }

          const data = await response.json()
          set({ items: data.items || [] })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch cart' })
        } finally {
          set({ isLoading: false })
        }
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      totalAmount: () => {
        return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
) 