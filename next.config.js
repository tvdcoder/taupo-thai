/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'taupothai.co.nz',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.taupothai.co.nz',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig