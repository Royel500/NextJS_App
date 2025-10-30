'use client';
import OrderButton from "@/app/Components/OrderButton";
import Image from "next/image";
export default function serviceDetailsPAge({ params }) {
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

  const singleData = services.find((data) => data?.id ===(params?.id))

  return (
    <div className="lg:flex py-5 items-center justify-center min-h-screen bg-gray-100 lg:p-8">
      <div className="lg:flex bg-white rounded-lg shadow-lg max-w-4xl w-full">
        <div className="lg:w-1/2 p-8 text-left">
          <p className="text-2xl font-semibold mb-4">{singleData?.name}</p>
          <p className="mb-6 text-gray-700 leading-relaxed">{singleData?.description}</p>
          <p className="font-medium text-gray-500">ID: <span className="text-black">{singleData?.id}</span></p>
          <OrderButton service={singleData} />
        </div>
        <div className="lg:w-1/2">
          <Image src={singleData?.img} 
          width={60}
          height={50}
          alt={singleData?.name}
          className="h-full w-full object-cover rounded-r-lg"/>
        </div>
      </div>
    </div>
  )
}
