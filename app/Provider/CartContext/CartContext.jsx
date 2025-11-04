// app/Provider/CartContext/CartContext.jsx (or .js)
'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getCart } from '@/app/api/utils/route'

const CartContext = createContext({ cartCount: 0, hideBadge: false })

export function CartProvider({ children }) {
  const { data: session } = useSession()
  const [cartCount, setCartCount] = useState(0)
  // "seen" indicates the user has viewed the cart since the last update.
  const [seen, setSeen] = useState(false)

  const userKey = session?.user?.email || session?.user?.id || undefined

  const computeCount = () => {
    try {
      const items = getCart(userKey)
      if (!Array.isArray(items)) return 0
      return items.reduce((s, it) => s + (parseInt(it.quantity, 10) || 0), 0)
    } catch (e) {
      console.error('computeCount error', e)
      return 0
    }
  }

  useEffect(() => {
    const update = () => {
      const count = computeCount()
      setCartCount(count)
      // any mutation to cart should make it "unseen" (so badge appears)
      setSeen(false)
    }

    const markViewed = () => {
      setSeen(true)
    }

    // initial load
    update()
    // custom same-tab event when cart changes
    window.addEventListener('cartUpdated', update)
    // cross-tab updates
    window.addEventListener('storage', update)
    // event fired by cart page when user visits cart
    window.addEventListener('cartViewed', markViewed)

    return () => {
      window.removeEventListener('cartUpdated', update)
      window.removeEventListener('storage', update)
      window.removeEventListener('cartViewed', markViewed)
    }
    // re-run when session changes so it reads correct userKey
  }, [session?.user?.email, session?.user?.id])

  // hide badge when user has viewed the cart or count is zero
  const hideBadge = cartCount === 0 || seen === true

  return (
    <CartContext.Provider value={{ cartCount, hideBadge }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
