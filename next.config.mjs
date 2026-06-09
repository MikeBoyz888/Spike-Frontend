/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'readdy.ai' }
    ],
  },
  reactCompiler: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
