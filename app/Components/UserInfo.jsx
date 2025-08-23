'use client'
import { useSession } from 'next-auth/react'
import React from 'react'

export default function UserInfo() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>
  if (!session) return <p>User not logged in</p>

  return (
    <div>
      <p><b>Name:</b> {session.user.name}</p>
      <p><b>Email:</b> {session.user.email}</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}
