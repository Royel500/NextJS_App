'use client'
import Link from "next/link";
import CountdownSection from "./Components/CountDown";
import Image from 'next/image'
import { useEffect, useState } from "react";
import CountdownForHome from "./Components/CountdownFroHome";

export default function Home() {
 const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
    const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/items', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      Swal.fire('Error', 'Failed to load products.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  return (
    <section className="min-h-screen">
      {/* Hero Section */}
      <div
  className="relative bg-cover bg-center text-white py-32"
  style={{ backgroundImage: "url('/imgwayer.webp')" }}
>
  <div className=" mx-auto px-4 text-center">
    <h1 className="text-5xl md:text-6xl font-bold mb-6">Discover Amazing Products</h1>
    <p className="text-xl mb-8 max-w-2xl mx-auto">
      Find everything you need with our curated collection of premium products at unbeatable prices.
    </p>
    <Link href={'/products'}>
        <button className="bg-white text-blue-600 font-bold py-3 px-8 
    rounded-full text-lg hover:bg-gray-100 transition duration-300">
      Shop Now
    </button>
    </Link>

  </div>
</div>


      {/* Featured Categories */}
      <div className="py-16 bg-gray-50">
        <div className=" mx-10 px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
              <div className="h-48 bg-blue-100 flex items-center justify-center">
                <span className="text-4xl">📱</span>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Electronics</h3>
                <p className="text-gray-600">Latest gadgets and devices</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
              <div className="h-48 bg-green-100 flex items-center justify-center">
                <span className="text-4xl">👕</span>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Fashion</h3>
                <p className="text-gray-600">Trendy clothes and accessories</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
              <div className="h-48 bg-yellow-100 flex items-center justify-center">
                <span className="text-4xl">🏠</span>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Home & Living</h3>
                <p className="text-gray-600">Furniture and decor items</p>
              </div>
            </div>
          </div>
        </div>
      </div>

{/* Featured Products */}
<div className="py-16">
  <div className=" mx-10 px-4">
    <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
      {(() => {
        // Better shuffle function
        const shuffleArray = (array) => {
          const newArray = [...array];
          for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
          }
          return newArray;
        };
        
        const featuredProducts = shuffleArray(products.slice(0, 10));
        
        return featuredProducts.map((item, index) => (
          <div key={item._id || item.sku || index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 relative flex items-center justify-center">
              <Image
                src={item?.imageUrl || "https://i.ibb.co/CKTpFTK5/images-2.jpg"}
                alt={item?.productName}
                width={300}
                height={180}
                unoptimized
                className="h-50 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold">Premium Product {item?.brand}</h3>
              <div className="flex items-center mt-2">
                <div className="flex text-yellow-400">
                  {"★".repeat(5)}
                </div>
                <span className="text-gray-600 ml-2">(42)</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xl font-bold">${ item?.price || item?.regularPrice || item?.todayPrice}</span>

                <button className="bg-blue-600 text-white py-2 px-4 rounded-lg 
                text-sm hover:bg-blue-700 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ));
      })()}
    </div>
    <div className="text-center mt-12">
      <Link href={'/products'} >
        <button  className="border-2 border-blue-600 text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-blue-600 hover:text-white transition">
          View All Products
        </button>
      </Link>
    </div>
  </div>
</div>


      {/* Promotional Banner */}
      <div className="py-16 bg-blue-50">
        <div className=" mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Summer Sale</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Enjoy up to 50% off on selected items. Limited time offer!
          </p>
  <CountdownForHome targetDate="2025-12-31T23:59:59" />

        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-gray-100">
        <div className=" mx-10 px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex text-yellow-400 mb-4">
                  {"★".repeat(5)}
                </div>
                <p className="text-gray-700 mb-4">
                  I absolutely love the products I purchased. The quality is exceptional and the delivery was super fast!
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Customer {item}</h4>
                    <p className="text-gray-600">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


    <CountdownSection></CountdownSection>
    </section>
  );
}