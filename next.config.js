/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.avaliasolar.com.br'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.avaliasolar.com.br',
        pathname: '/images/**',
      },
    ],
  },
}

module.exports = nextConfig
