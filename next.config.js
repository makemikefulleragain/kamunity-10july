/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true, // Better for Netlify
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Don't use static export - we need API routes for forms
  experimental: {
    esmExternals: false,
  },
}

module.exports = nextConfig 