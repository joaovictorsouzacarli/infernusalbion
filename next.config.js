/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
      // !! ATENÇÃO: Isso ignora erros de tipo durante o build
      ignoreBuildErrors: true,
    },
    eslint: {
      // !! ATENÇÃO: Isso ignora erros de lint durante o build
      ignoreDuringBuilds: true,
    },
  }
  
  module.exports = nextConfig
  
  