/** @type {import('next').NextConfig} */

// Options can be found here:
// https://github.com/vercel/next.js/blob/canary/packages/next/src/server/config-shared.ts

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  //  Redirects allow you to redirect an incoming request path to a different destination path.

  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
};
