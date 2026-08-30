import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The repo lives outside a git root, so pin the workspace root explicitly.
  turbopack: { root: __dirname },

  // The brand assets keep stable filenames across deploys, so `immutable` would
  // strand anyone holding an old copy — which is exactly how a bad hero film
  // would have become permanent. An hour of freshness plus a week of
  // stale-while-revalidate gets the repeat-visit win without that risk.
  async headers() {
    return [
      {
        source: "/brand/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
