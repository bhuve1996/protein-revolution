'use client'

import React from 'react'
import Link from 'next/link'
import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SearchFiltersProps {
  searchParams: any
  categories: any[]
  brands: string[]
  buildUrl: (newParams: Record<string, string | undefined>) => string
  query: string
}

export default function SearchFilters({ 
  searchParams, 
  categories, 
  brands, 
  buildUrl, 
  query 
}: SearchFiltersProps) {
  const handleNavigation = (url: string) => {
    window.location.href = url
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
          onChange={(e) => handleNavigation(buildUrl({ sort: e.target.value, page: '1' }))}
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
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="category"
              value=""
              checked={!searchParams.category}
              onChange={() => handleNavigation(buildUrl({ category: undefined, page: '1' }))}
              className="text-red-600"
            />
            <span className="ml-2 text-sm">All Categories</span>
          </label>
          {categories.map((category: any) => (
            <label key={category.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.slug}
                checked={searchParams.category === category.slug}
                onChange={() => handleNavigation(buildUrl({ category: category.slug, page: '1' }))}
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
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="brand"
              value=""
              checked={!searchParams.brand}
              onChange={() => handleNavigation(buildUrl({ brand: undefined, page: '1' }))}
              className="text-red-600"
            />
            <span className="ml-2 text-sm">All Brands</span>
          </label>
          {brands.slice(0, 10).map((brand: string) => (
            <label key={brand} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="brand"
                value={brand}
                checked={searchParams.brand === brand}
                onChange={() => handleNavigation(buildUrl({ brand: brand, page: '1' }))}
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
              defaultValue={searchParams.minPrice || ''}
              onBlur={(e) => {
                if (e.target.value !== searchParams.minPrice) {
                  handleNavigation(buildUrl({ minPrice: e.target.value || undefined, page: '1' }))
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNavigation(buildUrl({ minPrice: e.currentTarget.value || undefined, page: '1' }))
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Max Price"
              defaultValue={searchParams.maxPrice || ''}
              onBlur={(e) => {
                if (e.target.value !== searchParams.maxPrice) {
                  handleNavigation(buildUrl({ maxPrice: e.target.value || undefined, page: '1' }))
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNavigation(buildUrl({ maxPrice: e.currentTarget.value || undefined, page: '1' }))
                }
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
  )
} 