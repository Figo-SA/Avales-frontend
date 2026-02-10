import type { NextConfig } from "next";

const backendUrl =
  process.env.BACKEND_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://avales-backend.onrender.com"
    : "http://localhost:3000");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
