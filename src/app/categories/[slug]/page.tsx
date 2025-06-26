import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import { ProductCard } from '@/components/product/product-card'
import { CategoryFilters } from '@/components/product/category-filters'
import { CategoryPagination } from '@/components/product/category-pagination'

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
            <CategoryFilters 
              searchParams={resolvedSearchParams}
              brands={brands}
              categorySlug={category.slug}
            />
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
                <CategoryPagination 
                  searchParams={resolvedSearchParams}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  categorySlug={category.slug}
                />
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