// app/products/[id]/page.js
'use client'

import React, { useEffect, useState } from 'react'

export default function ProductDetails({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/iteams/${id}`)
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

  if (loading) return <div className="text-center mt-20">Loading...</div>
  if (error) return <div className="text-center mt-20 text-red-600">{error}</div>
  if (!product) return <div className="text-center mt-20">No Product Found</div>

  return (
    <section className='flex justify-center items-center'>


    <div className="max-w-4xl space-y-3 mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{product.productName}</h1>
      <img
        src={product.imageUrl || "https://via.placeholder.com/500"}
        alt={product.productName}
        className="w-200 h-120 m-1 p-1 rounded"
      />
      <p className="my-2"><strong>Description:</strong> {product.productDescription}</p>
      <p className="mb-2"><strong>Category:</strong> {product.category}</p>
      <p className="mb-2"><strong>Price:</strong> ${product.price}</p>
    </div>
        </section>
  )
}
