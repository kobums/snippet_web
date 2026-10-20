import type { NextConfig } from "next";
import { COVER_IMAGE_HOSTS } from "./src/lib/imageHosts";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // 도서 표지 CDN만 최적화 허용 (목록은 src/lib/imageHosts.ts)
    remotePatterns: COVER_IMAGE_HOSTS.flatMap((hostname) => [
      { protocol: 'https' as const, hostname },
      { protocol: 'http' as const, hostname },
    ]),
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
