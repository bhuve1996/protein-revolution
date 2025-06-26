import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product/product-card'
import { prisma } from '@/lib/db'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: {
      slug,
      isActive: true
    },
    include: {
      category: true,
      reviews: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, id: true }
          }
        }
      }
    }
  })

  if (!product) {
    return null
  }

  // Get related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      id: { not: product.id }
    },
    take: 4,
    include: {
      category: true
    }
  })

  return { product, relatedProducts }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const data = await getProduct(slug)
  
  if (!data) {
    notFound()
  }

  const { product, relatedProducts } = data

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <span>/</span>
          <Link href={`/category/${product.category.slug}`} className="hover:text-red-600">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.images[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {product.images.length > 1 && (
                                 <div className="grid grid-cols-4 gap-4">
                   {product.images.slice(1).map((image: string, index: number) => (
                     <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                       <Image
                         src={image}
                         alt={`${product.name} view ${index + 2}`}
                         width={150}
                         height={150}
                         className="w-full h-full object-cover"
                       />
                     </div>
                   ))}
                 </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600 mb-4">{product.brand}</p>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-red-600">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <span className="text-gray-600">Weight:</span>
                    <span className="ml-2 font-medium">{product.weight}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-2 font-medium">{product.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Flavor:</span>
                    <span className="ml-2 font-medium">{product.flavor}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">In Stock:</span>
                    <span className={`ml-2 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      size="lg"
                      className="flex-1"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button size="lg" variant="outline">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="outline">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-1" />
                      Free shipping on orders ₹2,999+
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-1" />
                      100% Authentic
                    </div>
                    <div className="flex items-center">
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Easy returns
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description & Details */}
          <div className="mt-12 border-t pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                
                {product.ingredients && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Ingredients</h4>
                    <p className="text-sm text-gray-600">{product.ingredients}</p>
                  </div>
                )}
              </div>

              {product.nutritionFacts && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Nutrition Facts</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Serving Size:</span>
                        <span className="font-medium">{(product.nutritionFacts as any).servingSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Servings Per Container:</span>
                        <span className="font-medium">{(product.nutritionFacts as any).servingsPerContainer}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between">
                          <span>Calories:</span>
                          <span className="font-medium">{(product.nutritionFacts as any).calories}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Protein:</span>
                          <span className="font-medium">{(product.nutritionFacts as any).protein}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbs:</span>
                          <span className="font-medium">{(product.nutritionFacts as any).carbs}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fat:</span>
                          <span className="font-medium">{(product.nutritionFacts as any).fat}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          {product.reviews.length > 0 && (
            <div className="mt-12 border-t pt-8">
              <h3 className="text-xl font-semibold mb-6">Customer Reviews</h3>
                             <div className="space-y-6">
                 {product.reviews.map((review: any) => (
                   <div key={review.id} className="border-b pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{review.user.name}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-8">Related Products</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {relatedProducts.map((product: any) => (
                 <ProductCard key={product.id} product={product} />
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  )
} 