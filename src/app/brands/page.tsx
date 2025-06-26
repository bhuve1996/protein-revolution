import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Brand {
  id: number
  name: string
  products: number
}

async function getBrands(): Promise<Brand[]> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/brands`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch brands')
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching brands:', error)
    return []
  }
}

export default async function BrandsPage() {
  const brands = await getBrands()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Premium Protein Brands
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            Discover the world's most trusted and innovative sports nutrition brands, 
            carefully selected for quality and effectiveness.
          </p>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="container mx-auto px-4 py-12">
        {brands.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No brands available at the moment.</p>
            <Link href="/all-products">
              <Button className="mt-4 bg-red-600 hover:bg-red-700">
                Shop All Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brands.map((brand) => (
              <Card key={brand.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-600">
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-red-600 transition-colors">
                    {brand.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Sports Nutrition Brand
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Premium quality supplements and nutrition products from {brand.name}.
                  </p>
                  
                  <div className="flex justify-center items-center text-sm">
                    <div>
                      <span className="font-semibold text-red-600">
                        {brand.products}
                      </span>
                      <span className="text-gray-600 ml-1">Products Available</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Link href={`/search?brand=${encodeURIComponent(brand.name.toLowerCase())}`} className="w-full">
                    <Button className="w-full group-hover:bg-red-700 transition-colors">
                      View Products
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Can't Find Your Favorite Brand?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            We're constantly expanding our catalog with new and exciting brands. 
            Let us know which brands you'd like to see on our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
              Request a Brand
            </Button>
            <Link href="/all-products">
              <Button className="bg-red-600 hover:bg-red-700">
                Shop All Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 