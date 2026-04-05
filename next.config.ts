import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    // Type checking happens locally; skip in Docker build to save memory
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
