// src/app/admin/projects/page.tsx (or your current path)

export const dynamic = "force-dynamic"
export const revalidate = 0

import Link from "next/link"
import { prisma } from "@/src/lib/prisma"
import { requireAdmin } from "@/src/lib/admin"
import AdminProjectsReorderList from "./AdminProjectsReorderList" // <-- add this

export const runtime = "nodejs"

export default async function AdminProjectsPage() {
  await requireAdmin()

  const projects = await prisma.project.findMany({
    orderBy: [
      { sortOrder: "asc" },  // <-- add this (after you add sortOrder field)
      { updatedAt: "desc" },
    ],
  })

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
          {/* Replace the old .map(...) with this */}
          <AdminProjectsReorderList initialProjects={projects as any} />
        </div>
      </div>
    </div>
  )
}
