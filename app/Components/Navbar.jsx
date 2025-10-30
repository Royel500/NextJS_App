'use client'
import Link from 'next/link'
import React from 'react'
import RegisterButton from './RegisterButton'
import { useSession } from 'next-auth/react'
import LogOutButton from './LogOutButton'
import LoginButton from './LoginButton'
import { ShoppingCart } from 'lucide-react';

// nothing to add
const Navbar = () => {
    const { data: session, status } = useSession();
  // Determine dashboard path based on role
  const dashboardLink = session?.user?.role === 'admin' 
    ? '/admin-dashboard' 
    : '/user-dashboard'



  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        {/* Mobile Dropdown */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> 
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 p-2 shadow">
          
            <li>  <Link href="/" >Home</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/products/addProduct">Add Products</Link></li>
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/about">About</Link></li>
                        <li>
              {session?.user ? (
                <Link href={dashboardLink}>Dashboard</Link>
              ) : (
                <Link href="/login">Dashboard</Link>
              )}
            </li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/about/address">Address</Link></li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">Next.JS</Link>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-5">
             <li>  <Link href="/" >Home</Link></li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/products/addProduct">Add Products</Link></li>
          <li><Link href="/products">Products</Link></li>
          <li><Link href="/about">About</Link></li>
                      <li>
              {session?.user ? (
                <Link href={dashboardLink}>Dashboard</Link>
              ) : (
                <Link href="/login">Dashboard</Link>
              )}
            </li>
          <li><Link href="/contract">Contact</Link></li>
        </ul>

      </div >

      {/* Auth Buttons */}
     <div className="navbar-end gap-3 flex">
              <li>
          <Link href="/products/cart"><ShoppingCart size={24} /></Link>
        </li>
        <div>

 
  {session?.user ? (
    <LogOutButton />
  ) : (
    <>
    <Link href={'/login'}>
    <button  className="px-4 py-2 mx-2 bg-blue-600 text-white rounded-lg
     hover:bg-blue-700 transition-all duration-300">
      Login
    </button >
    </Link>
      <RegisterButton />
    </>
  )}
         </div>
</div>

    </div>
  )
}

export default Navbar
