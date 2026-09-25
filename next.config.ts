import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The media pipeline reads shared art (egg, island scenes, characters) from disk as references for Seedance.
  outputFileTracingIncludes: {
    "/api/**": ["./public/art/*.jpg", "./public/art/*.png"],
  },
};

export default nextConfig;
