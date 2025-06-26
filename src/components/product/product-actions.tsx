'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/stores/cart-store'
import { useWishlistStore } from '@/stores/wishlist-store'
import { useLoading } from '@/providers/loading-provider'
import { Product } from '@/types'
import toast from 'react-hot-toast'

interface ProductActionsProps {
  product: Product
}

export function ProductActions({ product }: ProductActionsProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  const { addItem: addToCart } = useCartStore()
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore()
  const { setIsLoading, setLoadingText } = useLoading()

  const handleAddToCart = async () => {
    if (!session) {
      toast.error('Please sign in to add items to cart')
      router.push('/auth/signin')
      return
    }

    if (product.stock === 0) {
      toast.error('Product is out of stock')
      return
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`)
      return
    }

    setIsAddingToCart(true)
    setIsLoading(true)
    setLoadingText('Adding to cart...')

    try {
      await addToCart(product, quantity)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
      setIsLoading(false)
    }
  }

  const handleToggleWishlist = async () => {
    if (!session) {
      toast.error('Please sign in to manage wishlist')
      router.push('/auth/signin')
      return
    }

    setIsLoading(true)
    setLoadingText(isInWishlist(product.id) ? 'Removing from wishlist...' : 'Adding to wishlist...')

    try {
      await toggleWishlist(product)
      toast.success(
        isInWishlist(product.id)
          ? 'Removed from wishlist'
          : 'Added to wishlist!'
      )
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update wishlist')
    } finally {
      setIsLoading(false)
    }
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value)
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="h-4 w-4" />
          </button>
          <Input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-16 text-center"
            min="1"
            max={product.stock}
          />
          <button
            onClick={incrementQuantity}
            disabled={quantity >= product.stock}
            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAddingToCart}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
        
        <Button 
          size="lg" 
          variant="outline"
          onClick={handleToggleWishlist}
          className={isInWishlist(product.id) ? 'text-red-600 border-red-600' : ''}
        >
          <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Stock Warning */}
      {product.stock > 0 && product.stock <= 5 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <p className="text-sm text-orange-800">
            ⚠️ Only {product.stock} left in stock! Order soon.
          </p>
        </div>
      )}
    </div>
  )
} 