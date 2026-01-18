export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import Link from "next/link"
import { prisma } from "@/src/lib/prisma"
import { requireAdmin } from "@/src/lib/admin"

export default async function AdminArchivesPage() {
  await requireAdmin()
  const archives = await prisma.archiveProject.findMany({ orderBy: { updatedAt: "desc" } })

  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Archives</h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            Legacy projects, renovations, reconstructions, and historical work.
          </p>
        </div>

        <Link
          href="/admin/archives/new"
          className="inline-flex items-center justify-center rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--accent))] transition-colors hover:bg-[rgb(var(--accent))] hover:text-white"
        >
          New Archive
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-[rgb(var(--border))]">
        <div className="divide-y divide-[rgb(var(--border))] bg-[rgb(var(--bg))]">
          {archives.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <Link href={`/admin/archives/${a.id}`} className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{a.title}</div>
                <div className="mt-0.5 text-xs text-[rgb(var(--muted))]">
                  {a.status} • <span className="font-mono">/archives/{a.slug}</span>
                </div>
              </Link>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/archives/${a.id}`}
                  className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1 text-sm transition-colors hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-soft))] hover:text-[rgb(var(--accent))]"
                >
                  View
                </Link>
                <Link
                  href={`/admin/archives/${a.id}/edit`}
                  className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1 text-sm transition-colors hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-soft))] hover:text-[rgb(var(--accent))]"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}

          {!archives.length ? (
            <div className="px-4 py-8 text-sm text-[rgb(var(--muted))]">No archives yet.</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
