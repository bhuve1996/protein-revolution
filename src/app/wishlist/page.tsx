'use client'

import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWishlistStore } from '@/stores/wishlist-store'
import { useCartStore } from '@/stores/cart-store'
import { useLoading } from '@/providers/loading-provider'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { items, isLoading, fetchWishlist, removeItem } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()
  const { setIsLoading, setLoadingText } = useLoading()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchWishlist()
    }
  }, [status, router, fetchWishlist])

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeItem(productId)
      toast.success('Removed from wishlist')
    } catch (error) {
      toast.error('Failed to remove from wishlist')
    }
  }

  const handleAddToCart = async (product: any) => {
    setIsLoading(true)
    setLoadingText('Adding to cart...')

    try {
      await addToCart(product, 1)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Heart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8">Save your favorite protein supplements for later!</p>
            <Link href="/">
              <Button size="lg">
                Continue Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {/* Product Image */}
              <Link href={`/product/${item.product.slug}`}>
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={item.product.images[0] || '/placeholder-product.jpg'}
                    alt={item.product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2">
                  <p className="text-sm text-gray-600 font-medium">{item.product.brand}</p>
                  <Link href={`/product/${item.product.slug}`}>
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors line-clamp-2">
                      {item.product.name}
                    </h3>
                  </Link>
                </div>

                {/* Weight and Type */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {item.product.weight}
                  </span>
                  <span className="text-sm text-gray-600">
                    {item.product.type}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{item.product.price.toLocaleString()}
                    </span>
                    {item.product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {item.product.stock > 0 ? (
                    <span className="text-sm text-green-600 font-medium">In Stock</span>
                  ) : (
                    <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleAddToCart(item.product)}
                    disabled={item.product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveFromWishlist(item.product.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Added Date */}
                <p className="text-xs text-gray-500 mt-2">
                  Added {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button variant="outline" size="lg">
              Continue Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 