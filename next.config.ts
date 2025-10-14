import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/stats/:match*",
        destination: "https://va.vercel-scripts.com/:match*",
      },
    ];
  },
};

export default nextConfig;
