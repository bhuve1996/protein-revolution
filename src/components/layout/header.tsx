'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Search, ShoppingCart, User, Menu, X, Phone, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/stores/cart-store'
import { useWishlistStore } from '@/stores/wishlist-store'

export function Header() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { totalItems: cartItemsCount, fetchCart } = useCartStore()
  const { totalItems: wishlistItemsCount, fetchWishlist } = useWishlistStore()

  // Fetch cart and wishlist when user is authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchCart()
      fetchWishlist()
    }
  }, [status, fetchCart, fetchWishlist])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="bg-red-600 text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">Free shipping on orders above ₹2,999</span>
            <span className="md:hidden">Free shipping ₹2,999+</span>
          </div>
          <div className="flex items-center space-x-4">
            <Phone className="h-4 w-4" />
            <span>+91-9876543210</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-red-600 text-white p-2 rounded-lg font-bold text-xl">
              TPR
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-900">The Protein</h1>
              <p className="text-sm text-red-600 font-medium">Revolution</p>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for protein supplements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute right-0 top-0 h-full rounded-l-none"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            {session && (
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                  {wishlistItemsCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistItemsCount()}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount()}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {status === 'loading' ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            ) : session ? (
              <div className="relative group">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                  <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Dashboard
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Orders
                  </Link>
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  {(session.user as any)?.role === 'ADMIN' && (
                    <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isMenuOpen && (
          <form onSubmit={handleSearch} className="md:hidden mt-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute right-0 top-0 h-full rounded-l-none"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Navigation */}
      <nav className="border-t">
        <div className="container mx-auto px-4">
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
            <ul className="flex flex-col md:flex-row md:items-center md:space-x-8 py-4">
              <li>
                <Link href="/" className="block py-2 md:py-0 text-gray-700 hover:text-red-600 font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/all-products" className="block py-2 md:py-0 text-gray-700 hover:text-red-600 font-medium">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories/whey-protein" className="block py-2 md:py-0 text-gray-700 hover:text-red-600 font-medium">
                  Whey Protein
                </Link>
              </li>
              <li>
                <Link href="/categories/mass-gainer" className="block py-2 md:py-0 text-gray-700 hover:text-red-600 font-medium">
                  Mass Gainer
                </Link>
              </li>
              <li>
                <Link href="/categories/isolate" className="block py-2 md:py-0 text-gray-700 hover:text-red-600 font-medium">
                  Isolate
                </Link>
              </li>
              <li>
                <Link href="/brands" className="block py-2 md:py-0 text-gray-700 hover:text-red-600 font-medium">
                  Brands
                </Link>
              </li>
              <li>
                <Link href="/offers" className="block py-2 md:py-0 text-gray-700 hover:text-red-600 font-medium">
                  Offers
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
} 