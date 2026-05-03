import type { NextConfig } from "next";

const nextConfig = {
  devIndicators: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
} as NextConfig;

export default nextConfig;
