import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    const path = require('path');
    config.resolve.alias['@components'] = path.resolve(__dirname, 'src/components');
    config.resolve.alias['@hooks'] = path.resolve(__dirname, 'src/hooks');
    config.resolve.alias['@samples'] = path.resolve(__dirname, 'samples');
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    });
    return config;
  }
};

export default nextConfig;
