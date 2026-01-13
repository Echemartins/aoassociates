export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"

export async function POST(req: Request) {
  const form = await req.formData()
  const name = String(form.get("name") || "")
  const email = String(form.get("email") || "")
  const phone = String(form.get("phone") || "")
  const projectType = String(form.get("projectType") || "")
  const message = String(form.get("message") || "")

  await prisma.inquiry.create({
    data: { name, email, phone, projectType, message },
  })

  return NextResponse.redirect(new URL("/contact", req.url), { status: 303 })
}
