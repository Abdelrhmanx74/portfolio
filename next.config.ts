import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  // Enable static export for maximum performance
  output: 'export',

  // Optimize images
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'repository-images.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'next-auth.js.org',
      },
    ],
  },

  // Enable React compiler optimizations
  reactStrictMode: true,

  // Compress output
  compress: true,

  // Optimize production builds
  poweredByHeader: false,
  // GitHub Pages: when set, add basePath and assetPrefix to route assets correctly
  basePath: isGithubPages ? '/portfolio' : '',
  assetPrefix: isGithubPages ? '/portfolio' : '',
  trailingSlash: true,
};

export default nextConfig;
