const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  experimental: { typedRoutes: true },
};

module.exports = withMDX(nextConfig);
