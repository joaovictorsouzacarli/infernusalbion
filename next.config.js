/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    // Ignorar erros de TypeScript durante o build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignorar erros de ESLint durante o build
    ignoreDuringBuilds: true,
  },
  // Configuração do SWC
  swcMinify: true,
  compiler: {
    // Desativar a remoção de console.logs
    removeConsole: false,
  },
  experimental: {
    // Configurações experimentais
    serverComponentsExternalPackages: [],
  },
  // Aumentar o limite de tamanho do bundle
  webpack: (config, { isServer }) => {
    // Aumentar o limite de tamanho do bundle
    config.performance = {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    }
    return config
  },
}

module.exports = nextConfig

