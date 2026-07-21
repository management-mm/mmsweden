import type { NextConfig } from 'next';
import withNextIntl from 'next-intl/plugin';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
    ],
  },

  experimental: {
    optimizePackageImports: ['swiper', 'lodash'],
  },

  async redirects() {
    return [
      {
        source: '/begagnade-maskiner1.html',
        destination: '/sv/all-products',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl('./i18n/request.ts')(nextConfig);
