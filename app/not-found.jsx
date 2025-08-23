import Link from 'next/link'
import React from 'react'

export default function NotFoundPage404() {
  return (
    <div className='my-10 text-3xl text-center font-bold'>
        <p>Hey this is custom error page</p> 
        <p>404 Not Found</p>
        <Link href='/'>
 <button className='border  px-2 shadow'> Back </button>
        </Link>
        
        </div>
  )
}
