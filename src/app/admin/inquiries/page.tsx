"use client"

import { useEffect, useMemo, useState } from "react"

type Inquiry = {
  id: string
  name?: string | null
  email?: string | null
  phone?: string | null
  projectType?: string | null
  message?: string | null
  status: string
  createdAt: string
}

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    const res = await fetch("/api/admin/inquiries", { cache: "no-store" })
    const json = await res.json()
    if (!res.ok) setError(json?.error || "Failed to load inquiries.")
    setItems(json?.inquiries || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const i of items) map[i.status] = (map[i.status] || 0) + 1
    return map
  }, [items])

  async function setStatus(id: string, status: string) {
    setBusyId(id)
    setError(null)
    const res = await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setError(j?.error || "Status update failed.")
    }
    await load()
    setBusyId(null)
  }

  async function remove(id: string) {
    const ok = confirm("Delete this inquiry permanently?")
    if (!ok) return
    setBusyId(id)
    setError(null)

    const res = await fetch("/api/admin/inquiries", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setError(j?.error || "Delete failed.")
    }
    await load()
    setBusyId(null)
  }

  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-white p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Inquiries</h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            New project inquiries submitted from the Contact page.
          </p>
        </div>
        <button
          onClick={load}
          className="rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm hover:bg-[rgb(var(--card))]"
        >
          Refresh
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-[rgb(var(--muted))]">
        {Object.entries(counts).map(([k, v]) => (
          <span key={k} className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1">
            {k}: {v}
          </span>
        ))}
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 text-sm text-[rgb(var(--muted))]">Loading…</div>
      ) : (
        <div className="mt-6 grid gap-4">
          {items.map((i) => (
            <div key={i.id} className="rounded-2xl border border-[rgb(var(--border))] p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-sm font-semibold">
                    {i.name || "Unknown"}{" "}
                    <span className="text-xs font-normal text-[rgb(var(--muted))]">
                      • {new Date(i.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                    {i.email ? <span>{i.email}</span> : null}
                    {i.phone ? <span> • {i.phone}</span> : null}
                    {i.projectType ? <span> • {i.projectType}</span> : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1 text-xs">
                    {i.status}
                  </span>
                  <button
                    disabled={busyId === i.id}
                    onClick={() => setStatus(i.id, "NEW")}
                    className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-sm hover:bg-[rgb(var(--card))] disabled:opacity-60"
                  >
                    Mark New
                  </button>
                  <button
                    disabled={busyId === i.id}
                    onClick={() => setStatus(i.id, "IN_PROGRESS")}
                    className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-sm hover:bg-[rgb(var(--card))] disabled:opacity-60"
                  >
                    In Progress
                  </button>
                  <button
                    disabled={busyId === i.id}
                    onClick={() => setStatus(i.id, "DONE")}
                    className="rounded-full bg-[rgb(var(--fg))] px-3 py-1 text-sm text-white hover:opacity-90 disabled:opacity-60"
                  >
                    Done
                  </button>
                  <button
                    disabled={busyId === i.id}
                    onClick={() => remove(i.id)}
                    className="rounded-full border border-red-200 px-3 py-1 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {i.message ? (
                <div className="mt-3 whitespace-pre-wrap text-sm text-[rgb(var(--muted))]">
                  {i.message}
                </div>
              ) : null}
            </div>
          ))}

          {!items.length ? (
            <div className="text-sm text-[rgb(var(--muted))]">No inquiries yet.</div>
          ) : null}
        </div>
      )}
    </div>
  )
}
