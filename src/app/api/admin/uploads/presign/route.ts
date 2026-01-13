export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { requireAdmin } from "@/src/lib/admin"
import { z } from "zod"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { getS3 } from "@/src/lib/s3"

const Input = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
})

export async function POST(req: Request) {
  await requireAdmin()
  const { filename, contentType } = Input.parse(await req.json())

  const bucket = process.env.S3_BUCKET!
  const base = process.env.S3_PUBLIC_BASE_URL!
  const key = `aoassociates/${Date.now()}-${filename}`

  const s3 = getS3()
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  })

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 })
  const publicUrl = `${base}/${key}`

  return NextResponse.json({ uploadUrl, publicUrl, key })
}
