'use client'

import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import Link from 'next/link'
import { useSession } from 'next-auth/react' // <-- added

export default function AdminOrdersPage() {
  const { data: session } = useSession() // <-- get session
  const userEmail = session?.user?.email?.toLowerCase?.() || null

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null) // show which order is processing

  // normalize _id from various shapes
  const normalizeOrder = (o) => {
    if (!o) return o
    const copy = { ...o }
    // handle Mongo export shapes
    if (copy._id && typeof copy._id === 'object') {
      // { $oid: "..." }
      if (copy._id.$oid) copy._id = copy._id.$oid
      else if (copy._id.toString) copy._id = copy._id.toString()
    }
    // ensure price is a number when nested like {"$numberInt":"1500"}
    if (copy.price && typeof copy.price === 'object') {
      if (copy.price.$numberInt) copy.price = Number(copy.price.$numberInt)
      else if (copy.price.$numberDecimal) copy.price = Number(copy.price.$numberDecimal)
    }
    // createdAt normalization if present as Date
    if (copy.createdAt && typeof copy.createdAt === 'object' && copy.createdAt.$date) {
      copy.createdAt = new Date(copy.createdAt.$date).toISOString()
    }
    return copy
  }

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch orders')
      const data = await res.json()
      // normalize every order
      const normalized = (Array.isArray(data) ? data : []).map(normalizeOrder)

      // If we have a logged-in user email, filter by businessEmail === userEmail
      if (userEmail) {
        const filtered = normalized.filter((o) => {
          const be = (o?.businessEmail || o?.businessemail || o?.business_email || '').toString().toLowerCase().trim()
          return be && be === userEmail
        })
        setOrders(filtered)
      } else {
        // no logged-in user -> show empty list (or you can show all by using setOrders(normalized))
        setOrders([])
      }
    } catch (err) {
      console.error('fetchOrders error', err)
      Swal.fire('Error', 'Failed to load orders', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // re-fetch when component mounts or when userEmail changes
    fetchOrders()
  }, [userEmail])

  // Safe WA link builder
  const waLink = (number) => {
    if (!number) return '#'
    // remove non-digits
    const cleaned = String(number).replace(/\D+/g, '')
    // ensure starts with country code; assume provided numbers already include country code
    return `https://wa.me/${cleaned}`
  }

  // Update status by calling PUT /api/orders with JSON { id, status }
  const handleAction = async (id, action) => {
    if (!id) {
      console.error('Missing id for handleAction', id)
      Swal.fire('Error', 'Order id missing', 'error')
      return
    }

    // confirm action with admin
    const actionLabel = action === 'delivered' ? 'Mark as Delivered' : action === 'confirmed' ? 'Confirm Order' : action
    const confirm = await Swal.fire({
      title: `${actionLabel}?`,
      text: `Are you sure you want to ${actionLabel.toLowerCase()}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    })
    if (!confirm.isConfirmed) return

    setProcessingId(id)
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: action })
      })
      if (!res.ok) {
        const text = await res.text().catch(() => null)
        throw new Error(text || 'Action failed')
      }
      await Swal.fire('Success', `Order ${action} successfully`, 'success')
      await fetchOrders()
    } catch (err) {
      console.error('handleAction error', err)
      Swal.fire('Error', err.message || 'Failed to update order', 'error')
    } finally {
      setProcessingId(null)
    }
  }

  const handleDelete = async (id) => {
    if (!id) return
    const confirmed = await Swal.fire({
      title: 'Delete order?',
      text: 'This will remove the order permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete'
    })
    if (!confirmed.isConfirmed) return

    try {
      const res = await fetch('/api/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!res.ok) {
        const t = await res.text().catch(() => null)
        throw new Error(t || 'Delete failed')
      }
      Swal.fire('Deleted', 'Order removed', 'success')
      fetchOrders()
    } catch (err) {
      console.error('delete error', err)
      Swal.fire('Error', err.message || 'Failed to delete', 'error')
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My — Orders</h1>
          <div>
            <button onClick={fetchOrders} className="px-3 py-1 bg-blue-600 text-white rounded-md">Refresh</button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10">No orders found.</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">#</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Service</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Client</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Number</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {orders.map((o, idx) => {
                  const order = normalizeOrder(o) // ensure safe shape
                  const id = order._id || order.id
                  const price = typeof order.price === 'number' ? order.price : (order.price?.$numberInt ? Number(order.price.$numberInt) : order.price)
                  const status = order.status || 'pending'
                  const created = order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'

                  return (
                    <tr key={id || idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{idx + 1}</td>
                      <td className="px-4 py-3 text-sm">{order.sName || order.service || '—'}</td>
                      <td className="px-4 py-3 text-sm">${price ?? '—'}</td>
                      <td className="px-4 py-3 text-sm">{order.userName || order.name || '—'}</td>
                      <td className="px-4 py-3 text-sm">{order.userEmail || order.email || '—'}</td>
                      <td className="px-4 py-3 text-sm">
                        {order.userNumber ? (
                          <a href={waLink(order.userNumber)} target="_blank" rel="noreferrer" className="text-green-600 hover:underline">
                            {order.userNumber}
                          </a>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">{status}</td>
                      <td className="px-4 py-3 text-sm">{created}</td>

                      <td className="px-4 py-3 text-right flex gap-2 justify-end">
                        <button
                          onClick={() => handleAction(id, 'confirmed')}
                          disabled={processingId === id}
                          className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {processingId === id ? 'Please wait' : 'Confirm'}
                        </button>

      


                        <button
                          onClick={() => handleDelete(id)}
                          className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
