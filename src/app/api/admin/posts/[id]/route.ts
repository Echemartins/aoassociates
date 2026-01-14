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
  publishedAt: z.string().optional().nullable(),
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await requireAdmin()
  const post = await prisma.post.findUnique({ where: { id: params.id } })
  return NextResponse.json({ post })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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

    const updated = await prisma.post.update({
      where: { id: params.id },
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

    return NextResponse.json({ post: updated })
  } catch (e: any) {
    return json("Failed to update post.", 400, { details: e?.message })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await requireAdmin()
  await prisma.post.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
