import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Get unique brands with product counts from the products table
    const brandsData = await prisma.product.groupBy({
      by: ['brand'],
      where: {
        isActive: true
      },
      _count: {
        brand: true
      },
      orderBy: {
        _count: {
          brand: 'desc'
        }
      }
    })

    // Transform the data to include brand names and product counts
    const brands = brandsData.map((item, index) => ({
      id: index + 1,
      name: item.brand,
      products: item._count.brand,
      // For now, we'll keep the search functionality but remove static descriptions
      // These could be moved to a separate Brand model in the future
    }))

    return NextResponse.json(brands)
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
} 