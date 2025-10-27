'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { getCart, saveCart, removeFromCart, clearCart } from '@/app/api/utils/cartUtils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setCart(getCart());
  }, []);

  const updateQuantity = (id, newQty) => {
    const updated = cart.map(item =>
      item._id === id ? { ...item, quantity: Math.max(1, newQty) } : item
    );
    setCart(updated);
    saveCart(updated);
  };

  const handleRemove = (id) => {
    const updated = removeFromCart(id);
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
        clearCart();
        setCart([]);
      }
    });
  };

//   const processPayment = async () => {
//     if (!session) {
//       Swal.fire({
//         title: 'Login Required',
//         text: 'Please login to proceed with payment',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonText: 'Login',
//         cancelButtonText: 'Cancel'
//       }).then((result) => {
//         if (result.isConfirmed) {
//           router.push('/login?redirect=/cart');
//         }
//       });
//       return;
//     }

//     setProcessingPayment(true);

//     try {
//       const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
//       console.log('🔄 Processing cart payment for', cart.length, 'items');

//       // 1. Update stock and sales for each product in cart
//       const updatePromises = cart.map(async (item) => {
//         try {
//           const currentStock = parseInt(item.stockQuantity) || 0;
//           const currentTotalSold = parseInt(item['totalSold '] || item.totalSold || 0);
          
//           const newStockQuantity = currentStock - item.quantity;
//           const newTotalSold = currentTotalSold + item.quantity;

//           console.log(`📦 Updating ${item.productName}:`, {
//             currentStock,
//             currentTotalSold,
//             quantity: item.quantity,
//             newStockQuantity,
//             newTotalSold
//           });

//           const updateResponse = await fetch(`/api/items/${item._id}`, {
//             method: 'PUT',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               stockQuantity: newStockQuantity.toString(),
//               'totalSold ': newTotalSold.toString()
//             }),
//           });

//           const updateResult = await updateResponse.json();
          
//           if (updateResult.success) {
//             console.log(`✅ Updated ${item.productName} successfully`);
//             return { success: true, item: item.productName };
//           } else {
//             console.error(`❌ Failed to update ${item.productName}:`, updateResult.error);
//             return { success: false, item: item.productName, error: updateResult.error };
//           }
//         } catch (error) {
//           console.error(`💥 Error updating ${item.productName}:`, error);
//           return { success: false, item: item.productName, error: error.message };
//         }
//       });

//       // Wait for all inventory updates to complete
//       const updateResults = await Promise.all(updatePromises);
      
//       // Check if any updates failed
//       const failedUpdates = updateResults.filter(result => !result.success);
      
//       if (failedUpdates.length > 0) {
//         console.warn('⚠️ Some inventory updates failed:', failedUpdates);
//         // Continue with payment but show warning
//       }

//       // 2. Show processing completion
//       await Swal.fire({
//         title: 'Processing Payment...',
//         text: 'Completing your order...',
//         icon: 'info',
//         timer: 2000,
//         showConfirmButton: false
//       });

//       // 3. Clear the cart
//       clearCart();
//       setCart([]);

//       // 4. Create success URL with cart details
//       const productNames = cart.map(item => item.productName).join(', ');
//       const successUrl = `${window.location.origin}/payment/success?method=cart&products=${encodeURIComponent(productNames)}&items=${cart.length}&amount=${totalAmount}&transaction_id=${Date.now()}`;

//       // 5. Show final success message
//       await Swal.fire({
//         title: 'Payment Successful!',
//         html: `
//           <div class="text-center">
//             <p class="mb-2">Thank you for your purchase!</p>
//             <p class="text-sm text-gray-600">${cart.length} items processed successfully</p>
//             <p class="font-semibold">Total: $${totalAmount.toFixed(2)}</p>
//           </div>
//         `,
//         icon: 'success',
//         timer: 3000,
//         showConfirmButton: false
//       });

//       // 6. Redirect to success page
//       window.location.href = successUrl;

//     } catch (error) {
//       console.error('💥 Cart payment error:', error);
//       Swal.fire({
//         title: 'Payment Failed',
//         text: 'There was an error processing your payment. Please try again.',
//         icon: 'error',
//         confirmButtonText: 'OK'
//       });
//     } finally {
//       setProcessingPayment(false);
//     }
//   };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
        <Link href="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      {/* Cart Summary */}
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

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        {cart.map((item) => (
          <div key={item._id} className="flex items-center justify-between border-b py-4">
            <div className="flex items-center space-x-4">
              <Image
                src={item.imageUrl || '/placeholder.jpg'}
                alt={item.productName}
                width={80}
                height={80}
                className="rounded-md object-cover"
              />
              <div>
                <h2 className="font-semibold text-lg">{item.productName}</h2>
                {item.brand && <p className="text-gray-500 text-sm">Brand: {item.brand}</p>}
                <p className="text-gray-500">${item.price} × {item.quantity}</p>
                <p className="text-green-600 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                {item.stockQuantity && (
                  <p className={`text-sm ${item.stockQuantity < item.quantity ? 'text-red-500' : 'text-green-500'}`}>
                    Stock: {item.stockQuantity}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="btn btn-sm btn-outline" 
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button 
                className="btn btn-sm btn-outline" 
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                disabled={item.stockQuantity && item.quantity >= item.stockQuantity}
              >
                +
              </button>
              <button 
                className="btn btn-error btn-sm ml-4" 
                onClick={() => handleRemove(item._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Total: ${total.toFixed(2)}</h2>
          <p className="text-gray-600">{totalItems} items</p>
        </div>
        <div className="space-x-3">
          <button className="btn btn-outline" onClick={handleClear}>
            Clear Cart
          </button>
          {/* <button 
            className="btn btn-primary"
            onClick={processPayment}
            disabled={processingPayment || cart.length === 0}
          >
            {processingPayment ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              `Pay $${total.toFixed(2)}`
            )}
          </button> */}
        </div>
      </div>

      {/* Continue Shopping Link */}
      <div className="mt-6 text-center">
        <Link href="/products" className="text-blue-600 hover:text-blue-800 font-medium">
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}