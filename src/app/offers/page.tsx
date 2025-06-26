import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Gift, Percent, Star, Zap } from 'lucide-react'

const offers = [
  {
    id: 1,
    title: 'Mega Sale - Up to 50% Off',
    description: 'Biggest sale of the year on all premium protein supplements',
    discount: '50%',
    code: 'MEGA50',
    validUntil: '2024-12-31',
    image: '/offers/mega-sale.jpg',
    type: 'limited',
    products: ['Whey Protein', 'Mass Gainer', 'Isolate'],
    minOrder: 2999
  },
  {
    id: 2,
    title: 'Buy 2 Get 1 Free',
    description: 'Mix and match any three products from our premium collection',
    discount: '33%',
    code: 'BUY2GET1',
    validUntil: '2024-12-25',
    image: '/offers/buy2get1.jpg',
    type: 'combo',
    products: ['All Categories'],
    minOrder: 4999
  },
  {
    id: 3,
    title: 'First Order Special',
    description: 'New customers get extra 25% off on their first purchase',
    discount: '25%',
    code: 'WELCOME25',
    validUntil: '2024-12-30',
    image: '/offers/welcome.jpg',
    type: 'new-customer',
    products: ['All Products'],
    minOrder: 1999
  },
  {
    id: 4,
    title: 'Free Shipping Weekend',
    description: 'Free shipping on all orders, no minimum purchase required',
    discount: 'Free Shipping',
    code: 'FREESHIP',
    validUntil: '2024-12-15',
    image: '/offers/free-shipping.jpg',
    type: 'shipping',
    products: ['All Orders'],
    minOrder: 0
  },
  {
    id: 5,
    title: 'Premium Brand Combo',
    description: 'Special pricing on Optimum Nutrition and Dymatize combo packs',
    discount: '40%',
    code: 'PREMIUM40',
    validUntil: '2024-12-20',
    image: '/offers/premium-combo.jpg',
    type: 'brand',
    products: ['ON', 'Dymatize'],
    minOrder: 3999
  },
  {
    id: 6,
    title: 'Student Discount',
    description: 'Students get 20% off with valid student ID verification',
    discount: '20%',
    code: 'STUDENT20',
    validUntil: '2025-06-30',
    image: '/offers/student.jpg',
    type: 'student',
    products: ['All Products'],
    minOrder: 1499
  }
]

const getOfferTypeIcon = (type: string) => {
  switch (type) {
    case 'limited':
      return <Zap className="h-5 w-5" />
    case 'combo':
      return <Gift className="h-5 w-5" />
    case 'new-customer':
      return <Star className="h-5 w-5" />
    case 'shipping':
      return <Clock className="h-5 w-5" />
    case 'brand':
      return <Percent className="h-5 w-5" />
    case 'student':
      return <Star className="h-5 w-5" />
    default:
      return <Percent className="h-5 w-5" />
  }
}

const getOfferTypeColor = (type: string) => {
  switch (type) {
    case 'limited':
      return 'bg-red-100 text-red-800'
    case 'combo':
      return 'bg-green-100 text-green-800'
    case 'new-customer':
      return 'bg-blue-100 text-blue-800'
    case 'shipping':
      return 'bg-purple-100 text-purple-800'
    case 'brand':
      return 'bg-orange-100 text-orange-800'
    case 'student':
      return 'bg-pink-100 text-pink-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getDaysLeft = (validUntil: string) => {
  const today = new Date()
  const endDate = new Date(validUntil)
  const diffTime = endDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🔥 Hot Deals & Offers
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            Don't miss out on these incredible deals! Save big on your favorite 
            protein supplements with our exclusive offers.
          </p>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => {
            const daysLeft = getDaysLeft(offer.validUntil)
            
            return (
              <Card key={offer.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <CardHeader className="relative">
                  {/* Offer Type Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className={`${getOfferTypeColor(offer.type)} flex items-center gap-1`}>
                      {getOfferTypeIcon(offer.type)}
                      {offer.type.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  {/* Mock Image Background */}
                  <div className="w-full h-40 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-white text-6xl font-bold opacity-20">
                      {offer.discount}
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl group-hover:text-red-600 transition-colors">
                    {offer.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {offer.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Discount & Code */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl font-bold text-red-600">
                        {offer.discount}
                      </span>
                      <span className="text-sm text-gray-600">
                        Code: <span className="font-mono font-bold">{offer.code}</span>
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Min. order: ₹{offer.minOrder.toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Validity & Products */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Valid for:</span>
                      <span className="font-medium">{offer.products.join(', ')}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Expires:</span>
                      <div className="text-right">
                        <div className="font-medium">
                          {new Date(offer.validUntil).toLocaleDateString()}
                        </div>
                        {daysLeft > 0 && (
                          <div className={`text-xs ${daysLeft <= 3 ? 'text-red-600' : 'text-orange-600'}`}>
                            {daysLeft} days left
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                  >
                    Copy Code
                  </Button>
                  <Link href="/all-products" className="flex-1">
                    <Button size="sm" className="w-full">
                      Shop Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Never Miss a Deal!
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about exclusive offers, 
            flash sales, and new product launches.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900"
            />
            <Button className="bg-red-600 hover:bg-red-700">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 