'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const services = [
  { id: "web-dev", name: "Custom Web Development", img: "https://picsum.photos/seed/webdev/800/600", description: "Full-stack websites built for performance, SEO, and conversions — React/Next.js, Node.js backends, and headless CMS integration.", price: 1500, tags: ["Web", "Full-stack"] },
  { id: "mobile-app", name: "Mobile App Development", img: "https://picsum.photos/seed/mobileapp/800/600", description: "High-performance iOS & Android apps with smooth UX, push notifications, and backend integration.", price: 2500, tags: ["Mobile", "iOS", "Android"] },
  { id: "ecommerce", name: "E-commerce Solutions", img: "https://picsum.photos/seed/ecommerce/800/600", description: "Secure, scalable online stores with payment gateways, inventory management, and mobile-first design.", price: 2200, tags: ["E-commerce", "Shopify", "Magento"] },
  { id: "uiux", name: "UI/UX Design", img: "https://picsum.photos/seed/uiux/800/600", description: "Intuitive interfaces and interactive designs that enhance usability and engagement across platforms.", price: 900, tags: ["Design", "UX", "UI"] },
  { id: "seo", name: "SEO Optimization", img: "https://picsum.photos/seed/seo/800/600", description: "Improve search rankings with keyword strategy, technical SEO, on-page and off-page optimization.", price: 700, tags: ["SEO", "Marketing"] },
  { id: "content", name: "Content Creation", img: "https://picsum.photos/seed/content/800/600", description: "Engaging blog posts, videos, and social media content to boost brand awareness and conversions.", price: 500, tags: ["Content", "Marketing", "Social Media"] },
  { id: "ppc", name: "PPC Advertising", img: "https://picsum.photos/seed/ppc/800/600", description: "Maximize ROI with Google Ads, Facebook Ads, and retargeting campaigns for your business.", price: 800, tags: ["Ads", "Marketing"] },
  { id: "branding", name: "Brand Identity Design", img: "https://picsum.photos/seed/branding/800/600", description: "Memorable brand logos, color palettes, typography, and style guides that make your business stand out.", price: 1200, tags: ["Branding", "Design"] },
  { id: "saas", name: "SaaS Product Development", img: "https://picsum.photos/seed/saas/800/600", description: "Build scalable SaaS platforms with subscription billing, analytics dashboards, and seamless UX.", price: 4000, tags: ["SaaS", "Product"] },
  { id: "qa", name: "QA & Testing", img: "https://picsum.photos/seed/qa/800/600", description: "Automated and manual testing to ensure bug-free, reliable software and smooth user experiences.", price: 500, tags: ["QA", "Testing"] },
  { id: "digital-marketing", name: "Digital Marketing", img: "https://picsum.photos/seed/marketing/800/600", description: "SEO, social media, email campaigns, and content marketing to grow your online presence.", price: 1000, tags: ["Marketing", "Digital"] },
  { id: "cloud", name: "Cloud Hosting & DevOps", img: "https://picsum.photos/seed/cloud/800/600", description: "Scalable cloud solutions with 24/7 monitoring, server management, and performance optimization.", price: 800, tags: ["Cloud", "DevOps"] },
  { id: "analytics", name: "Data Analytics & BI", img: "https://picsum.photos/seed/analytics/800/600", description: "Transform data into insights with dashboards, visualization, and actionable analytics.", price: 1200, tags: ["Analytics", "BI", "Data"] },
  { id: "cybersecurity", name: "Cybersecurity Solutions", img: "https://picsum.photos/seed/cybersecurity/800/600", description: "Protect your applications and data with audits, penetration testing, and threat monitoring.", price: 1500, tags: ["Security", "IT"] },
  { id: "crm", name: "CRM Development & Integration", img: "https://picsum.photos/seed/crm/800/600", description: "Custom CRM solutions to manage clients, automate sales processes, and track leads effectively.", price: 2000, tags: ["CRM", "Sales", "Automation"] },
  { id: "email-marketing", name: "Email Marketing Campaigns", img: "https://picsum.photos/seed/email/800/600", description: "Engage your audience with targeted email sequences, newsletters, and drip campaigns.", price: 600, tags: ["Email", "Marketing"] },
  { id: "video-production", name: "Video Production & Editing", img: "https://picsum.photos/seed/video/800/600", description: "Professional videos, animations, and editing to tell your brand story effectively.", price: 1200, tags: ["Video", "Content"] },
  { id: "social-media", name: "Social Media Management", img: "https://picsum.photos/seed/social/800/600", description: "Manage and grow your social platforms with content, engagement, and analytics.", price: 900, tags: ["Social", "Marketing"] },
  { id: "ai-solutions", name: "AI & Machine Learning", img: "https://picsum.photos/seed/ai/800/600", description: "Integrate AI models and machine learning pipelines to automate tasks and extract insights.", price: 3000, tags: ["AI", "ML"] },
  { id: "iot", name: "IoT Development", img: "https://picsum.photos/seed/iot/800/600", description: "Design and deploy IoT solutions with sensors, automation, and real-time monitoring.", price: 2500, tags: ["IoT", "Hardware"] },
];


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
            <div className="px-4 py-2 bg-white rounded-md shadow-sm">
              <span className="font-medium text-gray-800">{services.length}</span>
            </div>
            <Link href="/contact" className="ml-2 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700">
              Contact Sales
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((s) => (
            <article key={s.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition transform hover:-translate-y-1">
              <div className="relative h-44 w-full rounded-t-2xl overflow-hidden">
                <Image src={s.img} alt={s.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute left-3 top-3 bg-white/80 text-xs px-2 py-1 rounded-md font-semibold">{s.tags[0]}</div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{s.name}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{s.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">${s.price}</span>
                    <span className="text-xs text-gray-500">starting</span>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/services/${s.id}`} className="inline-flex items-center px-3 py-1.5 border rounded-md text-sm text-indigo-700 border-indigo-100 hover:bg-indigo-50">
                      View 
                    </Link>
                    <Link href={`/contact?service=${encodeURIComponent(s.name)}`} className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
                      Hire Now
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h4 className="text-lg font-semibold">Don't see exactly what you need?</h4>
            <p className="text-sm text-gray-600">We offer custom engagements and can craft a package that fits your needs and budget.</p>
          </div>
          <div>
            <Link href="/contract" className="inline-block bg-indigo-600 text-white px-5 py-3 rounded-md shadow hover:bg-indigo-700">
              Talk to an Expert
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
