import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: '**' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://snippetapi.gowoobro.com/api/:path*",
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:8008/api/:path*",
      },
    ];
  },
};

export default nextConfig;
