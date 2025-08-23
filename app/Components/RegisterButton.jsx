'use client'
import Link from 'next/link'
import React from 'react'

export default function RegisterButton() {
  return (
    <Link href="/register">
      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
        Register
      </button>
    </Link>
  )
}
