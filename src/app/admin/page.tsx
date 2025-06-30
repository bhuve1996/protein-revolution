'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Eye, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminWrapper } from '@/components/admin/admin-wrapper'

interface AdminStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  recentOrders: any[]
  lowStockProducts: any[]
  monthlyRevenue: any[]
  categoryStats: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      setLoading(true)
      // For now, we'll create mock data since we don't have the admin stats API
      // You can replace this with an actual API call later
      const mockStats: AdminStats = {
        totalProducts: 25,
        totalOrders: 150,
        totalUsers: 75,
        totalRevenue: 125000,
        recentOrders: [
          { id: '1', orderNumber: 'ORD-001', user: { name: 'John Doe' }, total: 2999, status: 'DELIVERED', createdAt: new Date().toISOString() },
          { id: '2', orderNumber: 'ORD-002', user: { name: 'Jane Smith' }, total: 4599, status: 'SHIPPED', createdAt: new Date().toISOString() },
          { id: '3', orderNumber: 'ORD-003', user: { name: 'Bob Johnson' }, total: 1999, status: 'PROCESSING', createdAt: new Date().toISOString() },
        ],
        lowStockProducts: [
          { id: '1', name: 'Optimum Nutrition Gold Standard', stock: 2 },
          { id: '2', name: 'MuscleBlaze Whey Protein', stock: 1 },
          { id: '3', name: 'Dymatize Elite Whey', stock: 3 },
        ],
        monthlyRevenue: [
          { month: 'Dec 2024', revenue: 15000, orders: 25 },
          { month: 'Nov 2024', revenue: 12000, orders: 20 },
          { month: 'Oct 2024', revenue: 18000, orders: 30 },
          { month: 'Sep 2024', revenue: 16000, orders: 28 },
        ],
        categoryStats: [
          { name: 'Whey Protein', value: 12 },
          { name: 'Mass Gainer', value: 8 },
          { name: 'Isolate', value: 5 },
        ]
      }
      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, Admin</p>
            </div>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Monthly Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
              <div className="space-y-4">
                {stats.monthlyRevenue.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{item.month}</span>
                    <div className="text-right">
                      <div className="font-bold text-green-600">₹{item.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{item.orders} orders</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Products by Category</h3>
              <div className="space-y-3">
                {stats.categoryStats.map((category: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{category.name}</span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-bold">
                      {category.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Orders</h3>
                <Link href="/admin/orders">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {stats.recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">#{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{order.user.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{order.total.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Low Stock Alert</h3>
                <Link href="/admin/products">
                  <Button variant="outline" size="sm">
                    <Package className="h-4 w-4 mr-2" />
                    Manage Inventory
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {stats.lowStockProducts.map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.stock === 0 ? 'bg-red-100 text-red-800' :
                      product.stock <= 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.stock} left
                    </span>
                  </div>
                ))}
                {stats.lowStockProducts.length === 0 && (
                  <p className="text-gray-500 text-center py-4">All products are well stocked!</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/products">
                <Button variant="outline" className="w-full">
                  <Package className="h-4 w-4 mr-2" />
                  Manage Products
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="outline" className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Orders
                </Button>
              </Link>
              <Link href="/admin/products/new">
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  View Users
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminWrapper>
  )
} 