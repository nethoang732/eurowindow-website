const basePath = process.env.NEXT_PUBLIC_BASE_PATH ||
  (process.env.GITHUB_ACTIONS === 'true' ? '/eurowindow-website' : '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep local development on the normal Next.js server; export only for production builds.
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: { unoptimized: true }
};

export default nextConfig;
