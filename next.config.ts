import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  devIndicators: {
    buildActivityPosition: "bottom-right",
  },
};

export default nextConfig;
