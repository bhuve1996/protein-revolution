'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Package, Star, Users } from 'lucide-react'
import { AdminWrapper } from '@/components/admin/admin-wrapper'

export default function ViewProductPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      // Mock product data for now
      const mockProduct = {
        id: productId,
        name: 'Optimum Nutrition Gold Standard 100% Whey',
        description: 'Gold Standard 100% Whey delivers 24g of whey protein to support muscle building recovery with 5.5g of naturally occurring BCAAs.',
        price: 2999,
        originalPrice: 3499,
        brand: 'Optimum Nutrition',
        category: { name: 'Whey Protein' },
        type: 'Whey Isolate',
        weight: '2lbs',
        flavor: 'Double Rich Chocolate',
        stock: 25,
        isActive: true,
        isFeatured: true,
        images: ['/placeholder-product.jpg'],
        ingredients: 'Whey protein isolate, whey protein concentrate, cocoa powder, natural flavors, lecithin, acesulfame potassium, sucralose',
        nutritionFacts: {
          servingSize: '30g',
          servingsPerContainer: '30',
          calories: '120',
          protein: '24g',
          carbs: '3g',
          fat: '1g'
        },
        reviews: {
          average: 4.5,
          count: 1250
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setProduct(mockProduct)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' }
    if (stock <= 5) return { text: 'Low Stock', color: 'bg-orange-100 text-orange-800' }
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' }
  }

  if (loading) {
    return (
      <AdminWrapper>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
        </div>
      </AdminWrapper>
    )
  }

  if (!product) {
    return (
      <AdminWrapper>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
            <Link href="/admin/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </div>
      </AdminWrapper>
    )
  }

  const stockStatus = getStockStatus(product.stock)

  return (
    <AdminWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/admin/products">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
                <p className="text-gray-600">View product information</p>
              </div>
            </div>
            <Link href={`/admin/products/${productId}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Product Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {product.isFeatured && (
                        <Badge className="bg-red-100 text-red-800">Featured</Badge>
                      )}
                      <Badge className={product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{product.brand} • {product.category.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <span className="text-sm text-gray-500">Type</span>
                      <p className="font-medium">{product.type}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Weight</span>
                      <p className="font-medium">{product.weight}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Flavor</span>
                      <p className="font-medium">{product.flavor}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Stock</span>
                      <p className="font-medium">
                        <span className={`px-2 py-1 rounded-full text-xs ${stockStatus.color}`}>
                          {product.stock} units
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Pricing</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Current Price:</span>
                          <span className="font-bold text-red-600">₹{product.price.toLocaleString()}</span>
                        </div>
                        {product.originalPrice && (
                          <div className="flex justify-between">
                            <span>Original Price:</span>
                            <span className="line-through text-gray-500">₹{product.originalPrice.toLocaleString()}</span>
                          </div>
                        )}
                        {product.originalPrice && (
                          <div className="flex justify-between">
                            <span>Discount:</span>
                            <span className="text-green-600 font-semibold">
                              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Reviews</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < Math.floor(product.reviews.average) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="font-semibold">{product.reviews.average}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{product.reviews.count.toLocaleString()} reviews</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ingredients */}
              {product.ingredients && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ingredients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{product.ingredients}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Product Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={product.images[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Nutrition Facts */}
              {product.nutritionFacts && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nutrition Facts</CardTitle>
                    <CardDescription>Per serving ({product.nutritionFacts.servingSize})</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Servings per container:</span>
                        <span className="font-medium">{product.nutritionFacts.servingsPerContainer}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span>Calories:</span>
                        <span className="font-medium">{product.nutritionFacts.calories}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span className="font-medium">{product.nutritionFacts.protein}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbohydrates:</span>
                        <span className="font-medium">{product.nutritionFacts.carbs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fat:</span>
                        <span className="font-medium">{product.nutritionFacts.fat}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Product Meta */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Product ID</span>
                    <p className="font-mono text-sm">{product.id}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Created</span>
                    <p className="text-sm">{new Date(product.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Last Updated</span>
                    <p className="text-sm">{new Date(product.updatedAt).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminWrapper>
  )
} 