import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Remappe tout /mt-demo/* vers /_vercel/insights/*
      {
        source: "/mt-demo/:path*",
        destination: "/_vercel/insights/:path*",
      },
    ];
  },
};

export default nextConfig;
