import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.bittel.bg",
        pathname: "/web/img/**",
      },
      {
        protocol: "https",
        hostname: "gzdcbkrtpbqcugqgrqut.supabase.co",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
