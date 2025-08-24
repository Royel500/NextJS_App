'use client'
import React, { useEffect, useState } from 'react'
import { Pencil, Trash2, View, Star, Zap, Clock } from 'lucide-react'
import Swal from 'sweetalert2'
import Link from 'next/link'
import OrderButtonProduct from '../Components/OrderButtonProduct'

export const dynamic = 'force-dynamic'

export default function Page() {
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/iteams")
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      Swal.fire('Error', 'Failed to load products.', 'error')
    }
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3000/api/iteams/${id}`, {
          method: 'DELETE',
        })

        if (res.ok) {
          Swal.fire('Deleted!', 'Your product has been deleted.', 'success')
          fetchProducts()
        } else {
          throw new Error('Delete failed')
        }
      } catch (error) {
        Swal.fire('Error', 'Something went wrong.', 'error')
      }
    }
  }

  const handleEditClick = (product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleModalSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const updatedProduct = {
      productName: form.productName.value,
      productDescription: form.productDescription.value,
      price: parseFloat(form.price.value),
      category: form.category.value,
      imageUrl: form.imageUrl.value,
      regularPrice: parseFloat(form.regularPrice.value) || 0,
      todayPrice: parseFloat(form.todayPrice.value) || parseFloat(form.price.value),
      discountValue: form.discountValue.value,
      discountType: form.discountType.value,
      stockQuantity: parseInt(form.stockQuantity.value) || 0,
      brand: form.brand.value,
      sku: form.sku.value,
    }

    try {
      const res = await fetch(`http://localhost:3000/api/iteams/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
      })

      if (res.ok) {
        Swal.fire('Updated!', 'Product updated successfully.', 'success')
        setShowModal(false)
        setEditingProduct(null)
        fetchProducts()
      } else {
        throw new Error('Update failed')
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to update product.', 'error')
    }
  }

  // Calculate discount percentage
  const calculateDiscount = (regularPrice, todayPrice) => {
    if (!regularPrice || regularPrice <= todayPrice) return 0;
    return Math.round(((regularPrice - todayPrice) / regularPrice) * 100);
  }

  // Check if product is new (less than 7 days old)
  const isNewProduct = (createdAt) => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdDate > weekAgo;
  }

  // Check if stock is low
  const isLowStock = (stockQuantity) => {
    return stockQuantity > 0 && stockQuantity <= 5;
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">All Products</h1>

      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg">No products found.</p>
          <Link href="/products/addProduct" className="btn btn-primary mt-4">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((item) => {
            const discountPercent = calculateDiscount(item.regularPrice, item.todayPrice || item.price);
            const isNew = isNewProduct(item.createdAt);
            const lowStock = isLowStock(item.stockQuantity);
            
            return (
              <div key={item._id} className="card bg-white shadow-xl relative group hover:shadow-2xl transition-all duration-300">
                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white font-bold py-1 px-3 rounded-full z-10">
                    {discountPercent}% OFF
                  </div>
                )}
                
                {/* New Badge */}
                {isNew && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white font-bold py-1 px-2 rounded-full z-10 flex items-center">
                    <Zap size={14} className="mr-1" /> NEW
                  </div>
                )}
                
                {/* Low Stock Warning */}
                {lowStock && (
                  <div className="absolute top-12 left-2 bg-amber-500 text-white font-bold py-1 px-2 rounded-full z-10 flex items-center">
                    <Clock size={14} className="mr-1" /> Low Stock
                  </div>
                )}

                <figure className="relative">
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/300x200"}
                    alt={item.productName}
                    className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Out of Stock Overlay */}
                  {item.stockQuantity === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="text-white font-bold text-xl bg-red-500 px-4 py-2 rounded">OUT OF STOCK</span>
                    </div>
                  )}
                </figure>
                
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <h2 className="card-title">{item.productName}</h2>
                    {item.isFeatured && (
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    )}
                  </div>
                  
                  {item.brand && (
                    <p className="text-sm text-gray-500">Brand: {item.brand}</p>
                  )}
                  
                  <p className="line-clamp-2 text-gray-600">{item.productDescription}</p>
                  
                  {/* Pricing Section */}
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      {item.regularPrice > (item.todayPrice || item.price) ? (
                        <>
                          <span className="text-2xl font-bold text-green-700">
                            ${item.todayPrice || item.price}
                          </span>
                          <span className="text-lg text-gray-500 line-through">
                            ${item.regularPrice}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold">
                          ${item.todayPrice || item.price}
                        </span>
                      )}
                    </div>
                    
                    {item.stockQuantity > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        In stock: {item.stockQuantity}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="badge badge-primary">{item.category || 'Uncategorized'}</span>
                    {item.tags && item.tags.split(',').map((tag, index) => (
                      <span key={index} className="badge badge-outline">{tag.trim()}</span>
                    ))}
                  </div>
                  
                
                </div>

                <div className="absolute top-2 right-2 flex flex-col space-y-2 transition">
                  <Link href={`products/${item._id}`}>
                    <button className="btn btn-sm btn-circle bg-blue-100 hover:bg-blue-200" title="View">
                      <View className="w-4 h-4 text-blue-600" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleEditClick(item)}
                    className="btn btn-sm btn-circle bg-blue-100 hover:bg-blue-200"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="btn btn-sm btn-circle bg-red-100 hover:bg-red-200"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit Modal */}
      {showModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Product</h2>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Product Name</label>
                  <input 
                    name="productName" 
                    defaultValue={editingProduct.productName} 
                    className="input input-bordered w-full" 
                    required 
                  />
                </div>
                <div>
                  <label className="label">Brand</label>
                  <input 
                    name="brand" 
                    defaultValue={editingProduct.brand || ''} 
                    className="input input-bordered w-full" 
                  />
                </div>
                <div>
                  <label className="label">Regular Price ($)</label>
                  <input 
                    name="regularPrice" 
                    type="number" 
                    step="0.01"
                    defaultValue={editingProduct.regularPrice || ''} 
                    className="input input-bordered w-full" 
                  />
                </div>
                <div>
                  <label className="label">Today's Price ($)</label>
                  <input 
                    name="todayPrice" 
                    type="number" 
                    step="0.01"
                    defaultValue={editingProduct.todayPrice || editingProduct.price} 
                    className="input input-bordered w-full" 
                    required 
                  />
                </div>
                <div>
                  <label className="label">Stock Quantity</label>
                  <input 
                    name="stockQuantity" 
                    type="number" 
                    defaultValue={editingProduct.stockQuantity || 0} 
                    className="input input-bordered w-full" 
                  />
                </div>
                <div>
                  <label className="label">SKU</label>
                  <input 
                    name="sku" 
                    defaultValue={editingProduct.sku || ''} 
                    className="input input-bordered w-full" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Description</label>
                  <textarea 
                    name="productDescription" 
                    defaultValue={editingProduct.productDescription} 
                    className="textarea textarea-bordered w-full" 
                    required 
                    rows="3"
                  />
                </div>
                <div>
                  <label className="label">Category</label>
                  <input 
                    name="category" 
                    defaultValue={editingProduct.category} 
                    className="input input-bordered w-full" 
                    required 
                  />
                </div>
                <div>
                  <label className="label">Image URL</label>
                  <input 
                    name="imageUrl" 
                    defaultValue={editingProduct.imageUrl} 
                    className="input input-bordered w-full" 
                  />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button type="submit" className="btn btn-success">Update Product</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}