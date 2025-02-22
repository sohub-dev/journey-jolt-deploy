import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
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
  env: {
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    BETTER_AUTH_URL: "http://localhost:3000",
    BETTER_AUTH_SECRET: "process.env.BETTER_AUTH_SECRET",
    DATABASE_URL: "process.env.DATABASE_URL",
    ENCRYPTION_KEY: "process.env.ENCRYPTION_KEY",
    DUFFEL_TOKEN: "process.env.DUFFEL_TOKEN",
    OPENAI_API_KEY: "process.env.OPENAI_API_KEY",
    GOOGLE_GENERATIVE_AI_API_KEY: "process.env.GOOGLE_GENERATIVE_AI_API_KEY",
    AI_PROVIDER: "process.env.AI_PROVIDER",
  },
};

export default nextConfig;
