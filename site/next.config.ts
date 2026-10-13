import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // A plataforma passou a viver em /app. Os endereços antigos (que já foram enviados por aí) continuam funcionando.
  async redirects() {
    return [
      { source: "/plants/:id", destination: "/app/plants/:id", permanent: false },
      { source: "/track-record", destination: "/app/track-record", permanent: false },
      { source: "/method", destination: "/app/method", permanent: false },
      { source: "/lab", destination: "/app/lab", permanent: false },
      { source: "/verify", destination: "/app/verify", permanent: false },
    ];
  },
};

export default nextConfig;
