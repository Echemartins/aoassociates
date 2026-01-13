import { S3Client } from "@aws-sdk/client-s3"

export function getS3() {
  const region = process.env.S3_REGION
  const endpoint = process.env.S3_ENDPOINT || undefined

  return new S3Client({
    region,
    endpoint,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
  })
}
