const basePath = process.env.NEXT_PUBLIC_BASE_PATH ||
  (process.env.GITHUB_ACTIONS === 'true' ? '/eurowindow-website' : '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The Vercel runtime hosts the contact API. Keep static export only for GitHub Pages.
  // Use a separate dev cache so `next build` cannot overwrite files used by `next dev`.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  ...(process.env.GITHUB_ACTIONS === 'true' ? { output: 'export' } : {}),
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: { unoptimized: true }
};

export default nextConfig;
