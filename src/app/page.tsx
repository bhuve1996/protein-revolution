import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Truck, Shield, Headphones, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product/product-card'

// Mock data for demonstration
const featuredProducts = [
  {
    id: '1',
    name: 'Optimum Nutrition Gold Standard Whey',
    slug: 'optimum-nutrition-gold-standard-whey',
    description: 'The gold standard in whey protein with 24g protein per serving',
    price: 3299,
    originalPrice: 3999,
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
    brand: 'Optimum Nutrition',
    category: { id: '1', name: 'Whey Protein', slug: 'whey-protein', createdAt: new Date(), updatedAt: new Date() },
    categoryId: '1',
    type: 'Whey Isolate',
    weight: '2lbs',
    flavor: 'Double Rich Chocolate',
    stock: 15,
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 245,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'MuscleBlaze Biozyme Whey Protein',
    slug: 'muscleblaze-biozyme-whey-protein',
    description: 'Enhanced absorption whey protein with digestive enzymes',
    price: 2899,
    originalPrice: 3299,
    images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400'],
    brand: 'MuscleBlaze',
    category: { id: '1', name: 'Whey Protein', slug: 'whey-protein', createdAt: new Date(), updatedAt: new Date() },
    categoryId: '1',
    type: 'Whey Concentrate',
    weight: '1kg',
    flavor: 'Rich Milk Chocolate',
    stock: 8,
    isActive: true,
    isFeatured: true,
    rating: 4.6,
    reviewCount: 189,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Dymatize Elite 100% Whey',
    slug: 'dymatize-elite-100-whey',
    description: 'Fast-absorbing whey protein for post-workout recovery',
    price: 5999,
    originalPrice: 6999,
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
    brand: 'Dymatize',
    category: { id: '1', name: 'Whey Protein', slug: 'whey-protein', createdAt: new Date(), updatedAt: new Date() },
    categoryId: '1',
    type: 'Whey Isolate',
    weight: '5lbs',
    flavor: 'Vanilla',
    stock: 12,
    isActive: true,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 156,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Labrada Muscle Mass Gainer',
    slug: 'labrada-muscle-mass-gainer',
    description: 'High-calorie mass gainer for lean muscle building',
    price: 3999,
    originalPrice: 4499,
    images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400'],
    brand: 'Labrada',
    category: { id: '2', name: 'Mass Gainer', slug: 'mass-gainer', createdAt: new Date(), updatedAt: new Date() },
    categoryId: '2',
    type: 'Mass Gainer',
    weight: '6lbs',
    flavor: 'Chocolate',
    stock: 5,
    isActive: true,
    isFeatured: true,
    rating: 4.5,
    reviewCount: 98,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const categories = [
  {
    name: 'Whey Protein',
    slug: 'whey-protein',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
    description: 'Fast-absorbing protein for muscle building',
    productCount: 25
  },
  {
    name: 'Mass Gainer',
    slug: 'mass-gainer',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300',
    description: 'High-calorie supplements for weight gain',
    productCount: 12
  },
  {
    name: 'Isolate',
    slug: 'isolate',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
    description: 'Pure protein with minimal carbs and fat',
    productCount: 18
  },
  {
    name: 'Pre-Workout',
    slug: 'pre-workout',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300',
    description: 'Energy boosters for intense workouts',
    productCount: 15
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Fuel Your
                <span className="block text-yellow-400">Revolution</span>
              </h1>
              <p className="text-xl mb-8 text-red-100">
                Premium quality protein supplements to transform your fitness journey. 
                Trusted by athletes and fitness enthusiasts worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/all-products">
                  <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/all-products">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                    View Products
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600"
                alt="Protein Supplements"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders above ₹2,999</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">100% Authentic</h3>
              <p className="text-gray-600">Guaranteed genuine products</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Expert customer service</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Best Quality</h3>
              <p className="text-gray-600">Premium international brands</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect supplement for your fitness goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-3">{category.description}</p>
                    <p className="text-sm text-red-600 font-medium">
                      {category.productCount} Products
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Our most popular and highly-rated supplements
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/all-products">
              <Button size="lg" variant="outline">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Get exclusive deals, fitness tips, and new product announcements
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
