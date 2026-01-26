import { NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"

export const runtime = "nodejs"

type Body = { ids: string[] } // ids in the exact desired order (top -> bottom)

export async function POST(req: Request) {
  const body = (await req.json()) as Body
  const ids = Array.isArray(body?.ids) ? body.ids : []

  if (!ids.length) {
    return NextResponse.json({ error: "Missing ids" }, { status: 400 })
  }

  // Write the sortOrder in one transaction
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.project.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  )

  return NextResponse.json({ ok: true })
}
