/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // next/image is served through Netlify Image CDN by @netlify/plugin-nextjs, which
  // resizes and converts images to WebP/AVIF. Only these hosts may be optimized.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'dewkxfhbqkomcuxzovuw.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
};

module.exports = nextConfig;
