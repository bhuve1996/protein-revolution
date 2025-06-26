'use client'

import React from 'react'
import { ProductActions } from '@/components/product/product-actions'
import { ShareProduct } from '@/components/product/share-product'
import { Product } from '@/types'

interface ProductPageClientProps {
  product: Product
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  return (
    <>
      {/* Product Actions */}
      <ProductActions product={product} />
      
      <div className="flex justify-end mb-6">
        <ShareProduct product={product} />
      </div>
    </>
  )
} 