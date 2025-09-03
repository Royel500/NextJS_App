// app/products/[id]/page.js
'use client'

import React, { useEffect, useState } from 'react'
import { Star, Heart, Shield, Truck, ArrowLeft, Zap, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function ProductDetails({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://nextjs-flax-nine-40.vercel.app/api/iteams/${id}`)
        if (!res.ok) throw new Error('Failed to fetch product')
        const data = await res.json()
        setProduct(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const calculateDiscount = (regularPrice, todayPrice) => {
    if (!regularPrice || regularPrice <= todayPrice) return 0;
    return Math.round(((regularPrice - todayPrice) / regularPrice) * 100);
  }

  const isNewProduct = (createdAt) => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdDate > weekAgo;
  }

  const handleAddToCart = () => {
    // Add to cart functionality
    Swal.fire({
      title: 'Added to Cart!',
      text: `${quantity} ${product.productName} added to your cart`,
      icon: 'success',
      confirmButtonText: 'OK'
    })
  }

  const handleBuyNow = () => {
    // Buy now functionality
    Swal.fire({
      title: 'Proceeding to Checkout',
      text: `You're buying ${quantity} ${product.productName}`,
      icon: 'info',
      confirmButtonText: 'Continue'
    })
  }

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
  
  if (error) return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="text-center">
        <div className="text-red-600 text-xl mb-4">{error}</div>
        <button onClick={() => router.back()} className="btn btn-primary">
          Go Back
        </button>
      </div>
    </div>
  )
  
  if (!product) return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="text-center">
        <div className="text-xl mb-4">No Product Found</div>
        <button onClick={() => router.back()} className="btn btn-primary">
          Go Back
        </button>
      </div>
    </div>
  )

  const discountPercent = calculateDiscount(product.regularPrice, product.todayPrice || product.price);
  const isNew = isNewProduct(product.createdAt);
  const mainImage = product.imageUrl || "https://via.placeholder.com/500";
  const imageArray = [mainImage, ...(product.additionalImages || [])];
  const todayPrice = product.todayPrice || product.price;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb and Back Button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.back()} 
            className="btn btn-ghost btn-sm mr-4"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-sm breadcrumbs">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href={`/products?category=${product.category}`}>{product.category}</a></li>
              <li className="text-primary">{product.productName}</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl shadow-md p-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={imageArray[selectedImage]}
                alt={product.productName}
                className="w-full h-96 object-contain rounded-lg border"
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col space-y-2">
                {discountPercent > 0 && (
                  <span className="bg-red-500 text-white font-bold py-1 px-3 rounded-full">
                    {discountPercent}% OFF
                  </span>
                )}
                {isNew && (
                  <span className="bg-green-500 text-white font-bold py-1 px-3 rounded-full flex items-center">
                    <Zap size={14} className="mr-1" /> NEW
                  </span>
                )}
                {product.stockQuantity === 0 && (
                  <span className="bg-gray-500 text-white font-bold py-1 px-3 rounded-full">
                    OUT OF STOCK
                  </span>
                )}
                {product.isFeatured && (
                  <span className="bg-blue-500 text-white font-bold py-1 px-3 rounded-full flex items-center">
                    <Star size={14} className="mr-1" /> FEATURED
                  </span>
                )}
              </div>
              
              <button className="absolute top-3 right-3 btn btn-ghost btn-circle bg-white/80">
                <Heart className="text-red-500" />
              </button>
            </div>
            
            {/* Thumbnail Gallery */}
            {imageArray.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto py-2">
                {imageArray.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.productName} view ${index + 1}`}
                    className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${selectedImage === index ? 'border-primary' : 'border-gray-200'}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.productName}</h1>
              {product.brand && (
                <p className="text-lg text-gray-600">Brand: {product.brand}</p>
              )}
              
              {/* Ratings */}
              <div className="flex items-center mt-2">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={18} 
                      className={star <= 4 ? 'fill-current' : ''} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">(42 reviews)</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center">
                {product.regularPrice > todayPrice ? (
                  <>
                    <span className="text-3xl font-bold text-green-700">
                      ${todayPrice}
                    </span>
                    <span className="text-xl text-gray-500 line-through ml-3">
                      ${product.regularPrice}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">
                    ${todayPrice}
                  </span>
                )}
              </div>
              
              {product.stockQuantity > 0 ? (
                <p className="text-green-600 font-medium">
                  In Stock ({product.stockQuantity} available)
                </p>
              ) : (
                <p className="text-red-600 font-medium">Out of Stock</p>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-3">
              <p className="text-gray-700">{product.productDescription}</p>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                {product.sku && (
                  <div>
                    <span className="font-semibold">SKU:</span> {product.sku}
                  </div>
                )}
                {product.category && (
                  <div>
                    <span className="font-semibold">Category:</span> {product.category}
                  </div>
                )}
                {product.weight && (
                  <div>
                    <span className="font-semibold">Weight:</span> {product.weight} kg
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <span className="font-semibold">Dimensions:</span> {product.dimensions}
                  </div>
                )}
                {product.colors && (
                  <div>
                    <span className="font-semibold">Colors:</span> {product.colors}
                  </div>
                )}
                {product.sizes && (
                  <div>
                    <span className="font-semibold">Sizes:</span> {product.sizes}
                  </div>
                )}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            {product.stockQuantity > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <button 
                      className="px-3 py-2 text-lg"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button 
                      className="px-3 py-2 text-lg"
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      disabled={quantity >= product.stockQuantity}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-600">Max: {product.stockQuantity}</span>
                </div>

                <div className="flex space-x-3">
                  <button 
                    className="btn btn-primary flex-1"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="btn btn-secondary flex-1"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="flex justify-around py-4 border-t border-b">
              <div className="flex flex-col items-center">
                <Truck size={24} className="text-blue-500" />
                <span className="text-sm mt-1">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center">
                <Shield size={24} className="text-green-500" />
                <span className="text-sm mt-1">2-Year Warranty</span>
              </div>
              <div className="flex flex-col items-center">
                <Clock size={24} className="text-purple-500" />
                <span className="text-sm mt-1">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <div className="tabs">
            <a className="tab tab-lifted tab-active">Description</a>
            <a className="tab tab-lifted">Specifications</a>
            <a className="tab tab-lifted">Reviews (42)</a>
            <a className="tab tab-lifted">Shipping & Returns</a>
          </div>
          
          <div className="p-4">
            <p>{product.productDescription}</p>
            
            {product.tags && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.split(',').map((tag, index) => (
                    <span key={index} className="badge badge-outline">{tag.trim()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products (placeholder) */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Placeholder for related products */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="card bg-base-100 shadow">
                <figure>
                  <div className="h-40 bg-gray-200 animate-pulse"></div>
                </figure>
                <div className="card-body p-4">
                  <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 animate-pulse w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}