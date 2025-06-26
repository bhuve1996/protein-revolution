'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'
import { useLoading } from '@/providers/loading-provider'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { addItem } = useCartStore()
  const { setIsLoading, setLoadingText } = useLoading()
  
  const discount = product.originalPrice 
    ? calculateDiscount(product.originalPrice, product.price)
    : 0

  const handleAddToCart = async () => {
    if (onAddToCart) {
      onAddToCart(product.id)
      return
    }

    if (!session) {
      toast.error('Please sign in to add items to cart')
      router.push('/auth/signin')
      return
    }

    if (product.stock === 0) {
      toast.error('Product is out of stock')
      return
    }

    setIsLoading(true)
    setLoadingText('Adding to cart...')

    try {
      await addItem(product, 1)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">
          {discount}% OFF
        </div>
      )}

      {/* Product Image */}
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <p className="text-sm text-gray-600 font-medium">{product.brand}</p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Weight and Type */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
            {product.weight}
          </span>
          <span className="text-sm text-gray-600">
            {product.type}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {product.stock > 0 ? (
            <span className="text-sm text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-sm text-red-600 font-medium">Out of Stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
} 