import type { NextConfig } from "next";

let withBundleAnalyzer: (config: NextConfig) => NextConfig;

try {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
} catch {
  withBundleAnalyzer = (config: NextConfig) => config;
}

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['unified', 'remark-parse', 'remark-gfm', 'remark-rehype', 'rehype-sanitize', 'rehype-stringify']
  },
  
  webpack(config, { dev, isServer }) {
    const path = require('path');
    
    config.resolve.alias['@components'] = path.resolve(__dirname, 'src/components');
    config.resolve.alias['@hooks'] = path.resolve(__dirname, 'src/hooks');
    config.resolve.alias['@samples'] = path.resolve(__dirname, 'samples');
    config.resolve.alias['@utils'] = path.resolve(__dirname, 'src/utils');
    
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    });

    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          markdown: {
            test: /[\\/]node_modules[\\/](unified|remark-|rehype-).*[\\/]/,
            name: 'markdown-libs',
            chunks: 'async',
            priority: 30,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 20,
          },
        },
      };
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    return config;
  },
  
  compress: true,
  
  images: {
    formats: ['image/webp', 'image/avif'],
  },

  poweredByHeader: false,
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
