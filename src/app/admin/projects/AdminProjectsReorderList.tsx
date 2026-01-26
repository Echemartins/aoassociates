// src/app/admin/projects/AdminProjectsReorderList.tsx
"use client"

import Link from "next/link"
import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"

type ProjectRow = {
  id: string
  title: string
  slug: string
  status: string
  sortOrder?: number | null
}

function moveItem<T>(arr: T[], fromIndex: number, toIndex: number) {
  const next = arr.slice()
  const [item] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, item)
  return next
}

export default function AdminProjectsReorderList({
  initialProjects,
}: {
  initialProjects: ProjectRow[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Local order state (what you see on screen)
  const [items, setItems] = useState<ProjectRow[]>(() => initialProjects ?? [])

  // DnD state
  const [dragId, setDragId] = useState<string | null>(null)

  const ids = useMemo(() => items.map((x) => x.id), [items])

  async function saveOrder() {
    const res = await fetch("/api/admin/projects/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })

    if (!res.ok) {
      const j = await res.json().catch(() => null)
      alert(j?.error || "Failed to save order.")
      return
    }

    startTransition(() => {
      router.refresh()
    })
  }

  function onDragStart(id: string) {
    setDragId(id)
  }

  function onDragOver(e: React.DragEvent) {
    // Required to allow drop
    e.preventDefault()
  }

  function onDrop(overId: string) {
    if (!dragId || dragId === overId) return

    const from = items.findIndex((x) => x.id === dragId)
    const to = items.findIndex((x) => x.id === overId)
    if (from === -1 || to === -1) return

    setItems((prev) => moveItem(prev, from, to))
    setDragId(null)
  }

  return (
    <>
      {/* Small reorder header row */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="text-xs font-semibold text-[rgb(var(--muted))]">
          Drag rows to reorder. Click “Save order” when done.
        </div>

        <button
          type="button"
          onClick={saveOrder}
          disabled={isPending}
          className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1 text-sm font-semibold text-[rgb(var(--fg))] transition-colors hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-soft))] hover:text-[rgb(var(--accent))] disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save order"}
        </button>
      </div>

      {/* Rows (same layout, but draggable + handle) */}
      {items.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between gap-4 px-4 py-3"
          draggable
          onDragStart={() => onDragStart(p.id)}
          onDragOver={onDragOver}
          onDrop={() => onDrop(p.id)}
        >
          <div className="flex min-w-0 items-center gap-3">
            {/* Drag handle (visual only; the row itself is draggable) */}
            <span
              className="select-none text-lg leading-none text-[rgb(var(--muted))]"
              title="Drag to reorder"
              aria-hidden="true"
            >
              ≡
            </span>

            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-[rgb(var(--fg))]">{p.title}</div>
              <div className="mt-0.5 text-xs text-[rgb(var(--muted))]">
                {p.status} • <span className="font-mono">/projects/{p.slug}</span>
              </div>
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

      {!items.length ? (
        <div className="px-4 py-8 text-sm text-[rgb(var(--muted))]">No projects yet.</div>
      ) : null}
    </>
  )
}
