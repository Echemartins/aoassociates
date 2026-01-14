export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"
import { requireAdmin } from "@/src/lib/admin"
import { z } from "zod"

function json(error: string, status: number, extra?: any) {
  return NextResponse.json({ error, ...extra }, { status })
}

const UpdateStatus = z.object({
  id: z.string().min(5),
  status: z.string().min(1),
})

const DeleteOne = z.object({
  id: z.string().min(5),
})

export async function GET() {
  await requireAdmin()
  const feedback = await prisma.feedback.findMany({
    orderBy: [{ createdAt: "desc" }],
  })
  return NextResponse.json({ feedback })
}

export async function PATCH(req: Request) {
  await requireAdmin()
  try {
    const { id, status } = UpdateStatus.parse(await req.json())
    const item = await prisma.feedback.update({
      where: { id },
      data: { status },
    })
    return NextResponse.json({ feedback: item })
  } catch (e: any) {
    return json("Failed to update feedback.", 400, { details: e?.message })
  }
}

export async function DELETE(req: Request) {
  await requireAdmin()
  try {
    const { id } = DeleteOne.parse(await req.json())
    await prisma.feedback.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return json("Failed to delete feedback.", 400, { details: e?.message })
  }
}
