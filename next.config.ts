import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/booking",
        destination: "/automation",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
