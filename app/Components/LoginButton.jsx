'use clint'
import React from 'react'
import {signIn } from "next-auth/react"
export default function LoginButton() {
  return (
    <div>
        
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"

         onClick={() => signIn()}> LogIn</button>
    </div>
  )
}
