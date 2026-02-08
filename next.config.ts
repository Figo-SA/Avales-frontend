import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL || "https://avales-backend.onrender.com"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
