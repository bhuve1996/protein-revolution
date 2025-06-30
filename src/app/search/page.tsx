import React from 'react'
import Link from 'next/link'
import { Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import { ProductCard } from '@/components/product/product-card'
import SearchFilters from '@/components/product/search-filters'

interface SearchPageProps {
  searchParams: Promise<{ 
    q?: string
    sort?: string
    category?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    page?: string
  }>
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
  const resolvedSearchParams = await searchParams
  const data = await searchProducts(resolvedSearchParams)
  const { products, totalProducts, categories, brands, currentPage, totalPages, query } = data

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
              <SearchFilters 
                searchParams={resolvedSearchParams}
                categories={categories}
                brands={brands}
                buildUrl={buildUrl}
                query={query}
              />
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              {products.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn&apos;t find any products matching &quot;{query}&quot;. Try different keywords or browse our categories.
                  </p>
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
  const resolvedParams = await searchParams
  const query = resolvedParams.q || ''
  
  return {
    title: query ? `Search: ${query} - The Protein Revolution` : 'Search - The Protein Revolution',
    description: query ? `Search results for "${query}" on The Protein Revolution` : 'Search for protein supplements and fitness products',
  }
} 