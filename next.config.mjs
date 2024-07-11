/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "your-production-domain.com"],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

export default nextConfig;
