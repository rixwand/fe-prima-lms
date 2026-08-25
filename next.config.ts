import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // crossOrigin: "use-credentials",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vcbkvjjzhpzahozzdtap.storage.supabase.co",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
