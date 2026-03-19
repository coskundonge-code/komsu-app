import type { NextConfig } from "next";

/**
 * Next.js config for Capacitor static export builds (iOS/Android)
 * Usage: NEXT_CONFIG_FILE=next.config.capacitor.ts next build
 * Or rename this to next.config.ts when building for mobile
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },

  compress: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
