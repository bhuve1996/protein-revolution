import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Mock orders data
const orders = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 4299,
    items: [
      { name: 'Optimum Nutrition Gold Standard Whey', quantity: 2, price: 1999 },
      { name: 'ON Micronized Creatine', quantity: 1, price: 899 }
    ],
    trackingNumber: 'TPR123456789',
    deliveredDate: '2024-01-18'
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-20',
    status: 'shipped',
    total: 3599,
    items: [
      { name: 'Dymatize ISO100 Hydrolyzed', quantity: 1, price: 3599 }
    ],
    trackingNumber: 'TPR987654321',
    estimatedDelivery: '2024-01-25'
  },
  {
    id: 'ORD-2024-003',
    date: '2024-01-22',
    status: 'processing',
    total: 5499,
    items: [
      { name: 'MuscleTech Mass Gainer', quantity: 1, price: 2799 },
      { name: 'BSN Amino X', quantity: 1, price: 1899 },
      { name: 'Rule1 R1 Protein', quantity: 1, price: 2299 }
    ]
  },
  {
    id: 'ORD-2024-004',
    date: '2024-01-25',
    status: 'cancelled',
    total: 1999,
    items: [
      { name: 'Ultimate Nutrition Prostar Whey', quantity: 1, price: 1999 }
    ],
    cancelledDate: '2024-01-26',
    refundStatus: 'processed'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'shipped':
      return 'bg-blue-100 text-blue-800'
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your protein supplement orders</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="container mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <span className="text-gray-500 text-2xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <Link href="/all-products">
              <Button>Shop Now</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <CardDescription>
                        Placed on {new Date(order.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                      <span className="text-lg font-bold text-gray-900">
                        ₹{order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Items ({order.items.length})</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-gray-900">₹{item.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order Status Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {order.status === 'delivered' && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-green-700">
                          ✅ Delivered on {new Date(order.deliveredDate!).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">Tracking: {order.trackingNumber}</p>
                      </div>
                    )}
                    
                    {order.status === 'shipped' && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-blue-700">
                          🚚 Shipped - Tracking: {order.trackingNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          Estimated delivery: {new Date(order.estimatedDelivery!).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    
                    {order.status === 'processing' && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-yellow-700">
                          ⏳ Processing - We're preparing your order
                        </p>
                        <p className="text-sm text-gray-600">Expected to ship within 1-2 business days</p>
                      </div>
                    )}
                    
                    {order.status === 'cancelled' && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-red-700">
                          ❌ Cancelled on {new Date(order.cancelledDate!).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Refund status: {order.refundStatus === 'processed' ? 'Processed' : 'Pending'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {order.status === 'delivered' && (
                      <>
                        <Button variant="outline" size="sm">
                          Download Invoice
                        </Button>
                        <Button variant="outline" size="sm">
                          Leave Review
                        </Button>
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      </>
                    )}
                    
                    {order.status === 'shipped' && (
                      <>
                        <Button variant="outline" size="sm">
                          Track Package
                        </Button>
                        <Button variant="outline" size="sm">
                          Download Invoice
                        </Button>
                      </>
                    )}
                    
                    {order.status === 'processing' && (
                      <>
                        <Button variant="outline" size="sm">
                          Cancel Order
                        </Button>
                        <Button variant="outline" size="sm">
                          Modify Order
                        </Button>
                      </>
                    )}
                    
                    {order.status === 'cancelled' && (
                      <Button variant="outline" size="sm">
                        Reorder Items
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Help Section */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help with Your Order?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">
                Contact Support
              </Button>
              <Button variant="outline">
                Return/Exchange
              </Button>
              <Button variant="outline">
                FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 