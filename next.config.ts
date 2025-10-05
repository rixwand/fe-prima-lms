import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // crossOrigin: "use-credentials",
  images: {
    remotePatterns: [new URL("https://vcbkvjjzhpzahozzdtap.storage.supabase.co/**")],
  },
};

export default nextConfig;
