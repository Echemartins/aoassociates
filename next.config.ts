import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // cast to avoid TS complaining about missing key in type defs
  ...( { eslint: { ignoreDuringBuilds: true } } as any ),
}

export default nextConfig
