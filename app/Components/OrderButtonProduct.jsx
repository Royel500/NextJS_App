'use client'
import React, { useState } from 'react'
import Swal from 'sweetalert2'

export default function OrderButtonProduct({ item }) {
  const [isOrdering, setIsOrdering] = useState(false)

  const handleOrder = async () => {
    setIsOrdering(true)
    
    try {
      // Show order form dialog to collect user information
      const { value: formValues } = await Swal.fire({
        title: `Order ${item.productName}`,
        html:
          `<input id="swal-input1" class="swal2-input" type='text' placeholder="Your Name" required>` +
          `<input id="swal-input2" class="swal2-input"  placeholder="Your Email" type="email" required>` +
          `<input id="swal-input3" class="swal2-input" type='number' placeholder="Your Phone Number" required>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Place Order',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
          const name = document.getElementById('swal-input1').value
          const email = document.getElementById('swal-input2').value
          const phone = document.getElementById('swal-input3').value
          
          // Validate inputs
          if (!name || !email || !phone) {
            Swal.showValidationMessage('Please fill in all fields')
            return false
          }
          
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(email)) {
            Swal.showValidationMessage('Please enter a valid email address')
            return false
          }
          
          return { name, email, phone }
        }
      })

      if (formValues) {
        // Send the order to your backend
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: item._id,
            productName: item.productName,
            price: item.price || 0,
            userName: formValues.name,
            userEmail: formValues.email,
            userNumber: formValues.phone
          })
        })

        if (!res.ok) throw new Error('Failed to save order')

        Swal.fire(
          'Ordered!',
          `Your order for ${item.productName} has been placed.`,
          'success'
        )
      }
    } catch (error) {
      console.error('Order error:', error)
      Swal.fire(
        'Error!',
        'There was a problem placing your order. Please try again.',
        'error'
      )
    } finally {
      setIsOrdering(false)
    }
  }

  return (
    <div className="card-actions justify-end mt-4">
      <button
        onClick={handleOrder}
        disabled={isOrdering}
        className="btn btn-primary w-full"
      >
        {isOrdering ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Ordering...
          </>
        ) : (
          `Order Now - $${item.price || '0.00'}`
        )}
      </button>
    </div>
  )
}