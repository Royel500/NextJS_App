'use client'
import React, { useEffect, useState } from 'react'
import { signIn, getProviders } from 'next-auth/react'

export default function LoginButton() {
  const [providers, setProviders] = useState(null)

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Google login button */}
      {providers &&
        Object.values(providers).map((provider) => (
          <button
            key={provider.name}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => signIn(provider.id)}
          >
            Sign in with {provider.name}
          </button>
        ))}

      {/* Optional Credentials login */}
      <button
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        onClick={() => signIn('credentials')}
      >
        Log in with Email
      </button>
    </div>
  )
}
