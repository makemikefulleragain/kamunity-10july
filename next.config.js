/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization
  images: {
    unoptimized: true, // Better for Netlify static deployment
    formats: ['image/webp', 'image/avif'],
  },
  
  // Build optimization
  eslint: {
    ignoreDuringBuilds: false, // Enable linting in production builds
  },
  typescript: {
    ignoreBuildErrors: false, // Ensure type safety
  },
  
  // Performance optimizations
  experimental: {
    esmExternals: false, // Better compatibility
  },
  
  // Security headers (Netlify will handle most, but good defaults)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Redirect configuration
  async redirects() {
    return [
      // Add any necessary redirects here
    ];
  },
}

module.exports = nextConfig 