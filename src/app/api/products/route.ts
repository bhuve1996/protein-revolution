import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface ProductsQuery {
  search?: string
  category?: string
  brand?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  page?: string
  limit?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query: ProductsQuery = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      brand: searchParams.get('brand') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      sort: searchParams.get('sort') || 'name',
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '12'
    }

    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const category = query.category
    const brand = query.brand
    const minPrice = query.minPrice
    const maxPrice = query.maxPrice
    const type = searchParams.get('type')
    const search = query.search

    const skip = (page - 1) * limit

    // Build where clause
    const whereClause: Record<string, unknown> = {
      isActive: true
    }

    if (category) {
      whereClause.category = {
        slug: category
      }
    }

    if (brand) {
      whereClause.brand = {
        contains: brand,
        mode: 'insensitive'
      }
    }

    if (type) {
      whereClause.type = {
        contains: type,
        mode: 'insensitive'
      }
    }

    if (minPrice || maxPrice) {
      whereClause.price = {}
      if (minPrice) whereClause.price.gte = parseFloat(minPrice)
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice)
    }

    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          brand: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

    // Build orderBy clause
    const orderBy: Record<string, string> = {}
    switch (query.sort) {
      case 'price-asc':
        orderBy.price = 'asc'
        break
      case 'price-desc':
        orderBy.price = 'desc'
        break
      case 'name':
        orderBy.name = 'asc'
        break
      case 'newest':
        orderBy.createdAt = 'desc'
        break
      default:
        orderBy.name = 'asc'
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: true,
          reviews: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: { name: true, id: true }
              }
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.product.count({ where: whereClause })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
} 