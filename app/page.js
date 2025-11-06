'use client'
import Link from "next/link";
import CountdownSection from "./Components/CountDown";
import Image from 'next/image'
import { useEffect, useState } from "react";
import CountdownForHome from "./Components/CountdownFroHome";
// update path if you moved the utils; keep the one that works in your project
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { addToCart } from "./api/utils/route";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  // derive a stable userKey for the current user (or undefined for guest)
  const userKey = session?.user?.email || session?.user?.id || undefined;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/items', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data || []);
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

  const handleAddToCart = (item) => {
    // pass userKey so cart is scoped to the current user/guest
    addToCart(item, 1, userKey);

    Swal.fire({
      title: 'Added to Cart!',
      text: `${item.productName || 'Product'} added to your cart`,
      icon: 'success',
      confirmButtonText: 'Go to Cart',
      showCancelButton: true,
      cancelButtonText: 'Continue Shopping'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/products/cart');
      }
    });
  };



  return (
    <section className="min-h-screen">
      {/* Hero Section */}
      <div
  className="relative bg-cover bg-center text-purple-700  py-32"
  style={{ backgroundImage: "url('https://i.postimg.cc/QdKptw32/image.png')" }}
>
  <div className=" lg:mx-80 mx-2 rounded-2xl bg-green-50  p-4 text-center">
    <h1 className="text-2xl md:text-5xl font-bold mb-6">Discover Amazing Products</h1>
    <p className="font-bold mb-2 max-w-2xl mx-auto">
      Find everything you need with our curated collection of premium products at unbeatable prices.
    </p>
    <Link href={'/products'}>
        <button className="bg-green-600 text-white font-bold py-3 px-8 
    rounded-full text-lg ">
      Shop Now
    </button>
    </Link>

  </div>
</div>


      {/* Featured Categories */}
      <div className="py-16 bg-gray-50">
        <div className=" mx-10 px-4">
          <p>Admin Email : <span className="text-green-600 font-bold "> suma@gmail.com   </span>And Password :<span className="text-green-600 font-bold ">123456</span></p>
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href={`/products?category=${encodeURIComponent('Electronics')}`}>
                       <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
              <div className="h-48 bg-blue-100 flex items-center justify-center">
                <span className="text-4xl">📱</span>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Electronics</h3>
                <p className="text-gray-600">Latest gadgets and devices</p>
              </div>
            </div>
            
            </Link>

 <Link href={`/products?category=${encodeURIComponent('Fashion')}`}>

            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
              <div className="h-48 bg-green-100 flex items-center justify-center">
                <span className="text-4xl">👕</span>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Fashion</h3>
                <p className="text-gray-600">Trendy clothes and accessories</p>
              </div>
            </div>
             </Link>
<Link href={`/products?category=${encodeURIComponent('Home & Kitchen')}`}>


            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
              <div className="h-48 bg-yellow-100 flex items-center justify-center">
                <span className="text-4xl">🏠</span>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Home & Living</h3>
                <p className="text-gray-600">Furniture and decor items</p>
              </div>
            </div>
            </Link>
          </div>
        </div>
      </div>

{/* Featured Products */}
<div className="py-16">
  <div className="mx-10 px-4">
    <h2 className="text-3xl font-bold text-center mb-12">Most Recent Products</h2>

    {/* Product Grid (5 per row, max 10 rows) */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {(() => {
        // Shuffle and limit to 50 products (5×10 grid)
        const shuffleArray = (array) => {
          const newArray = [...array];
          for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
          }
          return newArray;
        };

        const featuredProducts = shuffleArray(products.slice(0, 25)); // Max 50 visible

        return featuredProducts.map((item, index) => (
          <div
            key={item._id || item.sku || index}
            className="bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0"
          >
            <div className="relative h-44">
              <Link href={`products/${item._id}`}>
              <Image
                src={item?.imageUrl || "https://i.ibb.co/CKTpFTK5/images-2.jpg"}
                alt={item?.productName || `Product ${index + 1}`}
                width={288}
                height={180}
                unoptimized
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
                </Link>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold line-clamp-2 min-h-[3.5rem]">
                {item?.productName || `Premium Product ${item?.brand || ''}`}
              </h3>

              {item?.brand && (
                <p className="text-sm text-gray-500 mt-1">{item.brand}</p>
              )}

              <div className="flex items-center mt-2">
                <div className="flex text-yellow-400">{"★".repeat(5)}</div>
                <span className="text-gray-600 ml-2">(42)</span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xl font-bold">
                  ${item?.price || item?.regularPrice || item?.todayPrice || '0.00'}
                </span>

                <button
                  onClick={() => handleAddToCart(item)}
                  className="bg-blue-600 text-white whitespace-nowrap py-2 px-2 rounded-lg text-sm
                   hover:bg-blue-700 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ));
      })()}
    </div>

    {/* View All Button */}
    <div className="text-center mt-12">
      <Link href={'/products'}>
        <button className="border-2 border-blue-600 text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-blue-600 hover:text-white transition">
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