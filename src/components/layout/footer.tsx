import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-red-600 text-white p-2 rounded-lg font-bold text-xl">
                TPR
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">The Protein</h3>
                <p className="text-red-400 font-medium">Revolution</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              Your trusted partner in fitness and nutrition. Premium quality protein supplements 
              to fuel your fitness journey.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-red-400">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-red-400">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-red-400">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-red-400">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/all-products" className="hover:text-red-400">All Products</Link></li>
              <li><Link href="/categories/whey-protein" className="hover:text-red-400">Whey Protein</Link></li>
              <li><Link href="/categories/mass-gainer" className="hover:text-red-400">Mass Gainer</Link></li>
              <li><Link href="/categories/isolate" className="hover:text-red-400">Isolate</Link></li>
              <li><Link href="/brands" className="hover:text-red-400">Brands</Link></li>
              <li><Link href="/offers" className="hover:text-red-400">Special Offers</Link></li>
              <li><Link href="/orders" className="hover:text-red-400">Track Order</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-red-400">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-red-400">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-red-400">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-red-400">Returns & Exchange</Link></li>
              <li><Link href="/privacy" className="hover:text-red-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-red-400">Terms of Service</Link></li>
              <li><Link href="/callback" className="hover:text-red-400">Request Callback</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Stay Connected</h4>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-red-400" />
                <span>+91-9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-red-400" />
                <span>info@theproteinrevolution.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-red-400 mt-0.5" />
                <span>123 Fitness Street, Protein City, PC 12345</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h5 className="text-white font-medium mb-2">Newsletter</h5>
              <p className="text-xs mb-3">Get exclusive deals and fitness tips!</p>
              <form className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © 2024 The Protein Revolution. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Image 
                src="/payments/visa.png" 
                alt="Visa" 
                width={40} 
                height={24} 
                className="h-6 opacity-70"
              />
              <Image 
                src="/payments/mastercard.png" 
                alt="Mastercard" 
                width={40} 
                height={24} 
                className="h-6 opacity-70"
              />
              <Image 
                src="/payments/rupay.png" 
                alt="RuPay" 
                width={40} 
                height={24} 
                className="h-6 opacity-70"
              />
              <Image 
                src="/payments/upi.png" 
                alt="UPI" 
                width={40} 
                height={24} 
                className="h-6 opacity-70"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 