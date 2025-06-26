import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types'

export interface WishlistItem {
  id: string
  product: Product
  createdAt: string
}

interface WishlistStore {
  items: WishlistItem[]
  isLoading: boolean
  error: string | null

  // Actions
  addItem: (product: Product) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  toggleItem: (product: Product) => Promise<void>
  clearWishlist: () => void
  fetchWishlist: () => Promise<void>
  
  // Computed
  isInWishlist: (productId: string) => boolean
  totalItems: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      addItem: async (product: Product) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch('/api/wishlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: product.id,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to add item to wishlist')
          }

          // Refresh wishlist after adding
          await get().fetchWishlist()
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add item to wishlist' })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      removeItem: async (productId: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch(`/api/wishlist?productId=${productId}`, {
            method: 'DELETE',
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to remove item from wishlist')
          }

          // Refresh wishlist after removing
          await get().fetchWishlist()
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to remove item from wishlist' })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      toggleItem: async (product: Product) => {
        const isInWishlist = get().isInWishlist(product.id)
        
        if (isInWishlist) {
          await get().removeItem(product.id)
        } else {
          await get().addItem(product)
        }
      },

      clearWishlist: () => {
        set({ items: [], error: null })
      },

      fetchWishlist: async () => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch('/api/wishlist')
          
          if (!response.ok) {
            throw new Error('Failed to fetch wishlist')
          }

          const data = await response.json()
          set({ items: data.items || [] })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch wishlist' })
        } finally {
          set({ isLoading: false })
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some(item => item.product.id === productId)
      },

      totalItems: () => {
        return get().items.length
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
) 