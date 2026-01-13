import { prisma } from "../src/lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim()
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env")
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log("Admin already exists:", email)
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await prisma.user.create({
    data: {
      email,
      name: "Admin",
      role: "ADMIN",
      passwordHash,
    },
  })

  console.log("Admin created:", email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
