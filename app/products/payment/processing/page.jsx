// app/payment/processing/page.js
'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function PaymentProcessing() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const processMockPayment = async () => {
      // Simulate payment processing
      setTimeout(() => {
        setStatus('success');
        setTransactionId(`TXN${Date.now()}`);
        
        // Auto redirect to success page after 3 seconds
        setTimeout(() => {
          window.location.href = `/payment/success?transaction_id=${transactionId}&status=success`;
        }, 3000);
      }, 3000);
    };

    processMockPayment();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-600 mb-4">
              Please wait while we process your payment...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
            </div>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Transaction ID: {transactionId}
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to success page...
            </p>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-4">
              Please try again or use a different payment method.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}