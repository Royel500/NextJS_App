'use client'

import React, { useEffect, useState } from 'react'
import { Star, Heart, Shield, Truck, ArrowLeft, Zap, Clock, CreditCard, Smartphone, Building, Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { addToCart } from '@/app/api/utils/route'

export default function ProductDetails(props) {
  const { id } = React.use(props.params);
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [processingPayment, setProcessingPayment] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/items/${id}`)
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/items', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      Swal.fire('Error', 'Failed to load products.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
  if (!product) return;

  // prefer session.user.id or email if available
  const userKey = session?.user?.email || session?.user?.id || undefined;

  addToCart(product, quantity, userKey);

  Swal.fire({
    title: 'Added to Cart!',
    text: `${quantity} × ${product.productName} added to your cart`,
    icon: 'success',
    confirmButtonText: 'Go to Cart',
    showCancelButton: true,
    cancelButtonText: 'Continue Shopping'
  }).then((result) => {
    if (result.isConfirmed) {
      router.push('/products/cart');
    }
  });
};

  const handleBuyNow = () => {
    if (!session) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to proceed with payment',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login?redirect=' + window.location.pathname);
        }
      });
      return;
    }
    setShowPaymentModal(true);
  }

const processPayment = async () => {
  if (!selectedPaymentMethod) {
    Swal.fire('Error', 'Please select a payment method', 'error');
    return;
  }

  setProcessingPayment(true);

  try {
    const totalAmount = (product.todayPrice || product.price) * quantity;
    
    console.log('🔄 Processing payment for product:', product._id, 'Quantity:', quantity);

    // 1. Calculate new values
    const currentStock = parseInt(product.stockQuantity) || 0;
    const currentTotalSold = parseInt(product['totalSold '] || product.totalSold || 0);
    
    const newStockQuantity = currentStock - quantity;
    const newTotalSold = currentTotalSold + quantity;

    // 2. Update stock and sales in the database
    console.log('📈 Updating stock and sales...');
    
    const updateResponse = await fetch(`/api/items/${product._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stockQuantity: newStockQuantity.toString(), // Convert to string if your DB expects strings
        totalSold: newTotalSold.toString() ,
        'status':'processing',
      }),
    });

    const updateResult = await updateResponse.json();
    console.log('📊 Update API Response:', updateResult);

    if (updateResult.success) {
      console.log('✅ Stock and sales updated successfully');
      console.log('📦 Modified count:', updateResult.modifiedCount);
      
      // Show success message
      await Swal.fire({
        title: 'Payment Successful!',
        text: `Your order has been placed and inventory updated!`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

    } else {
      console.error('❌ Failed to update stock and sales:', updateResult.error);
      // Still show success but with warning
      await Swal.fire({
        title: 'Payment Processed!',
        text: `Payment completed, but inventory update had issues.`,
        icon: 'warning',
        timer: 2000,
        showConfirmButton: false
      });
    }

    // 3. Create success URL and redirect
    const successUrl = `${window.location.origin}/products/success?method=${selectedPaymentMethod}&product=${encodeURIComponent(product.productName)}&quantity=${quantity}&amount=${totalAmount}&transaction_id=${Date.now()}`;
    
    console.log('🔀 Redirecting to:', successUrl);
    setShowPaymentModal(false);
    
    // Redirect to success page
    window.location.href = successUrl;

  } catch (error) {
    console.error('💥 Payment process error:', error);
    Swal.fire({
      title: 'Payment Failed',
      text: 'There was an error processing your payment. Please try again.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  } finally {
    setProcessingPayment(false);
  }
}


  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Pay with Visa, MasterCard, or American Express',
      icon: CreditCard,
      color: 'text-blue-600'
    },
    {
      id: 'sslcommerz',
      name: 'Local Bank Transfer',
      description: 'Pay through local Bangladeshi banks',
      icon: Building,
      color: 'text-green-600'
    },
    {
      id: 'bkash',
      name: 'bKash',
      description: 'Pay using bKash mobile payment',
      icon: Smartphone,
      color: 'text-pink-600'
    },
    {
      id: 'nogod',
      name: 'Nagad',
      description: 'Pay using Nagad mobile payment',
      icon: Wallet,
      color: 'text-purple-600'
    }
  ];

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
  const totalPrice = todayPrice * quantity;

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
              <Image
                src={product?.imageUrl || '/placeholder.jpg'}
                alt={product?.productName || 'Product Image'}
                width={350}
                height={700}
                unoptimized
                className="w-full h-100 rounded-xl transition-transform duration-300 group-hover:scale-105"
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
              <p className="text-gray-700 h-20 overflow-auto">{product?.productDescription}</p>
              
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

            {/* Quantity and Action Buttons */}
            {product.stockQuantity > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <button 
                      className="px-3 py-2 text-lg hover:bg-gray-100"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button 
                      className="px-3 py-2 text-lg hover:bg-gray-100"
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
                    className="btn btn-outline flex-1"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="btn btn-primary flex-1"
                    onClick={handleBuyNow}
                  >
                    Buy Now - ${totalPrice.toFixed(2)}
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

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Select Payment Method</h3>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="btn btn-ghost btn-sm"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-center">
                      <method.icon className={`mr-3 ${method.color}`} size={24} />
                      <div>
                        <div className="font-semibold">{method.name}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Product:</span>
                  <span>{product.productName} × {quantity}</span>
                </div>
                <div className="flex justify-between font-semibold mt-2">
                  <span>Total Amount:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={processPayment}
                disabled={!selectedPaymentMethod || processingPayment}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition flex items-center justify-center gap-2 font-medium"
              >
                {processingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  `Pay $${totalPrice.toFixed(2)}`
                )}
              </button>
            </div>
          </div>
        )}
{/* Related Products - Horizontal Scroll */}
<div className="mt-8">
  <h2 className="text-2xl font-bold mb-4">You Might Also Like</h2>
  <div className="relative">
    <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
      {products.map((item) => (
        <div 
          key={item._id || item.sku} 
          className="card bg-base-100 shadow rounded-lg overflow-hidden flex-shrink-0 w-64" // Fixed width for consistent sizing
        >
          <figure className="h-40 w-full relative bg-gray-200">
            <Link href={`/products/${item._id}`}>
              <Image
                src={item?.imageUrl || '/placeholder.jpg'}
                alt={item?.productName || 'Product Image'}
                width={256} // Match the card width
                height={160}
                unoptimized
                className="h-40 w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </figure>
          <div className="card-body p-4">
            <h2 className="text-lg font-bold text-gray-800 line-clamp-2 min-h-[3rem]">
              {item?.productName || 'No Name'}
            </h2>
            {item?.brand && (
              <p className="text-sm text-gray-500 line-clamp-1">{item.brand}</p>
            )}
            <div className="mt-2 flex items-center justify-between">
              <span className="font-semibold text-green-600">
                ${item?.todayPrice || item?.price || '0.00'}
              </span>
              {item?.regularPrice > (item?.todayPrice || item?.price) && (
                <span className="text-sm text-gray-400 line-through">
                  ${item?.regularPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

      </div>
    </div>
  )
}