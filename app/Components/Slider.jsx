'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import Link from 'next/link'

export default function Slider() {
  return (
    <div
      className="relative bg-cover bg-center text-red-500 py-32"
      style={{ backgroundImage: "url('https://i.postimg.cc/QdKptw32/image.png')" }}
    >
      {/* Slider Overlay */}
      <div className="absolute inset-0">
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          className="h-full w-full"
        >
          {[
            'https://i.postimg.cc/QdKptw32/image.png',
            'https://i.postimg.cc/wMcgFZ9g/be88a25d-bfd4-4be1-b3b4-2757192af14c.jpg',
            'https://i.postimg.cc/Kv0yznzd/Black-Friday-web-banner-19.jpg',
            'https://i.postimg.cc/Gtz64Cc8/9887466.jpg',
            'https://i.postimg.cc/s2VScCyP/modern-sale-banner-website-slider-template-design-54925-46-1.avif',
          ].map((url, i) => (
            <SwiperSlide key={i}>
              <img
                src={url}
                alt={`Slide ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Content */}
      <div className="relative lg:mx-80 mx-2 rounded-2xl  bg-opacity-90 p-4 text-center z-10">
        <h1 className="text-2xl md:text-5xl font-bold mb-6">Discover Amazing Products</h1>
        <Link href="/products">
          <button className="bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-700">
            Shop Now
          </button>
        </Link>
      </div>
    </div>
  )
}
