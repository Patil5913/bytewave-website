import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
    ],
    qualities: [75, 85],
  },
  allowedDevOrigins: ['10.0.0.176']
};

export default nextConfig;
