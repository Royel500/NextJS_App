
'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Countdown Section Component
export default function CountdownSection() {
  // Define end times for each countdown (3 days from now, 2 days, etc.)
  const [endTimes] = useState([
    new Date().getTime() + 3 * 24 * 60 * 60 * 1000, // 3 days from now
    new Date().getTime() + 2 * 24 * 60 * 60 * 1000, // 2 days from now
    new Date().getTime() + 1 * 24 * 60 * 60 * 1000, // 1 day from now
    new Date().getTime() + 15 * 60 * 60 * 1000,     // 15 hours from now
  ]);

  const [timeLeft, setTimeLeft] = useState(endTimes.map(endTime => calculateTimeLeft(endTime)));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(endTimes.map(endTime => calculateTimeLeft(endTime)));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft(endTime) {
    const difference = endTime - new Date().getTime();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  }

  const products = [
    {
      title: "Electronics",
      description: "Premium gadgets",
      discount: "30%",
      originalPrice: "$289",
      discountedPrice: "$199",
      bgColor: "bg-sky-500",
      buttonColor: "bg-sky-500 hover:bg-blue-500"
    },
    {
      title: "Fashion",
      description: "Trendy collection",
      discount: "25%",
      originalPrice: "$105",
      discountedPrice: "$79",
      bgColor: "bg-sky-500",
      buttonColor: "bg-sky-500 hover:bg-blue-600"
    },
    {
      title: "Home & Kitchen",
      description: "Quality items",
      discount: "40%",
      originalPrice: "$249",
      discountedPrice: "$149",
      bgColor: "bg-sky-500",
      buttonColor: "bg-sky-500 hover:bg-green-600"
    },
    {
      title: "Beauty Products",
      description: "Premium care",
      discount: "35%",
      originalPrice: "$137",
      discountedPrice: "$89",
      bgColor: "bg-sky-500",
      buttonColor: "bg-sky-500 hover:bg-purple-600"
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className=" mx-10 px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Limited Time Offers</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Don't miss out on these exclusive deals. Offers expire soon!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
              <div className={`h-40 ${product.bgColor} relative`}>
                <div className="absolute top-3 right-3 bg-white text-gray-800 font-bold py-1 px-3 rounded-full text-sm">
                  -{product.discount}
                </div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-bold text-xl">{product.title}</h3>
                  <p className="text-sm">{product.description}</p>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-gray-800">{product.discountedPrice}</span>
                  <span className="text-gray-400 line-through">{product.originalPrice}</span>
                </div>
                <div className="mb-4">
                  <p className="text-gray-500 text-sm mb-2">Offer ends in:</p>
                  <div className="flex space-x-2">
                    <div className="bg-gray-100 rounded-md p-2 text-center flex-1">
                      <span className="font-bold text-lg">{String(timeLeft[index]?.days || 0).padStart(2, '0')}</span>
                      <p className="text-xs text-gray-500">Days</p>
                    </div>
                    <div className="bg-gray-100 rounded-md p-2 text-center flex-1">
                      <span className="font-bold text-lg">{String(timeLeft[index]?.hours || 0).padStart(2, '0')}</span>
                      <p className="text-xs text-gray-500">Hours</p>
                    </div>
                    <div className="bg-gray-100 rounded-md p-2 text-center flex-1">
                      <span className="font-bold text-lg">{String(timeLeft[index]?.minutes || 0).padStart(2, '0')}</span>
                      <p className="text-xs text-gray-500">Mins</p>
                    </div>
                    <div className="bg-gray-100 rounded-md p-2 text-center flex-1">
                      <span className="font-bold text-lg">{String(timeLeft[index]?.seconds || 0).padStart(2, '0')}</span>
                      <p className="text-xs text-gray-500">Secs</p>
                    </div>
                  </div>
                </div>
  <Link href={`/products?category=${encodeURIComponent(product.title)}`}>
  <button
    className={`w-full ${product.buttonColor} text-white py-2 rounded-lg font-semibold transition`}
  >
    Shop Now
  </button>
</Link>

         
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}