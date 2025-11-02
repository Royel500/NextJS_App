import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import OrderButton from '../Components/OrderButton';
import { services } from '../lib/servicesData';
// import { services } from '@/lib/servicesData';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Professional Services</h1>
            <p className="mt-2 text-gray-600 max-w-xl">
              End-to-end digital services to help you build, grow and scale — hand-crafted by experienced engineers, designers and strategists.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">Total Services</div>
            <div className="bg-white px-3 py-1 rounded-md border">
              <span className="font-medium text-gray-900">{services.length}</span>
            </div>
            <Link href="/contract" className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((s) => (
            <article key={s.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-44 w-full rounded-t-2xl overflow-hidden">
                <Image 
                  src={s.img} 
                  alt={s.name} 
                  fill 
                  style={{ objectFit: 'cover' }} 
                  sizes="(max-width: 768px) 100vw, 33vw" 
                />
                <div className="absolute left-3 top-3 bg-white/90 text-xs px-2 py-1 rounded-md font-semibold backdrop-blur-sm">
                  {s.tags[0]}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {s.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {s.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">${s.price}</span>
                    <span className="text-xs text-gray-500">starting</span>
                  </div>

                  <div className="flex gap-2">
                    <Link 
                      href={`/services/${s.id}`}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50 transition-colors"
                    >
                      Details
                    </Link>
                    <OrderButton s={s} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 bg-white rounded-xl p-8 shadow-sm border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Don't see exactly what you need?</h4>
              <p className="text-gray-600">We offer custom engagements and can craft a package that fits your specific needs and budget requirements.</p>
            </div>
            <div className="flex-shrink-0">
              <Link href="/contract" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition-colors font-medium">
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}