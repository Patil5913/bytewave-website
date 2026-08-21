import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.logo.dev",
      },
    ],
    qualities: [75, 85],
  },
  allowedDevOrigins: ['10.0.0.176'],
  serverExternalPackages: ["sharp"],
};

export default withPayload(nextConfig);
