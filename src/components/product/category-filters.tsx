'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CategoryFiltersProps {
  searchParams: {
    sort?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    page?: string
  }
  brands: string[]
  categorySlug: string
}

export function CategoryFilters({ searchParams, brands, categorySlug }: CategoryFiltersProps) {
  const router = useRouter()

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
    
    return `/categories/${categorySlug}?${params.toString()}`
  }

  const handleSortChange = (sort: string) => {
    router.push(buildUrl({ sort, page: '1' }))
  }

  const handleBrandChange = (brand: string | undefined) => {
    router.push(buildUrl({ brand, page: '1' }))
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const params = type === 'min' 
      ? { minPrice: value, page: '1' }
      : { maxPrice: value, page: '1' }
    
    const timeout = setTimeout(() => {
      router.push(buildUrl(params))
    }, 1000)
  }

  return (
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
          onChange={(e) => handleSortChange(e.target.value)}
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
              checked={!searchParams.brand}
              onChange={() => handleBrandChange(undefined)}
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
                checked={searchParams.brand === brand}
                onChange={() => handleBrandChange(brand)}
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
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Max Price"
              value={searchParams.maxPrice || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <Link href={`/categories/${categorySlug}`}>
        <Button variant="outline" className="w-full">
          Clear All Filters
        </Button>
      </Link>
    </div>
  )
} 