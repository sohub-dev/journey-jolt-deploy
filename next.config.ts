import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  devIndicators: {
    buildActivityPosition: "bottom-right",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
