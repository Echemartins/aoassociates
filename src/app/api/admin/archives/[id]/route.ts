export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"
import { requireAdmin } from "@/src/lib/admin"
import { z } from "zod"
import { toSlug } from "@/src/lib/slug"

const ArchiveUpsert = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  summary: z.string().optional().nullable(),
  location: z.string().optional().nullable(),

  originalYear: z.number().int().optional().nullable(),
  interventionYear: z.number().int().optional().nullable(),
  typology: z.string().optional().nullable(),
  interventionType: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  existingCondition: z.string().optional().nullable(),
  constraints: z.string().optional().nullable(),
  strategy: z.string().optional().nullable(),
  outcome: z.string().optional().nullable(),

  sustainability: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  body: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  images: z
    .array(
      z.object({
        id: z.string().optional(),
        url: z.string().min(5),
        alt: z.string().min(1),
        caption: z.string().optional().nullable(),
        credit: z.string().optional().nullable(),
        notes: z.string().optional().nullable(),
        order: z.number().int().default(0),
      })
    )
    .default([]),
})

function json(error: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error, ...(extra ?? {}) }, { status })
}

async function ensureUniqueSlugForUpdate(id: string, base: string) {
  const clean = (base || "").trim().toLowerCase()
  if (!clean) return clean

  let candidate = clean
  let i = 2
  while (true) {
    const exists = await prisma.archiveProject.findUnique({ where: { slug: candidate } })
    if (!exists || exists.id === id) return candidate
    candidate = `${clean}-${i++}`
  }
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params

  const archive = await prisma.archiveProject.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  })

  return NextResponse.json({ archive })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params

  const body = await req.json().catch(() => null)
  if (!body) return json("Invalid JSON body.", 400)

  const parsed = ArchiveUpsert.safeParse(body)
  if (!parsed.success) return json("Invalid input.", 422, { issues: parsed.error.issues })

  const data = parsed.data
  const baseSlug = (data.slug?.trim() || toSlug(data.title)).toLowerCase()
  const slug = await ensureUniqueSlugForUpdate(id, baseSlug)

  // Replace images (reliable)
  await prisma.archiveProjectImage.deleteMany({ where: { archiveProjectId: id } })

  const images = (data.images ?? [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((img, idx) => ({ ...img, order: idx }))

  const updated = await prisma.archiveProject.update({
    where: { id },
    data: {
      slug,
      title: data.title,
      summary: data.summary ?? null,
      location: data.location ?? null,

      originalYear: data.originalYear ?? null,
      interventionYear: data.interventionYear ?? null,
      typology: data.typology ?? null,
      interventionType: data.interventionType ?? null,
      scope: data.scope ?? null,
      existingCondition: data.existingCondition ?? null,
      constraints: data.constraints ?? null,
      strategy: data.strategy ?? null,
      outcome: data.outcome ?? null,

      sustainability: data.sustainability ?? null,
      tags: (data.tags ?? []).filter(Boolean),
      body: data.body ?? null,
      status: data.status,

      images: {
        create: images.map((img) => ({
          url: img.url,
          alt: img.alt,
          caption: img.caption ?? null,
          credit: img.credit ?? null,
          notes: img.notes ?? null,
          order: img.order ?? 0,
        })),
      },
    },
    include: { images: { orderBy: { order: "asc" } } },
  })

  return NextResponse.json({ archive: updated })
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params

  await prisma.archiveProject.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
