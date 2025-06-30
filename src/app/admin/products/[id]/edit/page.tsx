'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Upload, Plus, X } from 'lucide-react'
import { AdminWrapper } from '@/components/admin/admin-wrapper'

export default function EditProductPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [images, setImages] = useState<string[]>(['/placeholder-product.jpg'])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    brand: '',
    categoryId: '',
    type: '',
    weight: '',
    flavor: '',
    stock: '',
    isActive: true,
    isFeatured: false,
    ingredients: '',
    nutritionFacts: {
      servingSize: '',
      servingsPerContainer: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    }
  })

  useEffect(() => {
    fetchCategories()
    fetchProduct()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProduct = async () => {
    try {
      setLoading(true)
      // Mock product data for now
      const mockProduct = {
        id: productId,
        name: 'Sample Protein Powder',
        description: 'High-quality whey protein powder for muscle building',
        price: 2999,
        originalPrice: 3499,
        brand: 'Sample Brand',
        categoryId: '1',
        type: 'Whey Isolate',
        weight: '2lbs',
        flavor: 'Chocolate',
        stock: 25,
        isActive: true,
        isFeatured: false,
        images: ['/placeholder-product.jpg'],
        ingredients: 'Whey protein isolate, cocoa powder, natural flavors',
        nutritionFacts: {
          servingSize: '30g',
          servingsPerContainer: '30',
          calories: '120',
          protein: '24g',
          carbs: '3g',
          fat: '1g'
        }
      }

      setFormData({
        name: mockProduct.name,
        description: mockProduct.description,
        price: mockProduct.price.toString(),
        originalPrice: mockProduct.originalPrice?.toString() || '',
        brand: mockProduct.brand,
        categoryId: mockProduct.categoryId,
        type: mockProduct.type,
        weight: mockProduct.weight,
        flavor: mockProduct.flavor,
        stock: mockProduct.stock.toString(),
        isActive: mockProduct.isActive,
        isFeatured: mockProduct.isFeatured,
        ingredients: mockProduct.ingredients,
        nutritionFacts: mockProduct.nutritionFacts || {
          servingSize: '',
          servingsPerContainer: '',
          calories: '',
          protein: '',
          carbs: '',
          fat: ''
        }
      })
      setImages(mockProduct.images)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (name.startsWith('nutritionFacts.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        nutritionFacts: {
          ...prev.nutritionFacts,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }))
    }
  }

  const addImageUrl = () => {
    setImages(prev => [...prev, '/placeholder-product.jpg'])
  }

  const removeImage = (index: number) => {
    if (images.length > 1) {
      setImages(prev => prev.filter((_, i) => i !== index))
    }
  }

  const updateImageUrl = (index: number, url: string) => {
    setImages(prev => prev.map((img, i) => i === index ? url : img))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: parseInt(formData.stock),
        images: images.filter(img => img.trim() !== ''),
        nutritionFacts: Object.values(formData.nutritionFacts).some(v => v) ? formData.nutritionFacts : null
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        alert('Product updated successfully!')
        router.push('/admin/products')
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/admin/products">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-gray-600">Update product information</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Product Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Update the basic product details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g., Optimum Nutrition Gold Standard Whey"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Brand *
                        </label>
                        <Input
                          name="brand"
                          value={formData.brand}
                          onChange={handleInputChange}
                          placeholder="e.g., Optimum Nutrition"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Detailed product description..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <select
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type *
                        </label>
                        <Input
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          placeholder="e.g., Whey Isolate"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weight *
                        </label>
                        <Input
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          placeholder="e.g., 2lbs, 1kg"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Flavor
                        </label>
                        <Input
                          name="flavor"
                          value={formData.flavor}
                          onChange={handleInputChange}
                          placeholder="e.g., Double Rich Chocolate"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stock Quantity *
                        </label>
                        <Input
                          name="stock"
                          type="number"
                          value={formData.stock}
                          onChange={handleInputChange}
                          placeholder="0"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                    <CardDescription>Update product prices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Price (₹) *
                        </label>
                        <Input
                          name="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          min="0"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Original Price (₹)
                        </label>
                        <Input
                          name="originalPrice"
                          type="number"
                          step="0.01"
                          value={formData.originalPrice}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          min="0"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Images */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>Update product image URLs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {images.map((image, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={image}
                            onChange={(e) => updateImageUrl(index, e.target.value)}
                            placeholder="Image URL"
                            className="flex-1"
                          />
                          {images.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addImageUrl}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Image
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                        Active (visible to customers)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                        Featured (show on homepage)
                      </label>
                    </div>
                  </CardContent>
                </Card>

                {/* Nutrition Facts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Nutrition Facts</CardTitle>
                    <CardDescription>Update nutrition information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Serving Size
                        </label>
                        <Input
                          name="nutritionFacts.servingSize"
                          value={formData.nutritionFacts.servingSize}
                          onChange={handleInputChange}
                          placeholder="30g"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Servings/Container
                        </label>
                        <Input
                          name="nutritionFacts.servingsPerContainer"
                          value={formData.nutritionFacts.servingsPerContainer}
                          onChange={handleInputChange}
                          placeholder="30"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Calories
                        </label>
                        <Input
                          name="nutritionFacts.calories"
                          value={formData.nutritionFacts.calories}
                          onChange={handleInputChange}
                          placeholder="120"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Protein
                        </label>
                        <Input
                          name="nutritionFacts.protein"
                          value={formData.nutritionFacts.protein}
                          onChange={handleInputChange}
                          placeholder="24g"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Carbs
                        </label>
                        <Input
                          name="nutritionFacts.carbs"
                          value={formData.nutritionFacts.carbs}
                          onChange={handleInputChange}
                          placeholder="3g"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Fat
                        </label>
                        <Input
                          name="nutritionFacts.fat"
                          value={formData.nutritionFacts.fat}
                          onChange={handleInputChange}
                          placeholder="1g"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ingredients */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ingredients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      name="ingredients"
                      value={formData.ingredients}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      placeholder="List of ingredients..."
                    />
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Product'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminWrapper>
  )
} 