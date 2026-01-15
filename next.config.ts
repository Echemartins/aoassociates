import type { NextConfig } from "next"

function hostFrom(url?: string, fallback?: string) {
  try {
    return url ? new URL(url).hostname : fallback
  } catch {
    return fallback
  }
}

const bucketHost = hostFrom(
  process.env.S3_PUBLIC_BASE_URL,
  "aoassociates-assets.s3.eu-west-1.amazonaws.com"
) || "aoassociates-assets.s3.eu-west-1.amazonaws.com"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Your S3/CloudFront base (primary)
      { protocol: "https", hostname: bucketHost },

      // If you ever use direct S3 regional hostnames
      { protocol: "https", hostname: "s3.amazonaws.com" },
      { protocol: "https", hostname: "*.s3.amazonaws.com" },
      { protocol: "https", hostname: "*.s3.*.amazonaws.com" }, // matches many regional styles

      // If you have old content coming from Google Storage (your error shows this)
      { protocol: "https", hostname: "storage.googleapis.com" },

      // If images are proxied through your own domain
      { protocol: "https", hostname: "aoassociates.com" },
      { protocol: "https", hostname: "www.aoassociates.com" },

      // Local dev
      { protocol: "http", hostname: "localhost" },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
