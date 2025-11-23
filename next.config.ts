import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  pageExtensions: ["js", "jsx", "ts", "tsx"],
};

module.exports = nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
