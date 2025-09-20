import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'https://6000-firebase-studio-1758401471018.cluster-mdgxqvvkkbfpqrfigfiuugu5pk.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
