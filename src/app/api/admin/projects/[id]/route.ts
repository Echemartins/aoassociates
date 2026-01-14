export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"
import { requireAdmin } from "@/src/lib/admin"
import { z } from "zod"
import { toSlug } from "@/src/lib/slug"

const ProjectUpsert = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  summary: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  year: z.number().int().optional().nullable(),
  typology: z.string().optional().nullable(),
  client: z.string().optional().nullable(),
  services: z.string().optional().nullable(),
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

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
  await requireAdmin()
  const { id } = await params

  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  })

  return NextResponse.json({ project })
}

export async function PATCH(req: Request, { params }: Ctx) {
  await requireAdmin()
  const { id } = await params

  const data = ProjectUpsert.parse(await req.json())
  const slug = (data.slug?.trim() || toSlug(data.title)).toLowerCase()

  // Replace images (simplest reliable approach)
  await prisma.projectImage.deleteMany({ where: { projectId: id } })

  const updated = await prisma.project.update({
    where: { id },
    data: {
      slug,
      title: data.title,
      summary: data.summary ?? null,
      location: data.location ?? null,
      year: data.year ?? null,
      typology: data.typology ?? null,
      client: data.client ?? null,
      services: data.services ?? null,
      sustainability: data.sustainability ?? null,
      tags: data.tags ?? [],
      body: data.body ?? null,
      status: data.status,
      images: {
        create: data.images.map((img) => ({
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

  return NextResponse.json({ project: updated })
}

export async function DELETE(_: Request, { params }: Ctx) {
  await requireAdmin()
  const { id } = await params

  await prisma.project.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
