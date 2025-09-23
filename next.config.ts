import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // for next export
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
