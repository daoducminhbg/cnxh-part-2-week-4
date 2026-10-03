/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // helps with single-instance audio and realtime websockets
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
