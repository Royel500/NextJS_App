'use client'
import React from 'react'
import Swal from 'sweetalert2'


export default function OrderButton({ service }) {

const handleOrder = async () => {
  const { value: formValues } = await Swal.fire({
    title: 'Confirm Order',
    html:
      `<input id="swal-name" name="name" type="text" class="swal2-input" placeholder="Your Name">` +
      `<input id="swal-email" name="email" type="email" class="swal2-input" placeholder="Your Email">` +
      `<input id="swal-phone" name="phone" type="tel" class="swal2-input" placeholder="Your Phone Number" pattern="[0-9+\-\s()]{10,}">`,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const name = document.getElementById('swal-name').value.trim()
      const email = document.getElementById('swal-email').value.trim()
      const phone = document.getElementById('swal-phone').value.trim()
      
      if (!name || !email || !phone) {
        Swal.showValidationMessage(`Please enter name, email, and phone number`)
        return false
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        Swal.showValidationMessage(`Please enter a valid email address`)
        return false
      }
      
      // Phone validation (basic - at least 10 digits)
      const cleanPhone = phone.replace(/\D/g, '')
      if (cleanPhone.length < 10) {
        Swal.showValidationMessage(`Please enter a valid phone number (at least 10 digits)`)
        return false
      }
      
      return { name, email, phone: cleanPhone }
    }
  })

  if (formValues) {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service._id,
          serviceName: service.name ,
          price: service.price || 0,
          userName: formValues.name,
          userEmail: formValues.email,
          userNumber: formValues.phone  // Changed from number to phone
        })
      })

      if (!res.ok) throw new Error('Failed to save order')

      Swal.fire('Success', 'Your order has been placed!', 'success')
    } catch (err) {
      Swal.fire('Error', err.message, 'error')
    }
  }
}

  return (
    <button onClick={handleOrder} className="mt-4 btn btn-primary">
      Order Now
    </button>
  )
}
