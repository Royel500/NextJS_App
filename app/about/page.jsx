"use client";
import { useRouter } from 'next/navigation'

import React from 'react'

export default function AboutPage() {
  const router = useRouter();
  const isLoggedIn = true;
  const handleNavigation = () =>{
    if (isLoggedIn){
      router.push('/about/address');

    } else{
      router.push('/')
    }
  }

  return (
    <>
   
    <div className='font-bold'>About the board </div>
    <button className='btn' onClick={handleNavigation}>Go</button>
     </>
  )
}
