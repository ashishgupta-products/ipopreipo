import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'tab',
            value: 'payment-apps',
          },
        ],
        destination: '/payment-apps',
        permanent: false,
      },
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'tab',
            value: 'pre-ipo',
          },
        ],
        destination: '/pre-ipo',
        permanent: false,
      },
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'tab',
            value: 'brokers',
          },
        ],
        destination: '/brokers',
        permanent: false,
      },
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'tab',
            value: 'credit-cards',
          },
        ],
        destination: '/credit-cards',
        permanent: false,
      },
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'tab',
            value: 'analysts',
          },
        ],
        destination: '/analysts',
        permanent: false,
      },
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'tab',
            value: 'all-ipos',
          },
        ],
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
