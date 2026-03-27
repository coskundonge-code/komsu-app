import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typescript: {
          ignoreBuildErrors: true,
    },
    // Image optimization
    images: {
          remotePatterns: [
            {
                      protocol: "https",
                      hostname: "picsum.photos",
            },
            {
                      protocol: "https",
                      hostname: "images.unsplash.com",
            },
            {
                      protocol: "https",
                      hostname: "api.dicebear.com",
            },
            {
                      protocol: "https",
                      hostname: "*.supabase.co",
            },
                ],
          formats: ["image/avif", "image/webp"],
          minimumCacheTTL: 31536000, // 1 year cache
    },

    // Compression
    compress: true,

    // Disable source maps in production
    productionBrowserSourceMaps: false,

    // Security headers
    async headers() {
          return [
            {
                      source: "/(.*)",
                      headers: [
                        {
                                      key: "X-Frame-Options",
                                      value: "SAMEORIGIN",
                        },
                        {
                                      key: "X-Content-Type-Options",
                                      value: "nosniff",
                        },
                        {
                                      key: "Referrer-Policy",
                                      value: "strict-origin-when-cross-origin",
                        },
                        {
                                      key: "X-DNS-Prefetch-Control",
                                      value: "on",
                        },
                        {
                                      key: "Permissions-Policy",
                                      value: "camera=(), microphone=(), geolocation=(self)",
                        },
                        {
                                      key: "Content-Security-Policy",
                                      value: [
                                                      "default-src 'self'",
                                                      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com https://maps.googleapis.com https://maps.gstatic.com blob:",
                                                      "worker-src 'self' blob:",
                                                      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                                                      "font-src 'self' https://fonts.gstatic.com",
                                                      "img-src 'self' data: blob: https://*.supabase.co https://picsum.photos https://images.unsplash.com https://api.dicebear.com https://maps.googleapis.com https://maps.gstatic.com https://*.ggpht.com https://*.googleusercontent.com https://*.basemaps.cartocdn.com https://server.arcgisonline.com",
                                                      "connect-src 'self' https://*.supabase.co https://vercel.live https://va.vercel-scripts.com https://unpkg.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://server.arcgisonline.com https://maps.googleapis.com https://maps.gstatic.com https://raw.githubusercontent.com https://nominatim.openstreetmap.org",
                                                      "frame-src 'self' https://www.google.com https://maps.google.com",
                                                    "frame-ancestors 'self'",
                                                      "base-uri 'self'",
                                                      "form-action 'self'",
                                                    ].join("; "),
                        },
                        {
                                      key: "Strict-Transport-Security",
                                      value: "max-age=31536000; includeSubDomains; preload",
                        },
                                ],
            },
                ];
    },
};

export default nextConfig;
