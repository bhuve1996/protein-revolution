import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import { ProductCard } from '@/components/product/product-card'

interface SearchPageProps {
  searchParams: { 
    q?: string
    sort?: string
    category?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    page?: string
  }
}

async function searchProducts(searchParams: any) {
  try {
    const query = searchParams.q || ''
    
    if (!query) {
      return {
        products: [],
        totalProducts: 0,
        categories: [],
        brands: [],
        currentPage: 1,
        totalPages: 0,
        query: ''
      }
    }

    // Build filter conditions
    const where: any = {
      isActive: true,
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          brand: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          category: {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          }
        }
      ]
    }

    if (searchParams.category) {
      where.category = {
        slug: searchParams.category
      }
    }

    if (searchParams.brand) {
      where.brand = {
        contains: searchParams.brand,
        mode: 'insensitive'
      }
    }

    if (searchParams.minPrice || searchParams.maxPrice) {
      where.price = {}
      if (searchParams.minPrice) {
        where.price.gte = parseFloat(searchParams.minPrice)
      }
      if (searchParams.maxPrice) {
        where.price.lte = parseFloat(searchParams.maxPrice)
      }
    }

    // Build sort conditions
    let orderBy: any = { createdAt: 'desc' }
    
    switch (searchParams.sort) {
      case 'price-low':
        orderBy = { price: 'asc' }
        break
      case 'price-high':
        orderBy = { price: 'desc' }
        break
      case 'name':
        orderBy = { name: 'asc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'rating':
        orderBy = { avgRating: 'desc' }
        break
    }

    const page = parseInt(searchParams.page || '1')
    const limit = 12
    const offset = (page - 1) * limit

    const [products, totalProducts, categories, brands] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true
        },
        orderBy,
        take: limit,
        skip: offset
      }),
      prisma.product.count({ where }),
      prisma.category.findMany(),
      prisma.product.findMany({
        where: { isActive: true },
        select: { brand: true },
        distinct: ['brand']
      })
    ])

    return {
      products,
      totalProducts,
      categories,
      brands: brands.map((b: any) => b.brand),
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      query
    }
  } catch (error) {
    console.error('Error searching products:', error)
    return {
      products: [],
      totalProducts: 0,
      categories: [],
      brands: [],
      currentPage: 1,
      totalPages: 0,
      query: searchParams.q || ''
    }
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const data = await searchProducts(searchParams)
  const { products, totalProducts, categories, brands, currentPage, totalPages, query } = data

  const buildUrl = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    
    // Keep existing params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && !newParams.hasOwnProperty(key)) {
        params.set(key, value)
      }
    })
    
    // Add new params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })
    
    return `/search?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Search Results</h1>
            {query ? (
              <>
                <p className="text-lg text-gray-600">Search results for: <strong>"{query}"</strong></p>
                <p className="text-sm text-gray-500 mt-2">{totalProducts} products found</p>
              </>
            ) : (
              <p className="text-lg text-gray-600">Enter a search term to find products</p>
            )}
          </div>
        </div>

        {query && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </h3>

                {/* Sort Options */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
                  <select
                    value={searchParams.sort || ''}
                    onChange={(e) => window.location.href = buildUrl({ sort: e.target.value, page: '1' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                    <option value="newest">Newest First</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value=""
                        checked={!searchParams.category}
                        onChange={(e) => window.location.href = buildUrl({ category: undefined, page: '1' })}
                        className="text-red-600"
                      />
                      <span className="ml-2 text-sm">All Categories</span>
                    </label>
                    {categories.map((category: any) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category.slug}
                          checked={searchParams.category === category.slug}
                          onChange={(e) => window.location.href = buildUrl({ category: e.target.value, page: '1' })}
                          className="text-red-600"
                        />
                        <span className="ml-2 text-sm">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Brand</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        value=""
                        checked={!searchParams.brand}
                        onChange={(e) => window.location.href = buildUrl({ brand: undefined, page: '1' })}
                        className="text-red-600"
                      />
                      <span className="ml-2 text-sm">All Brands</span>
                    </label>
                    {brands.slice(0, 10).map((brand: string) => (
                      <label key={brand} className="flex items-center">
                        <input
                          type="radio"
                          name="brand"
                          value={brand}
                          checked={searchParams.brand === brand}
                          onChange={(e) => window.location.href = buildUrl({ brand: e.target.value, page: '1' })}
                          className="text-red-600"
                        />
                        <span className="ml-2 text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={searchParams.minPrice || ''}
                        onChange={(e) => {
                          const timeout = setTimeout(() => {
                            window.location.href = buildUrl({ minPrice: e.target.value, page: '1' })
                          }, 1000)
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={searchParams.maxPrice || ''}
                        onChange={(e) => {
                          const timeout = setTimeout(() => {
                            window.location.href = buildUrl({ maxPrice: e.target.value, page: '1' })
                          }, 1000)
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <Link href={`/search?q=${query}`}>
                  <Button variant="outline" className="w-full">
                    Clear All Filters
                  </Button>
                </Link>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              {products.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search terms or filters.</p>
                  <Link href="/">
                    <Button>Browse All Products</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {products.map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                      {currentPage > 1 && (
                        <Link href={buildUrl({ page: String(currentPage - 1) })}>
                          <Button variant="outline">Previous</Button>
                        </Link>
                      )}
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Link key={page} href={buildUrl({ page: String(page) })}>
                          <Button
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                          >
                            {page}
                          </Button>
                        </Link>
                      ))}
                      
                      {currentPage < totalPages && (
                        <Link href={buildUrl({ page: String(currentPage + 1) })}>
                          <Button variant="outline">Next</Button>
                        </Link>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  
  return {
    title: query ? `Search: ${query} - The Protein Revolution` : 'Search - The Protein Revolution',
    description: query ? `Search results for "${query}" on The Protein Revolution` : 'Search for protein supplements and fitness products',
  }
} 