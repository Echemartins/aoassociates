export const dynamic = "force-dynamic"
export const revalidate = 0
import { prisma } from "@/src/lib/prisma"
import { requireAdmin } from "@/src/lib/admin"

export const runtime = "nodejs"

export default async function AdminDashboard() {
  await requireAdmin()

  const [projects, posts, inquiries, feedback] = await Promise.all([
    prisma.project.count(),
    prisma.post.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.feedback.count({ where: { status: "OPEN" } }),
  ])

  return (
    <div className="border-x border-[rgb(var(--border))] bg-white p-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">Overview of site content.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Stat label="Total Projects" value={projects} />
        <Stat label="Total Archives" value={posts} />
        <Stat label="New Inquiries" value={inquiries} />
        <Stat label="Open Feedback" value={feedback} />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-l border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
      <div className="text-sm text-[rgb(var(--muted))]">{label}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  )
}
