// app/payment/page.js
"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function PaymentPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [amount, setAmount] = useState(100); // Default amount

  const products = [
    { id: 1, name: 'Basic Plan', price: 100, description: 'Basic features' },
    { id: 2, name: 'Pro Plan', price: 200, description: 'Pro features' },
    { id: 3, name: 'Premium Plan', price: 300, description: 'Premium features' },
  ];

  const handlePayment = async (product) => {
    if (!session) {
      Swal.fire('Error', 'Please login to make a payment', 'error');
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'stripe') {
        await processStripePayment(product);
      } else if (paymentMethod === 'sslcommerz') {
        await processSSLCommerzPayment(product);
      } else if (paymentMethod === 'nogod') {
        await processNogodPayment(product);
      } else if (paymentMethod === 'bkash') {
        await processBkashPayment(product);
      }
    } catch (error) {
      console.error('Payment error:', error);
      Swal.fire('Error', 'Payment processing failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const processStripePayment = async (product) => {
    const response = await fetch('/api/payment/strip-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: product.price,
        currency: 'usd',
        productName: product.name,
        customerEmail: session.user.email,
        successUrl: `/payment/success?method=stripe&product=${product.name}`,
        cancelUrl: '/payment/cancel',
      }),
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = result.url;
    } else {
      throw new Error(result.error);
    }
  };

  const processSSLCommerzPayment = async (product) => {
    const response = await fetch('/api/payment/sslcommerz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        total_amount: product.price,
        currency: 'BDT',
        product_name: product.name,
        customer_name: session.user.name,
        customer_email: session.user.email,
        customer_phone: '017XXXXXXXX', // You can collect this from user
      }),
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = result.payment_url;
    } else {
      throw new Error(result.error);
    }
  };

  const processNogodPayment = async (product) => {
    // For Nagad, you can use SSL Commerz as they support Nagad
    await processSSLCommerzPayment(product);
  };

  const processBkashPayment = async (product) => {
    // For bKash, you can use SSL Commerz as they support bKash
    await processSSLCommerzPayment(product);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Choose Your Plan
          </h1>
          <p className="text-gray-600">Select a plan and payment method</p>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Select Payment Method
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'stripe', name: 'Stripe', icon: '💳' },
              { id: 'sslcommerz', name: 'SSL Commerz', icon: '🏦' },
              { id: 'nogod', name: 'Nagad', icon: '📱' },
              { id: 'bkash', name: 'bKash', icon: '📱' },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  paymentMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{method.icon}</div>
                <div className="font-medium text-gray-800">{method.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-100"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="text-3xl font-bold text-blue-600 mb-6">
                  ${product.price}
                </div>
                <button
                  onClick={() => handlePayment(product)}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition flex items-center justify-center gap-2 font-medium"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-shopping-cart"></i>
                      Buy Now
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Amount Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Custom Amount
          </h2>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                step="0.01"
              />
            </div>
            <button
              onClick={() => handlePayment({ name: 'Custom Payment', price: amount })}
              disabled={loading || amount <= 0}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-green-400 transition font-medium"
            >
              Pay Custom Amount
            </button>
          </div>
        </div>

        {/* Payment Method Info */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Payment Method Information:
          </h3>
          <ul className="text-yellow-700 text-sm list-disc list-inside space-y-1">
            <li><strong>Stripe:</strong> International cards (Visa, MasterCard, Amex)</li>
            <li><strong>SSL Commerz:</strong> Local Bangladeshi banks</li>
            <li><strong>Nagad:</strong> Mobile financial service</li>
            <li><strong>bKash:</strong> Mobile financial service</li>
          </ul>
        </div>
      </div>
    </div>
  );
}