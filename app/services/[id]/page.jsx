'use client';
import OrderButton from "@/app/Components/OrderButton";
import Image from "next/image";
export default function serviceDetailsPAge({ params }) {
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
