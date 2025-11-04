'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { getCart, saveCart, removeFromCart, clearCart } from '@/app/api/utils/route';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Derive userKey from session (or undefined for guest -> uses guest id in utils)
  const userKey = session?.user?.email || session?.user?.id || undefined;

  useEffect(() => {
    setCart(getCart(userKey));
   try { window.dispatchEvent(new Event('cartViewed')) } catch (e) {}
  }, [userKey]);

  const updateQuantity = (id, newQty) => {
    const updated = cart.map(item =>
      item._id === id ? { ...item, quantity: Math.max(1, newQty) } : item
    );
    setCart(updated);
    saveCart(updated, userKey);
  };

  const handleRemove = (id) => {
    const updated = removeFromCart(id, userKey);
    setCart(updated);
    Swal.fire('Removed!', 'Item removed from cart.', 'info');
  };

  const handleClear = () => {
    Swal.fire({
      title: 'Clear Cart?',
      text: 'Are you sure you want to remove all items?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear it!'
    }).then((r) => {
      if (r.isConfirmed) {
        clearCart(userKey);
        setCart([]);
      }
    });
  };

  // NEW: goToProduct -> navigate to product details page
  const goToProduct = (id) => {
    // If you want confirmation, you can add Swal here. For direct navigation:
    router.push(`/products/${id}`);
  };

  const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
        <Link href="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {/* Order summary */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-blue-800">Order Summary</h3>
            <p className="text-blue-600">{totalItems} items in cart</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-800">${total.toFixed(2)}</p>
            <p className="text-sm text-blue-600">Total Amount</p>
          </div>
        </div>
      </div>

      {/* Table view (desktop) */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
        <table className="min-w-full divide-y">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2 w-48">Product</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Subtotal</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {cart.map((item) => (
              <tr key={item._id} className="align-top">
                <td className="px-4 py-3">
                  <div className="w-28 h-20 relative">
                    <Image
                      src={item.imageUrl || '/placeholder.jpg'}
                      alt={item.productName}
                      fill
                      sizes="(max-width: 640px) 100px, 150px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="font-semibold">{item.productName}</div>
                </td>

                <td className="px-4 py-3">
                  ${Number(item.price || 0).toFixed(2)}
                </td>

                <td className="px-4 py-3">
                  <div className="inline-flex items-center border rounded-md overflow-hidden">
                    <button
                      className="px-3 py-1"
                      onClick={() => updateQuantity(item._id, Math.max(1, (item.quantity || 1) - 1))}
                      disabled={(item.quantity || 1) <= 1}
                    >-</button>
                    <div className="px-4 py-1">{item.quantity || 1}</div>
                    <button
                      className="px-3 py-1"
                      onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                    >+</button>
                  </div>
                </td>

                <td className="px-4 py-3 font-semibold">
                  ${(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </td>

                <td className="px-4 py-3 text-right space-x-2">
                  {/* BUY button -> navigate to product details page */}
                  <button
                    onClick={() => goToProduct(item._id)}
                    className="inline-block px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700"
                  >
                    Buy
                  </button>

                  {/* REMOVE button */}
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="inline-block px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile fallback: stacked cards */}
      <div className="mt-6 space-y-4 lg:hidden">
        {cart.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 relative">
                <Image
                  src={item.imageUrl || '/placeholder.jpg'}
                  alt={item.productName || 'The Royel Super Shop'}
                  fill
                  sizes="80px"
                  
                />
              </div>
              <div>
                <div className="font-semibold">{item.productName}</div>
                <div className="text-sm text-gray-500">${Number(item.price || 0).toFixed(2)} × {item.quantity}</div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <button onClick={() => goToProduct(item._id)} className="px-3 py-1 bg-green-600 text-white rounded">Buy</button>
              <button onClick={() => handleRemove(item._id)} className="px-3 py-1 bg-red-500 text-white rounded">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer actions */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Total: ${total.toFixed(2)}</h2>
          <p className="text-gray-600">{totalItems} items</p>
        </div>

        <div className="flex space-x-3">
          <button className="btn btn-outline" onClick={handleClear}>Clear Cart</button>
          {/* If you have a checkout flow, the Pay button goes here */}
          {/* <Link href="/checkout" className="btn btn-primary">Proceed to Checkout</Link> */}
        </div>
      </div>
    </div>
  );
}
