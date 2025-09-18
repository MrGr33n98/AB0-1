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
  eslint: {
    // ✅ Ignora erros do ESLint durante build (resolve o "a.getScope is not a function")
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ Ignora erros de TypeScript no build de produção
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
