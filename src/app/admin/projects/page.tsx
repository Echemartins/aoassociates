import Link from "next/link"
import { prisma } from "@/src/lib/prisma"
import { requireAdmin } from "@/src/lib/admin"

export const runtime = "nodejs"

export default async function AdminProjectsPage() {
  await requireAdmin()
  const projects = await prisma.project.findMany({ orderBy: { updatedAt: "desc" } })

  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">Create and manage project case studies.</p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--accent))] transition-colors hover:bg-[rgb(var(--accent))] hover:text-white"
        >
          New Project
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-[rgb(var(--border))]">
        <div className="divide-y divide-[rgb(var(--border))] bg-[rgb(var(--bg))]">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-[rgb(var(--fg))]">{p.title}</div>
                <div className="mt-0.5 text-xs text-[rgb(var(--muted))]">
                  {p.status} • <span className="font-mono">/projects/{p.slug}</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/projects/${p.id}`}
                  className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1 text-sm text-[rgb(var(--fg))] transition-colors hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-soft))] hover:text-[rgb(var(--accent))]"
                >
                  View
                </Link>

                <Link
                  href={`/admin/projects/${p.id}/edit`}
                  className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1 text-sm text-[rgb(var(--fg))] transition-colors hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-soft))] hover:text-[rgb(var(--accent))]"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}

          {!projects.length ? (
            <div className="px-4 py-8 text-sm text-[rgb(var(--muted))]">No projects yet.</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
