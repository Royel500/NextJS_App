'use client'
import React, { useState } from 'react'
import { registerUser } from '../api/auth/action/registerUser'

export default function RegisterForm() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const userName = form.name.value
    const userEmail = form.email.value
    const userPassword = form.password.value

    // Add registration date
    const createdAt = new Date().toISOString()

    const payload = { userName, userEmail, userPassword, createdAt }
    console.log(payload)

    try {
      setLoading(true)
      const result = await registerUser(payload)
      console.log(result)
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Something went wrong')
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
