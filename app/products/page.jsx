'use client'
import React, { useEffect, useState } from 'react'
import { Pencil, Trash2, View } from 'lucide-react'
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
          {products.map((item) => (
            <div key={item._id} className="card bg-white shadow-xl relative group">
              <figure>
                <img
                  src={item.imageUrl || "https://via.placeholder.com/300x200"}
                  alt={item.productName}
                  className="h-60 w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{item.productName}</h2>
                <p className="line-clamp-2">{item.productDescription}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="badge badge-primary">Category: {item.category || 'N/A'}</span>
                  <span className="badge badge-secondary">Price: ${item.price || '0.00'}</span>
                </div>
                <OrderButtonProduct item={item} />
              </div>

              <div className="absolute top-2 right-2 flex space-x-2 transition">
                <Link href={`products/${item._id}`}>
                  <button className="btn btn-sm btn-circle bg-blue-300" title="View">
                    <View className="w-5 h-5 text-blue-600" />
                  </button>
                </Link>
                <button
                  onClick={() => handleEditClick(item)}
                  className="btn btn-sm btn-circle bg-blue-300"
                  title="Edit"
                >
                  <Pencil className="w-5 h-5 text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="btn btn-sm btn-circle bg-red-100"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-2 right-2 btn btn-sm btn-circle"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Edit Product</h2>
            <form onSubmit={handleModalSubmit} className="space-y-4">
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
                <label className="label">Description</label>
                <textarea 
                  name="productDescription" 
                  defaultValue={editingProduct.productDescription} 
                  className="textarea textarea-bordered w-full" 
                  required 
                />
              </div>
              <div>
                <label className="label">Price</label>
                <input 
                  name="price" 
                  type="number" 
                  step="0.01"
                  defaultValue={editingProduct.price} 
                  className="input input-bordered w-full" 
                  required 
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
              <div className="flex justify-between mt-4">
                <button type="submit" className="btn btn-success">Update</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}