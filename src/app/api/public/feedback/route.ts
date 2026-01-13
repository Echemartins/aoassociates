export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"

export async function POST(req: Request) {
  const form = await req.formData()
  const name = String(form.get("name") || "")
  const email = String(form.get("email") || "")
  const message = String(form.get("message") || "")

  if (!message.trim()) {
    return NextResponse.redirect(new URL("/contact", req.url), { status: 303 })
  }

  await prisma.feedback.create({
    data: { name, email, message },
  })

  return NextResponse.redirect(new URL("/contact", req.url), { status: 303 })
}
