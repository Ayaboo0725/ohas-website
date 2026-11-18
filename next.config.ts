import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  // Static export: the site builds to plain HTML/CSS/JS in /out and can be
  // hosted on any static host.
  output: "export",
  images: { unoptimized: true },
  // Pages named page.dev.tsx (asset-rendering tools) exist only in `next dev`.
  pageExtensions: isDev ? ["tsx", "ts", "dev.tsx"] : ["tsx", "ts"],
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
