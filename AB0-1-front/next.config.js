/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  experimental: {
    serverActions: {
      allowedOrigins: ['https://www.avaliasolar.com.br'],
      bodySizeLimit: '2mb',
    },
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }, // libera para todos os domínios
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
    ]
  },

  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },

  basePath: '',
  assetPrefix: '',

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.avaliasolar.com.br',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.avaliasolar.com.br',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/rails/active_storage/blobs/**',
      },
    ],
    unoptimized: true,
  },

  trailingSlash: false,
}

module.exports = nextConfig
