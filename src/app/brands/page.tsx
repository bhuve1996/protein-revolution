import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const brands = [
  {
    id: 1,
    name: 'Optimum Nutrition',
    description: 'World-renowned for premium whey protein and sports nutrition supplements.',
    logo: '/brands/on-logo.jpg',
    products: 45,
    established: '1986',
    speciality: 'Whey Protein, Pre-workout'
  },
  {
    id: 2,
    name: 'Dymatize',
    description: 'Science-driven nutrition with superior quality and taste.',
    logo: '/brands/dymatize-logo.jpg',
    products: 32,
    established: '1994',
    speciality: 'ISO100, Protein Powder'
  },
  {
    id: 3,
    name: 'MuscleTech',
    description: 'Cutting-edge research and superior ingredients for maximum results.',
    logo: '/brands/muscletech-logo.jpg',
    products: 28,
    established: '1995',
    speciality: 'Mass Gainer, Creatine'
  },
  {
    id: 4,
    name: 'BSN',
    description: 'Innovative supplements designed to help you achieve your fitness goals.',
    logo: '/brands/bsn-logo.jpg',
    products: 24,
    established: '2001',
    speciality: 'SYNTHA-6, Pre-workout'
  },
  {
    id: 5,
    name: 'Rule 1',
    description: 'Clean, premium ingredients with no artificial fillers or additives.',
    logo: '/brands/rule1-logo.jpg',
    products: 18,
    established: '2009',
    speciality: 'Clean Protein, Isolate'
  },
  {
    id: 6,
    name: 'MuscleBlaze',
    description: 'India's leading sports nutrition brand with scientifically backed formulations.',
    logo: '/brands/muscleblaze-logo.jpg',
    products: 52,
    established: '2012',
    speciality: 'Indian Formulations, Mass Gainer'
  },
  {
    id: 7,
    name: 'Ultimate Nutrition',
    description: 'High-quality supplements for serious athletes and fitness enthusiasts.',
    logo: '/brands/ultimate-logo.jpg',
    products: 35,
    established: '1979',
    speciality: 'Prostar Whey, Amino Acids'
  },
  {
    id: 8,
    name: 'Cellucor',
    description: 'Premium sports nutrition supplements with clinically studied ingredients.',
    logo: '/brands/cellucor-logo.jpg',
    products: 26,
    established: '2002',
    speciality: 'C4 Pre-workout, Whey Sport'
  }
]

export default function BrandsPage() {
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
                  Est. {brand.established}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {brand.description}
                </p>
                
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-semibold text-red-600">
                      {brand.products}
                    </span>
                    <span className="text-gray-600 ml-1">Products</span>
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Speciality:</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700 font-medium">
                    {brand.speciality}
                  </p>
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