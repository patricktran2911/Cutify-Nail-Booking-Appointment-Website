import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    // Type checking happens locally; skip in Docker build to save memory
    ignoreBuildErrors: true,
  },
  images: {
    // Gallery images are uploaded at runtime and served directly by nginx;
    // bypass /_next/image so newly uploaded files work without container restart
    unoptimized: true,
  },
};

export default nextConfig;
