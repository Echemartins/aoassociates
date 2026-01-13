import Link from "next/link"
import { prisma } from "@/src/lib/prisma"
import { requireAdmin } from "@/src/lib/admin"

export const runtime = "nodejs"

export default async function AdminProjectsPage() {
  await requireAdmin()
  const projects = await prisma.project.findMany({ orderBy: { updatedAt: "desc" } })

  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-white p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">Create and manage project case studies.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-full bg-[rgb(var(--fg))] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          New Project
        </Link>
      </div>

      <div className="mt-6 divide-y divide-[rgb(var(--border))]">
        {projects.map((p) => (
          <div key={p.id} className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm font-semibold">{p.title}</div>
              <div className="text-xs text-[rgb(var(--muted))]">
                {p.status} • /projects/{p.slug}
              </div>
            </div>
            <Link
              href={`/admin/projects/${p.id}/edit`}
              className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-sm hover:bg-[rgb(var(--card))]"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
