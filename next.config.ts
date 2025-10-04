import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages Functions configuration
  experimental: {
    esmExternals: 'loose',
  },
};

export default nextConfig;
