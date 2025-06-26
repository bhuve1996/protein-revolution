export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  brand: string
  category: Category
  categoryId: string
  type: string
  weight: string
  flavor?: string
  stock: number
  isActive: boolean
  isFeatured: boolean
  rating: number
  reviewCount: number
  nutritionFacts?: any
  ingredients?: string
  reviews?: Review[]
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  products?: Product[]
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  rating: number
  comment: string
  user: User
  userId: string
  product: Product
  productId: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name?: string
  email: string
  emailVerified?: Date
  image?: string
  role: 'CUSTOMER' | 'ADMIN'
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  isSubscribed: boolean
  orders?: Order[]
  reviews?: Review[]
  cartItems?: CartItem[]
  callbacks?: CallbackRequest[]
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  quantity: number
  user: User
  userId: string
  product: Product
  productId: string
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  orderNumber: string
  user: User
  userId: string
  email: string
  phone: string
  shippingAddress: any
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  paymentMethod?: string
  trackingNumber?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  order: Order
  orderId: string
  product: Product
  productId: string
  createdAt: Date
}

export interface CallbackRequest {
  id: string
  user: User
  userId: string
  phone: string
  message?: string
  status: 'PENDING' | 'CONTACTED' | 'COMPLETED'
  createdAt: Date
  updatedAt: Date
}

export interface Newsletter {
  id: string
  email: string
  isActive: boolean
  createdAt: Date
}

export interface ProductFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  type?: string
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'rating' | 'newest'
}

export interface ShippingAddress {
  name: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
} 