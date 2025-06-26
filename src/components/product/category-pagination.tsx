'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface CategoryPaginationProps {
  searchParams: {
    sort?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    page?: string
  }
  currentPage: number
  totalPages: number
  categorySlug: string
}

export function CategoryPagination({ searchParams, currentPage, totalPages, categorySlug }: CategoryPaginationProps) {
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

  const handlePageChange = (page: number) => {
    router.push(buildUrl({ page: String(page) }))
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center space-x-2">
      <button
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  )
} 