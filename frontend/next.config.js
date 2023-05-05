/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    esmExternals: "loose",
  },
  images: {
    domains: ["icon-library.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
};

module.exports = nextConfig;
