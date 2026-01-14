export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"
import { requireAdmin } from "@/src/lib/admin"
import { z } from "zod"
import { toSlug } from "@/src/lib/slug"

function json(error: string, status: number, extra?: any) {
  return NextResponse.json({ error, ...extra }, { status })
}

const PostUpsert = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  body: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  publishedAt: z.string().optional().nullable(), // ISO string or null
})

export async function GET() {
  await requireAdmin()
  const posts = await prisma.post.findMany({
    orderBy: [{ updatedAt: "desc" }],
  })
  return NextResponse.json({ posts })
}

export async function POST(req: Request) {
  await requireAdmin()

  try {
    const data = PostUpsert.parse(await req.json())
    const slug = (data.slug?.trim() || toSlug(data.title)).toLowerCase()

    const publishedAt =
      data.status === "PUBLISHED"
        ? data.publishedAt
          ? new Date(data.publishedAt)
          : new Date()
        : null

    const created = await prisma.post.create({
      data: {
        slug,
        title: data.title,
        excerpt: data.excerpt ?? null,
        category: data.category ?? null,
        tags: data.tags ?? [],
        body: data.body ?? null,
        status: data.status,
        publishedAt,
      },
    })

    return NextResponse.json({ post: created }, { status: 201 })
  } catch (e: any) {
    return json("Failed to create post.", 400, { details: e?.message })
  }
}
