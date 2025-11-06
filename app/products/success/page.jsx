// app/payment/success/page.js
'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Download, Share2, Home, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [updatingSales, setUpdatingSales] = useState(true);

  useEffect(() => {
    const updateProductSales = async (productId, quantity) => {
      try {
        console.log('🔄 Updating sales for product:', productId, 'Quantity:', quantity);
        
        const response = await fetch('/api/products/update-sales', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: productId,
            quantity: quantity
          }),
        });

        const result = await response.json();

        if (result.success) {
          console.log('✅ Sales updated successfully:', result);
        } else {
          console.error('❌ Failed to update sales:', result.error);
        }
      } catch (error) {
        console.error('❌ Error updating sales:', error);
      } finally {
        setUpdatingSales(false);
      }
    };

    const method = searchParams.get('method');
    const product = searchParams.get('product');
    const quantity = searchParams.get('quantity');
    const amount = searchParams.get('amount');
    const transaction_id = searchParams.get('transaction_id');
    const productId = searchParams.get('productId'); // Make sure to pass this from product page

    const details = {
      method: method || 'stripe',
      product: product || 'Unknown Product',
      productId: productId, // Important for updating sales
      quantity: quantity || '1',
      amount: amount || '0',
      transaction_id: transaction_id || `TXN${Date.now()}`,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    setPaymentDetails(details);

    // Update sales in database if we have productId
    if (productId && quantity) {
      updateProductSales(productId, parseInt(quantity));
    } else {
      setUpdatingSales(false);
      console.warn('⚠️ No productId found, skipping sales update');
    }

    // Log the successful payment
    console.log('💰 Payment Success:', details);

  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>

        {updatingSales && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-blue-700 font-medium">Updating inventory...</span>
            </div>
          </div>
        )}

        {paymentDetails && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-4 text-center">Payment Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Product:</span>
                <span className="font-medium">{paymentDetails.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">{paymentDetails.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-green-600">${paymentDetails.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="font-medium capitalize">{paymentDetails.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium text-xs">{paymentDetails.transaction_id}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-medium"
          >
            <ShoppingBag className="w-5 h-5" />
            Home
          </Link>
          
          <Link
            href="/products"
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 font-medium"
          >
            <Home className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}