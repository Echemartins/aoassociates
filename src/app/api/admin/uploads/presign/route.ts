export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { requireAdmin } from "@/src/lib/admin"
import { z } from "zod"
import { PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { getS3 } from "@/src/lib/s3"

const Input = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
})

function json(error: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error, ...(extra ?? {}) }, { status })
}

function safeFilename(name: string) {
  const base = name.split(/[/\\]/).pop() || "file"
  return base.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 120) || "file"
}

function publicBaseUrl(bucket: string, region: string) {
  // Works for standard S3 virtual-hosted–style endpoint.
  // If you use CloudFront, set S3_PUBLIC_BASE_URL to your distribution domain.
  return `https://${bucket}.s3.${region}.amazonaws.com`
}

function normalizeContentType(ct: string) {
  const v = (ct || "").toLowerCase().trim()
  return v.startsWith("image/") ? v : "application/octet-stream"
}

export async function POST(req: Request) {
  await requireAdmin()

  const body = await req.json().catch(() => null)
  if (!body) return json("Invalid JSON body.", 400)

  const parsed = Input.safeParse(body)
  if (!parsed.success) return json("Invalid input.", 422, { issues: parsed.error.issues })

  const bucket = process.env.S3_BUCKET
  const region = process.env.S3_REGION

  if (!bucket) return json("Missing env: S3_BUCKET", 500)
  if (!region) return json("Missing env: S3_REGION", 500)

  const filename = safeFilename(parsed.data.filename)
  const contentType = normalizeContentType(parsed.data.contentType)

  const prefix = (process.env.S3_KEY_PREFIX || "aoassociates").replace(/^\/+|\/+$/g, "")
  const key = `${prefix}/${Date.now()}-${filename}`

  // If you insist on ACL-based public read, set:
  // S3_OBJECT_ACL=public-read
  // IMPORTANT: This will FAIL if your bucket has ACLs disabled (Bucket owner enforced).
  const aclEnv = (process.env.S3_OBJECT_ACL || "").trim()
  const acl = (aclEnv ? (aclEnv as ObjectCannedACL) : undefined)

  const s3 = getS3()
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
    // Optional (only if your bucket supports ACLs):
    ...(acl ? { ACL: acl } : {}),
  })

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 })

  const base = (process.env.S3_PUBLIC_BASE_URL || publicBaseUrl(bucket, region)).replace(/\/+$/g, "")
  const publicUrl = `${base}/${key}`

  return NextResponse.json({ uploadUrl, publicUrl, key })
}
