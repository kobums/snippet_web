import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
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
