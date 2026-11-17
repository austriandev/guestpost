import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    // Publisher logos come from the WooCommerce media library.
    remotePatterns: [{ protocol: "https", hostname: "guestpostlive.com", pathname: "/wp-content/uploads/**" }],
  },
};

export default nextConfig;
