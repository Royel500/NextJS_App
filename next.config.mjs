/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
        {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**', // allow all paths from picsum
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // since you use placeholders too
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
