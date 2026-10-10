import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  devIndicators: false,
  poweredByHeader: false,
  transpilePackages: ["pdfjs-dist"],
};

export default nextConfig;
