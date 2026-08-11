import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The repo lives outside a git root, so pin the workspace root explicitly.
  turbopack: { root: __dirname },
};

export default nextConfig;
