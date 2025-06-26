import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!q || q.trim().length === 0) {
      return NextResponse.json([])
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          {
            name: {
              contains: q,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: q,
              mode: 'insensitive'
            }
          },
          {
            brand: {
              contains: q,
              mode: 'insensitive'
            }
          },
          {
            type: {
              contains: q,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        category: true
      },
      orderBy: [
        { isFeatured: 'desc' },
        { rating: 'desc' },
        { reviewCount: 'desc' }
      ],
      take: limit
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error searching products:', error)
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    )
  }
} 