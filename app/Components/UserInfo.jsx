'use client'
import { useSession } from 'next-auth/react'
import React from 'react'

export default function UserInfo() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>
  if (!session) return <p>User not logged in</p>

  return (
    <div>
      <p><b>Name:</b> {session.user?.userName}</p>   {/* <- changed */}
      <p><b>Email:</b> {session.user?.email}</p>
      <p><b>Role:</b> {session.user?.role}</p>
      <p><b>ID:</b> {session.user?.id}</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}
