import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Don't run ESLint during production builds on Vercel
    // if there are still issues with generated files
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Don't fail builds on TypeScript errors in production
    // Remove this if you want strict type checking
    ignoreBuildErrors: false,
  },
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
};

export default nextConfig;
