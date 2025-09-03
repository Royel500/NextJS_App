'use client'
import { useSession } from 'next-auth/react'
import React from 'react'
import contracts from './../contract/page';

export default function UserInfo() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>
  if (!session) return <p>User not logged in</p>

  return (
    <div>
      <p><b>Name: Developer working on it need 5 days more to complte </b> 
      {/* {session.user?.userName} */}
      
      </p>
      {
        console.log(session.user)
      }
      <p><b>Email:</b> {session.user?.email}</p>
      {/* <p><b>Role:</b> {session.user?.role}</p> */}
      <p><b>ID:</b> {session.user?.id}</p>
     
    </div>
  )
}
