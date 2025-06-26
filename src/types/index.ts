export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number | null
  images: string[]
  brand: string
  category: Category
  categoryId: string
  type: string
  weight: string
  flavor?: string | null
  stock: number
  isActive: boolean
  isFeatured: boolean
  rating: number
  reviewCount: number
  nutritionFacts?: any
  ingredients?: string | null
  reviews?: ProductReview[]
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  products?: Product[]
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Review {
  id: string
  rating: number
  comment: string
  user: User
  userId: string
  product: Product
  productId: string
  createdAt: string
  updatedAt: string
}

export interface ProductReview {
  id: string
  rating: number
  comment: string
  user: {
    id: string
    name: string | null
  }
  userId: string
  productId: string
  createdAt: string | Date
  updatedAt: string | Date
}

export interface User {
  id: string
  name: string
  email: string
  emailVerified?: Date
  image?: string
  role: 'USER' | 'ADMIN'
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
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  id: string
  quantity: number
  userId: string
  productId: string
  product: Product
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  orderNumber: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  total: number
  subtotal: number
  tax: number
  shipping: number
  userId: string
  user: User
  items: OrderItem[]
  shippingAddress: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  orderId: string
  productId: string
  product: Product
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