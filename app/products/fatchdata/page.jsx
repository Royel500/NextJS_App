// hooks/useFetchProducts.ts
'use client'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

export default function useFetchProducts() {
  const [products, setProducts] = useState([])  // state for products
  const [loading, setLoading] = useState(true) // optional loading state
  const [error, setError] = useState(null)     // optional error state

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/iteams')
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err)
      Swal.fire('Error', 'Failed to load products.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Fetch once when the hook is used
  useEffect(() => {
    fetchProducts()
  }, [])

  return { products, loading, error, fetchProducts }
}
