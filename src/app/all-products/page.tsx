import React from 'react'
import Link from 'next/link'
import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import { ProductCard } from '@/components/product/product-card'
import { ProductFilters } from '@/components/product/product-filters'
import { Product } from '@/types'

interface AllProductsPageProps {
  searchParams: Promise<{ 
    sort?: string
    category?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    page?: string
  }>
}

interface WhereClause {
  isActive: boolean
  category?: {
    slug: string
  }
  brand?: {
    contains: string
    mode: 'insensitive'
  }
  price?: {
    gte?: number
    lte?: number
  }
}

async function getAllProducts(searchParams: { 
  sort?: string
  category?: string
  brand?: string
  minPrice?: string
  maxPrice?: string
  page?: string
}) {
  try {
    // Build filter conditions
    const where: WhereClause = {
      isActive: true
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
    let orderBy: Record<string, string> = { createdAt: 'desc' }
    
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
    }

    const page = parseInt(searchParams.page || '1')
    const limit = 15
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
      brands: brands.map((b: { brand: string }) => b.brand),
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit)
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      products: [],
      totalProducts: 0,
      categories: [],
      brands: [],
      currentPage: 1,
      totalPages: 0
    }
  }
}

export default async function AllProductsPage({ searchParams }: AllProductsPageProps) {
  const resolvedSearchParams = await searchParams
  const data = await getAllProducts(resolvedSearchParams)
  const { products, totalProducts, categories, brands, currentPage, totalPages } = data

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
    
    return `/all-products?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">All Products</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our complete collection of premium protein supplements and fitness products
            </p>
            <p className="text-sm text-gray-500 mt-2">{totalProducts} products available</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <ProductFilters 
              searchParams={resolvedSearchParams}
              categories={categories}
              brands={brands}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
                <Link href="/all-products">
                  <Button>Clear Filters</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product as unknown as Product} />
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
                    
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                      return (
                        <Link key={page} href={buildUrl({ page: String(page) })}>
                          <Button
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                          >
                            {page}
                          </Button>
                        </Link>
                      )
                    })}
                    
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
      </div>
    </div>
  )
}

export async function generateMetadata() {
  return {
    title: 'All Products - The Protein Revolution',
    description: 'Browse our complete collection of premium protein supplements, mass gainers, and fitness products. Find the perfect nutrition to fuel your fitness journey.',
  }
} 