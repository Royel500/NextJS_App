import Link from 'next/link';
import React from 'react';
import Image from 'next/image'

export const metadata = {
  title: "Trying to see Service in Next.js App",
  description: "Trying to see services in  Next.js For the Future ",
};


const servicesPage = () => {
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




    return (
      <div>
  <p className='text-center my-20 text-4xl font-bold'>Services Page</p>

  {/* Show total count */}
  <p className='text-center font-semibold mb-10'>Total Services: {services.length}</p>

  {/* Services list */}
  <div className="grid lg:grid-cols-3 gap-8">
  {services.map((ser) => (
    <div key={ser.id} className="bg-white rounded-lg shadow-md p-4 text-center">
      <p className="text-lg font-semibold mb-4">{ser.name}</p>

      <Link href={`services/${ser.id}`}>
        <Image
        
  src={ser.img}
  alt={ser.name}
  width={400}
  height={300}
  className="mx-auto mb-4 rounded-lg w-full h-60 object-cover"
/>
      </Link>

      <p className="text-gray-600 text-sm">
        {ser.description.substring(0, 100)}...
      </p>
    </div>
  ))}
</div>

  
</div>

    );
};

export default servicesPage;