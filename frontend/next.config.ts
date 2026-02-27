import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Enable static export for S3 hosting
  trailingSlash: true,  // Generate /about/index.html instead of /about.html
  images: {
    unoptimized: true,  // S3 can't optimize images dynamically
  },
  // Optional: Add a custom base path if deploying to a subdirectory
  // basePath: '/blog',
};

export default nextConfig;
