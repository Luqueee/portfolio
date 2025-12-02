import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "skillicons.dev",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
    ],
  },
  allowedDevOrigins: ["preview.luqueee.dev"],
};

export default nextConfig;
