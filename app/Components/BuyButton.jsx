// components/BuyButton.js
"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function BuyButton({ product, className = '' }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleBuyClick = () => {
    if (!session) {
      // Redirect to login if not authenticated
      router.push('/login?redirect=/payment');
    } else {
      // Redirect to payment page with product details
      router.push(`/products/payment=${encodeURIComponent(product.name)}&price=${product.price}`);
    }
  };

  return (
    <button
      onClick={handleBuyClick}
      className={`bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium ${className}`}
    >
      <i className="fas fa-shopping-cart mr-2"></i>
      Buy Now
    </button>
  );
}