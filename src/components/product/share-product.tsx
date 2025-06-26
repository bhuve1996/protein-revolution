'use client'

import React, { useState } from 'react'
import { Share2, Copy, Mail, MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Product } from '@/types'
import toast from 'react-hot-toast'

interface ShareProductProps {
  product: Product
}

export function ShareProduct({ product }: ShareProductProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const productUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/product/${product.slug}`
    : ''

  const shareText = `Check out this amazing protein supplement: ${product.name} - ₹${product.price.toLocaleString()}`

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(productUrl)
      toast.success('URL copied to clipboard!')
      closeModal()
    } catch (error) {
      toast.error('Failed to copy URL')
    }
  }

  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${productUrl}`)}`
    window.open(whatsappUrl, '_blank')
    closeModal()
  }

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Check out ${product.name}`)
    const body = encodeURIComponent(`${shareText}\n\n${productUrl}`)
    const emailUrl = `mailto:?subject=${subject}&body=${body}`
    window.location.href = emailUrl
    closeModal()
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: productUrl,
        })
        closeModal()
      } catch (error) {
        console.log('Native share cancelled')
      }
    }
  }

  const closeModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
    }, 150)
  }

  const openModal = () => {
    setIsOpen(true)
  }

  return (
    <>
      {/* Share Button */}
      <Button 
        size="lg" 
        variant="outline"
        onClick={openModal}
      >
        <Share2 className="h-5 w-5" />
      </Button>

      {/* Share Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all duration-150 ${
            isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Share Product</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Product Info */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.brand}</p>
                <p className="text-lg font-semibold text-red-600 mt-2">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>

              {/* Copy URL */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product URL
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={productUrl}
                    readOnly
                    className="flex-1 text-sm"
                  />
                  <Button onClick={handleCopyUrl} size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700">Share via</h5>
                
                {/* Native Share (if available) */}
                {typeof window !== 'undefined' && 'share' in navigator && (
                  <Button
                    onClick={handleNativeShare}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share...
                  </Button>
                )}

                {/* WhatsApp */}
                <Button
                  onClick={handleShareWhatsApp}
                  variant="outline"
                  className="w-full justify-start text-green-600 border-green-200 hover:bg-green-50"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>

                {/* Email */}
                <Button
                  onClick={handleShareEmail}
                  variant="outline"
                  className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 