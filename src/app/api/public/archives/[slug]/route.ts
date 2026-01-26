import { NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(_: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const raw = decodeURIComponent(slug || "").trim()
  if (!raw) return NextResponse.json({ error: "Missing slug" }, { status: 400 })

  const archive = await prisma.archiveProject.findFirst({
    where: { slug: raw, status: "PUBLISHED" },
    include: { images: { orderBy: { order: "asc" } } },
  })

  if (!archive) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(archive)
}
