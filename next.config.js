/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['huggingface.co', 'cdn-lfs.huggingface.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.huggingface.co',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;
