'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter, Plus, Edit, Trash2, Eye, Package } from 'lucide-react'
import { AdminWrapper } from '@/components/admin/admin-wrapper'

interface Product {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  stock: number
  isActive: boolean
  isFeatured: boolean
  category: { name: string }
  createdAt: string
}

// Custom hook for debouncing
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
  // Debounce search term to prevent too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      if (debouncedSearchTerm) queryParams.append('search', debouncedSearchTerm)
      if (categoryFilter) queryParams.append('category', categoryFilter)
      if (statusFilter) queryParams.append('status', statusFilter)
      
      const response = await fetch(`/api/products?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearchTerm, categoryFilter, statusFilter])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Force immediate search on Enter key
      fetchProducts()
    }
  }

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (response.ok) {
        setProducts(products.map(product => 
          product.id === productId ? { ...product, isActive: !currentStatus } : product
        ))
      }
    } catch (error) {
      console.error('Error updating product status:', error)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setProducts(products.filter(product => product.id !== productId))
        }
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' }
    if (stock <= 5) return { text: 'Low Stock', color: 'bg-orange-100 text-orange-800' }
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' }
  }

  if (loading && products.length === 0) {
    return (
      <AdminWrapper>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
        </div>
      </AdminWrapper>
    )
  }

  return (
    <AdminWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
              <p className="text-gray-600">Manage your product inventory</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/admin/products/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <Input
                  placeholder="Search products... (Type and wait or press Enter)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="pl-10"
                />
                {loading && debouncedSearchTerm && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  </div>
                )}
              </div>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Categories</option>
                <option value="whey-protein">Whey Protein</option>
                <option value="mass-gainer">Mass Gainer</option>
                <option value="isolate">Isolate</option>
                <option value="pre-workout">Pre-Workout</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="featured">Featured</option>
                <option value="low-stock">Low Stock</option>
              </select>

              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {products.length} products found
                </span>
              </div>
            </div>
            
            {/* Search Info */}
            <div className="mt-4 text-sm text-gray-500">
              {debouncedSearchTerm && (
                <p>Searching for: <strong>{debouncedSearchTerm}</strong></p>
              )}
              <p className="text-xs mt-1">
                💡 Tip: Search automatically after you stop typing for 0.5 seconds, or press Enter for immediate search
              </p>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock)
              
              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                    {product.isFeatured && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                          Featured
                        </span>
                      </div>
                    )}
                    {!product.isActive && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">
                          Inactive
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-gray-600">{product.brand}</p>
                      <p className="text-xs text-gray-500">{product.category.name}</p>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-red-600">₹{product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-gray-500 line-through ml-1">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Stock: {product.stock} units
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => toggleProductStatus(product.id, product.isActive)}
                            className={`text-xs px-2 py-1 rounded ${
                              product.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {product.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </div>
                        
                                                 <div className="flex items-center space-x-1">
                           <Link href={`/admin/products/${product.id}/view`}>
                             <button className="p-1 text-gray-400 hover:text-blue-600">
                               <Eye className="h-4 w-4" />
                             </button>
                           </Link>
                           <Link href={`/admin/products/${product.id}/edit`}>
                             <button className="p-1 text-gray-400 hover:text-green-600">
                               <Edit className="h-4 w-4" />
                             </button>
                           </Link>
                           <button 
                             onClick={() => deleteProduct(product.id)}
                             className="p-1 text-gray-400 hover:text-red-600"
                           >
                             <Trash2 className="h-4 w-4" />
                           </button>
                         </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first product to the inventory.</p>
              <Link href="/admin/products/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminWrapper>
  )
} 