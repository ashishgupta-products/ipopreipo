import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zerodha.com",
      },
      {
        protocol: "https",
        hostname: "**.zerodha.com",
      },
      {
        protocol: "https",
        hostname: "www.chittorgarh.com",
      },
      {
        protocol: "https",
        hostname: "**.chittorgarh.com",
      },
      {
        protocol: "https",
        hostname: "**.ipoguru.in",
      },
      {
        protocol: "https",
        hostname: "**.investorgain.com",
      },
    ],
  },
};

export default nextConfig;
