'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { registerUser } from '../api/auth/action/registerUser'

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const userName = form.name.value.trim()
    const userEmail = form.email.value.trim()
    const userPassword = form.password.value

    if (!userName || !userEmail || !userPassword) {
      Swal.fire('Error', 'Please fill in all fields', 'error')
      return
    }

    const payload = {
      userName,
      userEmail,
      userPassword,
      role: 'user', 
      createdAt: new Date().toISOString()
    }

    try {
      setLoading(true)
      const result = await registerUser(payload);

      if (result.error) {
        Swal.fire({
          title: 'User Already Exists!',
          text: result.message,
          icon: 'error',
          confirmButtonText: 'Go to Login'
        }).then(() => {
          router.push('/api/auth/signin') // redirect to login page
        })
      } else {
        Swal.fire({
          title: 'Registration Successful!',
          text: 'Your account has been created.',
          icon: 'success',
          confirmButtonText: 'Go to Home'
        }).then(() => {
          router.push('/')
        })
      }
    } catch (err) {
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80 p-4 border rounded-lg">
      <input type="text" placeholder="Name" name="name" className="border p-2 rounded" required />
      <input type="email" placeholder="Email" name="email" className="border p-2 rounded" required />
      <input type="password" placeholder="Password" name="password" className="border p-2 rounded" required />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
}
