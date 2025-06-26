import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import { ProductCard } from '@/components/product/product-card'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ 
    sort?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    page?: string
  }>
}

async function getCategoryWithProducts(slug: string, searchParams: any) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug }
    })

    if (!category) {
      return null
    }

    // Build filter conditions
    const where: any = {
      categoryId: category.id,
      isActive: true
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

    const [products, totalProducts, brands] = await Promise.all([
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
      prisma.product.findMany({
        where: { categoryId: category.id, isActive: true },
        select: { brand: true },
        distinct: ['brand']
      })
    ])

    return {
      category,
      products,
      totalProducts,
             brands: brands.map((b: any) => b.brand),
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit)
    }
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const data = await getCategoryWithProducts(resolvedParams.slug, resolvedSearchParams)

  if (!data) {
    notFound()
  }

  const { category, products, totalProducts, brands, currentPage, totalPages } = data

  const buildUrl = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    
    // Keep existing params
    Object.entries(resolvedSearchParams).forEach(([key, value]) => {
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
    
    return `/categories/${category.slug}?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{category.description}</p>
            <p className="text-sm text-gray-500 mt-2">{totalProducts} products available</p>
          </div>
        </div>

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
                  value={resolvedSearchParams.sort || ''}
                  onChange={(e) => window.location.href = buildUrl({ sort: e.target.value, page: '1' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rated</option>
                </select>
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
                      checked={!resolvedSearchParams.brand}
                      onChange={(e) => window.location.href = buildUrl({ brand: undefined, page: '1' })}
                      className="text-red-600"
                    />
                    <span className="ml-2 text-sm">All Brands</span>
                  </label>
                                     {brands.map((brand: string) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        value={brand}
                        checked={resolvedSearchParams.brand === brand}
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
                      value={resolvedSearchParams.minPrice || ''}
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
                      value={resolvedSearchParams.maxPrice || ''}
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
              <Link href={`/categories/${category.slug}`}>
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
                <Link href={`/categories/${category.slug}`}>
                  <Button>Clear Filters</Button>
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
                    <button
                      onClick={() => {
                        window.location.href = buildUrl({ page: String(Math.max(1, currentPage - 1)) })
                      }}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
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
                    
                    <button
                      onClick={() => {
                        window.location.href = buildUrl({ page: String(Math.min(totalPages, currentPage + 1)) })
                      }}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await prisma.category.findUnique({
    where: { slug }
  })

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.name} - The Protein Revolution`,
    description: category.description,
  }
} 