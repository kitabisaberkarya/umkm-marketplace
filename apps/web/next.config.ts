import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
