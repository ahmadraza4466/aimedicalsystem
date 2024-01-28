/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { chromadb: false };
    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/chats",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

module.exports = {};
