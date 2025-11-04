'use client';
import { useState } from 'react';
import OrderButton from "@/app/Components/OrderButton";
import Image from "next/image";
import { services } from '@/app/lib/servicesData';
// import { services } from '@/lib/servicesData';

export default function ServiceDetailsPage({ params }) {
  const [activeTab, setActiveTab] = useState('overview');

  const s = services.find((r) => r.id === params.id);

  if (!s) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h1>
          <p className="text-gray-600">The service you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-blue-600">Home</a></li>
            <li>→</li>
            <li><a href="/services" className="hover:text-blue-600">Services</a></li>
            <li>→</li>
            <li className="text-blue-600 font-medium">{s.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="lg:flex">
            {/* Left Content */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                  {s.tags.join(" • ")}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{s.name}</h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-6">{s.description}</p>
                
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">${s.price}</span>
                    <span className="text-gray-500 ml-2">starting price</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-yellow-400 mb-1">
                      {"★".repeat(5)}
                      <span className="text-gray-600 ml-2 text-sm">(4.9/5)</span>
                    </div>
                    <span className="text-sm text-gray-500">50+ projects completed</span>
                  </div>
                </div>
              </div>

              <OrderButton s={s} />

              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{s.timeline}</div>
                  <div className="text-sm text-gray-600">Delivery Time</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:w-1/2 relative">
              <Image
                src={s.img}
                width={600}
                height={600}
                alt={s.name}
                className="w-full h-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                <div className="text-white">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm">Available for new projects</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto">
              {['overview', 'process', 'responsibilities', 'deliverables'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8 lg:p-12">
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Service Overview</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our {s.name.toLowerCase()} service is designed to deliver exceptional results 
                    through a combination of technical expertise and creative problem-solving. 
                    We follow industry best practices to ensure your project exceeds expectations.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-3">What's Included</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Professional consultation and planning
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Regular progress updates
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Quality assurance testing
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Post-launch support
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'process' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Our Process</h3>
                <div className="space-y-6">
                  {s.process.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{step}</h4>
                        <p className="text-gray-600">
                          Detailed description of this phase including timelines and deliverables.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'responsibilities' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Key Responsibilities</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {s.responsibilities.map((responsibility, index) => (
                    <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{responsibility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'deliverables' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Project Deliverables</h3>
                <div className="grid gap-4">
                  {s.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <span>{deliverable}</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Included
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 lg:p-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Let's discuss your project requirements and create something amazing together. 
                Get a free consultation and project estimate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <OrderButton s={s} />
                <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}