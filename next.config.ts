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
    ],
    qualities: [75, 90],
  },
  allowedDevOrigins: ['10.0.0.176'],
  // Load sharp from node_modules instead of bundling it, so its native
  // .node binary keeps the rpath to libvips-cpp.so and can dlopen it.
  serverExternalPackages: ["sharp"],
};

export default withPayload(nextConfig);
