'use client'
import React from 'react'
import Swal from 'sweetalert2'

export default function OrderButton({ service }) {

  const handleOrder = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Confirm Order',
      html:
        `<input id="swal-name" name="name" type="text" class="swal2-input" placeholder="Your Name">` +
        `<input id="swal-email" name="email" type="email" class="swal2-input" placeholder="Your Email">`+
        `<input id="swal-number" name="number" type="number" class="swal2-input" placeholder="Your phone Number">`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const name = document.getElementById('swal-name').value
        const email = document.getElementById('swal-email').value
        const number = document.getElementById('swal-number').value
        if (!name || !email) {
          Swal.showValidationMessage(`Please enter name and email`)
        }
        return { name, email ,number}
      }
    })

    if (formValues) {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId: service.id,
            serviceName: service.name,
            price: service.price || 0,
            userName: formValues.name,
            userEmail: formValues.email,
            userNumber: formValues.number
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
