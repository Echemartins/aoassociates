export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"
import { toSlug } from "@/src/lib/slug"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const raw = decodeURIComponent(slug || "").trim()
  if (!raw) return NextResponse.json({ error: "Missing slug" }, { status: 400 })

  const normalized = toSlug(raw).toLowerCase()
  const candidates = Array.from(new Set([raw, normalized])).filter(Boolean)

  let project: any = null
  let matchedSlug: string | null = null

  for (const s of candidates) {
    const found = await prisma.project.findUnique({
      where: { slug: s },
      include: { images: { orderBy: { order: "asc" } } },
    })
    if (found) {
      project = found
      matchedSlug = s
      break
    }
  }

  if (!project || project.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({
    id: project.id,
    slug: project.slug,
    matchedSlug,
    title: project.title,
    summary: project.summary,
    location: project.location,
    year: project.year,
    tags: project.tags,
    typology: project.typology,
    services: project.services,
    sustainability: project.sustainability,
    client: project.client,
    images: (project.images || []).map((img: any) => ({
      id: img.id,
      url: img.url,
      alt: img.alt || project.title || "Project image",
      caption: img.caption ?? null,
      credit: img.credit ?? null,
      notes: img.notes ?? null,
      order: img.order ?? 0,
    })),
  })
}
