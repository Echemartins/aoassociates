export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/src/lib/prisma"
import { requireAdmin } from "@/src/lib/admin"

export default async function AdminArchiveOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params

  const a = await prisma.archiveProject.findUnique({ where: { id } })
  if (!a) return notFound()

  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold">{a.title}</h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            Overview • <span className="font-mono">/archives/{a.slug}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/archives/${encodeURIComponent(a.slug)}`}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm transition-colors hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-soft))] hover:text-[rgb(var(--accent))]"
          >
            Open Public Page
          </Link>
          <Link
            href={`/admin/archives/${a.id}/edit`}
            className="rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--accent))] transition-colors hover:bg-[rgb(var(--accent))] hover:text-white"
          >
            Edit Archive
          </Link>
          <Link
            href="/admin/archives"
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm hover:bg-[rgb(var(--card))]"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <OverviewItem label="Status" value={a.status} />
        <OverviewItem label="Slug" value={a.slug} mono />
        <OverviewItem label="Created" value={a.createdAt.toISOString()} mono />
        <OverviewItem label="Updated" value={a.updatedAt.toISOString()} mono />
      </div>
    </div>
  )
}

function OverviewItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">{label}</div>
      <div className={`mt-2 text-sm ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  )
}
