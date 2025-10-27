'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Bike, 
  ShoppingCart, 
  Heart, 
  Star, 
  TrendingUp, 
  Package, 
  CreditCard, 
  MapPin,
  Clock,
  Shield,
  Award
} from 'lucide-react' ;

import { useSession } from 'next-auth/react';


export default function UsersDashboard() {
  // const { data: session } = useSession()
  const { data: session } = useSession();
  const [recommended,setRecommended]=useState([]);
  // Mock data - replace with actual data from your API
  const userStats = {
    totalOrders: 12,
    pendingOrders: 2,
    totalSpent: 2450.00,
    favoriteBike: 'Yamaha R15',
    loyaltyPoints: 450,
    memberSince: '2024-01-15'
  }
const services = [
  {
    id: "dh452sd214f2g121",
    name: "Web Development",
    img: "https://picsum.photos/seed/webdev/400/300",
    description: "Our web development services include building responsive, fast-loading, and SEO-friendly websites tailored specifically to your business needs. From custom design to deployment, we cover all aspects ensuring your website stands out in today's digital market.",
    price: 1200
  },
  {
    id: "af48g5sdfgg12grt5",
    name: "Mobile App Development",
    img: "https://picsum.photos/seed/mobileapp/400/300",
    description: "We create high-performance mobile applications for iOS and Android platforms. Whether you're a startup or an enterprise, our mobile solutions are designed to engage your customers and drive growth with user-friendly interfaces and seamless performance.",
    price: 2500
  },
  {
    id: "kj78fd4521ddgqw4",
    name: "UI/UX Design",
    img: "https://picsum.photos/seed/uiux/400/300",
    description: "Our design team focuses on delivering exceptional UI/UX design experiences. We craft intuitive user interfaces combined with interactive user journeys, ensuring that your digital products not only look great but are also easy to navigate and enjoyable to use.",
    price: 800
  },
  {
    id: "ppqwe123xvzn541f",
    name: "SEO Optimization",
    img: "https://picsum.photos/seed/seo/400/300",
    description: "Maximize your website’s visibility and rankings with our advanced SEO services. We provide comprehensive keyword research, on-page and off-page optimization, and continuous monitoring to help your website reach the top of search engine results pages.",
    price: 600
  },
  {
    id: "mnp98sdg7hj212d",
    name: "Digital Marketing",
    img: "https://picsum.photos/seed/marketing/400/300",
    description: "Our digital marketing strategies include SEO, social media management, pay-per-click advertising, and content marketing to help you grow your brand’s online presence and generate more leads. Our expert team works with you to achieve measurable results.",
    price: 1000
  },
  {
    id: "ec42rdsf1wevc93z",
    name: "E-commerce Solutions",
    img: "https://picsum.photos/seed/ecommerce/400/300",
    description: "Launch your online store with our full-service e-commerce solutions. We develop secure, scalable, and user-friendly platforms complete with payment gateway integration, product management systems, and mobile optimization for seamless shopping experiences.",
    price: 2200
  },
  {
    id: "cntcr34512ggsd21",
    name: "Content Creation",
    img: "https://picsum.photos/seed/contentcreation/400/300",
    description: "We specialize in creating high-quality written, visual, and video content that captures your brand's voice. From blog posts to promotional videos and social media content, we help communicate your message effectively to engage and grow your audience.",
    price: 500
  },
  {
    id: "cld9whosd1234gj2",
    name: "Cloud Hosting",
    img: "https://picsum.photos/seed/cloudhosting/400/300",
    description: "Ensure your applications and websites are fast, secure, and always available with our cloud hosting services. We provide scalable solutions including virtual servers, managed hosting, and 24/7 monitoring to keep your business online and performing optimally.",
    price: 300
  }
];

  const recentOrders = [
    { id: 1, product: 'Yamaha MT-15', price: 2450, status: 'Delivered', date: '2024-03-15' },
    { id: 2, product: 'Honda CBR 150R', price: 2200, status: 'Processing', date: '2024-03-18' },
    { id: 3, product: 'Suzuki Gixxer SF', price: 1950, status: 'Delivered', date: '2024-03-10' }
  ]
 
  useEffect(() => {
    fetch('/api/items')
      .then(res => res.json())
      .then(data => {
        setRecommended(data || []); // Ensure it's always an array
      })
      .catch(error => {
        console.error('Error fetching recommended items:', error);
        setRecommended([]); // Set empty array on error
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  }, []);

  console.log('Recommended data:', recommended);

// console.log(session?.user)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {session?.user?.name || 'Rider'}! 🏍️
              </h1>
              <p className="text-blue-100 text-lg">
                Ready for your next adventure? Check out our latest bikes and gear.
              </p>
              <div className="flex items-center mt-4 space-x-4 text-sm">
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  <span>Loyalty Points: {userStats.loyaltyPoints}</span>
                </div>
                {/* <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Member since {new Date(session?.user?.createdAt).toLocaleDateString()}</span>
                </div> */}
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <Link 
                href="/products" 
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2"
              >
                <Bike className="w-5 h-5" />
                Shop New Bikes
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{userStats.totalOrders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-gray-800">${userStats.totalSpent.toLocaleString()}</p>
              </div>
              <CreditCard className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-800">{userStats.pendingOrders}</p>
              </div>
              <Package className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Favorite Bike</p>
                <p className="text-lg font-bold text-gray-800 truncate">{userStats.favoriteBike}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recent Orders
              </h2>
              <Link href="/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
          {recommended
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by creation date
    .slice(0, 8) // Take only first 5
    .map((item) => (
      <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.productName}
              className="w-16 h-16 object-cover rounded-lg"
            />
          ) : (
            <Bike className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{item.productName}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm font-bold text-green-600">
              ${(item.todayPrice || item.price || 0).toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Link 
          href={`/products/${item._id}`}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          View
        </Link>
      </div>
    ))}
            </div>
          </div>

          {/* Recommended for You */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Recommended for You
              </h2>
              <Link href="/services" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                See More
              </Link>
            </div>
            
            <div className="space-y-4">
              {services.map((bike) => (
                <div key={bike.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Bike className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{bike.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{bike.rating}</span>
                      </div>
                      <span className="text-sm font-bold text-green-600">${bike.price.toLocaleString()}</span>
                    </div>
                  </div>
                     <Link href="/services" className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                View
              </Link>

            
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/products?category=sports" className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition group">
              <Bike className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="font-semibold text-blue-800">Sports Bikes</p>
            </Link>
            
            <Link href="/products?category=cruiser" className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 transition group">
              <Bike className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="font-semibold text-green-800">Cruiser Bikes</p>
            </Link>
            
            <Link href="/products?category=accessories" className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100 transition group">
              <Package className="w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="font-semibold text-purple-800">Accessories</p>
            </Link>
            
            <Link href="/user-dashboard/manageprofile" className="bg-orange-50 p-4 rounded-lg text-center hover:bg-orange-100 transition group">
              <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="font-semibold text-orange-800">My Profile</p>
            </Link>
          </div>
        </div>

        {/* Special Offers */}
        <div className="mt-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">🚀 Limited Time Offer!</h2>
              <p className="text-orange-100">
                Get 15% off on all helmet purchases this month. Ride safe, ride smart!
              </p>
            </div>
            <Link 
              href="/products?category=helmets" 
              className="mt-4 md:mt-0 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition inline-block"
            >
              Shop Helmets
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}