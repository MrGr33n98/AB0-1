/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Usamos remotePatterns para lidar com 'localhost:3001'
    // E também incluímos os domínios existentes aqui para maior consistência
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        // port: '', // Deixe vazio para portas padrão (80/443)
        // pathname: '/**', // Opcional: permite qualquer caminho
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        // port: '',
        // pathname: '/**',
      },
      {
        protocol: 'http', // O protocolo da sua URL (http)
        hostname: 'localhost', // O hostname da sua URL
        port: '3001', // A porta específica do seu servidor Rails
        pathname: '/rails/active_storage/blobs/redirect/**', // O padrão do caminho para o Active Storage
      },
    ],
    // Você pode remover 'domains' se estiver usando 'remotePatterns' para todas as suas fontes de imagem,
    // ou mantê-lo se tiver apenas domínios simples que não precisam de especificidade de porta/caminho.
    // Para evitar duplicidade e ser mais claro, eu recomendo migrar todos para remotePatterns.
    // Se você mantiver domains E remotePatterns, o Next.js combinará as duas listas.
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:3001/api/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;