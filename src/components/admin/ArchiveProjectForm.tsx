"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ImageUploader } from "@/src/components/admin/ImageUploader"

type Img = {
  id?: string
  url: string
  alt: string
  caption?: string | null
  credit?: string | null
  notes?: string | null
  order: number
}

type ArchivePayload = {
  title: string
  slug?: string
  summary?: string | null
  location?: string | null

  originalYear?: number | null
  interventionYear?: number | null
  typology?: string | null
  interventionType?: string | null
  scope?: string | null
  existingCondition?: string | null
  constraints?: string | null
  strategy?: string | null
  outcome?: string | null

  sustainability?: string | null
  tags: string[]
  body?: string | null
  status: "DRAFT" | "PUBLISHED"
  images: Img[]
}

const empty: ArchivePayload = {
  title: "",
  slug: "",
  summary: "",
  location: "",
  originalYear: null,
  interventionYear: new Date().getFullYear(),
  typology: "",
  interventionType: "",
  scope: "",
  existingCondition: "",
  constraints: "",
  strategy: "",
  outcome: "",
  sustainability: "",
  tags: [],
  body: `## Context\n\n## Goals\n\n## Constraints\n\n## Strategy\n\n## Outcome\n`,
  status: "DRAFT",
  images: [],
}

export function ArchiveProjectForm({ mode, id }: { mode: "create" | "edit"; id?: string }) {
  const [data, setData] = useState<ArchivePayload>(empty)
  const [loading, setLoading] = useState(mode === "edit")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tagText = useMemo(() => data.tags.join(", "), [data.tags])

  useEffect(() => {
    if (mode !== "edit" || !id) return
    ;(async () => {
      setLoading(true)
      const res = await fetch(`/api/admin/archives/${id}`)
      const json = await res.json()
      if (json.archive) {
        setData({
          title: json.archive.title ?? "",
          slug: json.archive.slug ?? "",
          summary: json.archive.summary ?? "",
          location: json.archive.location ?? "",
          originalYear: json.archive.originalYear ?? null,
          interventionYear: json.archive.interventionYear ?? null,
          typology: json.archive.typology ?? "",
          interventionType: json.archive.interventionType ?? "",
          scope: json.archive.scope ?? "",
          existingCondition: json.archive.existingCondition ?? "",
          constraints: json.archive.constraints ?? "",
          strategy: json.archive.strategy ?? "",
          outcome: json.archive.outcome ?? "",
          sustainability: json.archive.sustainability ?? "",
          tags: json.archive.tags ?? [],
          body: json.archive.body ?? "",
          status: json.archive.status ?? "DRAFT",
          images: (json.archive.images ?? []).map((i: any) => ({
            id: i.id,
            url: i.url,
            alt: i.alt,
            caption: i.caption,
            credit: i.credit,
            notes: i.notes,
            order: i.order ?? 0,
          })),
        })
      }
      setLoading(false)
    })()
  }, [mode, id])

  async function save() {
    setSaving(true)
    setError(null)

    const payload = {
      ...data,
      originalYear: data.originalYear ? Number(data.originalYear) : null,
      interventionYear: data.interventionYear ? Number(data.interventionYear) : null,
      tags: data.tags.filter(Boolean),
      images: data.images
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((img, idx) => ({ ...img, order: idx })),
    }

    const res =
      mode === "create"
        ? await fetch("/api/admin/archives", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/admin/archives/${id}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          })

    const json = await res.json()
    if (!res.ok) {
      setError(json?.error || "Save failed.")
      setSaving(false)
      return
    }

    if (mode === "create") {
      window.location.href = `/admin/archives/${json.archive.id}/edit`
      return
    }

    setSaving(false)
  }

  async function remove() {
    if (mode !== "edit" || !id) return
    const ok = confirm("Delete this archive permanently?")
    if (!ok) return
    const res = await fetch(`/api/admin/archives/${id}`, { method: "DELETE" })
    if (res.ok) window.location.href = "/admin/archives"
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-6">
        Loading…
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">{mode === "create" ? "New Archive" : "Edit Archive"}</h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            Archives are legacy projects (renovation, reconstruction, adaptive reuse).
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--accent))] transition-colors hover:bg-[rgb(var(--accent))] hover:text-white disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>

          {mode === "edit" ? (
            <button
              onClick={remove}
              className="rounded-full border border-red-200 bg-[rgb(var(--bg))] px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Delete
            </button>
          ) : null}

          <Link
            href="/admin/archives"
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm hover:bg-[rgb(var(--card))]"
          >
            Back
          </Link>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Field label="Title">
            <input
              value={data.title}
              onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))}
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm"
            />
          </Field>

          <Field label="Slug (optional)">
            <input
              value={data.slug || ""}
              onChange={(e) => setData((d) => ({ ...d, slug: e.target.value }))}
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm"
            />
          </Field>

          <Field label="Summary">
            <textarea
              value={data.summary || ""}
              onChange={(e) => setData((d) => ({ ...d, summary: e.target.value }))}
              className="min-h-20 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Location">
              <input
                value={data.location || ""}
                onChange={(e) => setData((d) => ({ ...d, location: e.target.value }))}
                className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm"
              />
            </Field>

            <Field label="Intervention Year">
              <input
                value={data.interventionYear ?? ""}
                onChange={(e) => setData((d) => ({ ...d, interventionYear: e.target.value ? Number(e.target.value) : null }))}
                type="number"
                className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Original Year (optional)">
              <input
                value={data.originalYear ?? ""}
                onChange={(e) => setData((d) => ({ ...d, originalYear: e.target.value ? Number(e.target.value) : null }))}
                type="number"
                className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm"
              />
            </Field>

            <Field label="Typology">
              <input
                value={data.typology || ""}
                onChange={(e) => setData((d) => ({ ...d, typology: e.target.value }))}
                className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm"
              />
            </Field>
          </div>

          <Field label="Intervention Type (e.g., Renovation, Adaptive Reuse)">
            <input
              value={data.interventionType || ""}
              onChange={(e) => setData((d) => ({ ...d, interventionType: e.target.value }))}
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm"
            />
          </Field>

          <Field label="Scope (one line)">
            <input
              value={data.scope || ""}
              onChange={(e) => setData((d) => ({ ...d, scope: e.target.value }))}
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm"
            />
          </Field>

          <Field label="Existing Condition (before)">
            <textarea
              value={data.existingCondition || ""}
              onChange={(e) => setData((d) => ({ ...d, existingCondition: e.target.value }))}
              className="min-h-20 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm"
            />
          </Field>

          <Field label="Constraints (archive-specific)">
            <textarea
              value={data.constraints || ""}
              onChange={(e) => setData((d) => ({ ...d, constraints: e.target.value }))}
              className="min-h-20 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm"
            />
          </Field>

          <Field label="Strategy (archive-specific)">
            <textarea
              value={data.strategy || ""}
              onChange={(e) => setData((d) => ({ ...d, strategy: e.target.value }))}
              className="min-h-20 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm"
            />
          </Field>

          <Field label="Outcome (archive-specific)">
            <textarea
              value={data.outcome || ""}
              onChange={(e) => setData((d) => ({ ...d, outcome: e.target.value }))}
              className="min-h-20 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm"
            />
          </Field>

          <Field label="Sustainability (one line)">
            <input
              value={data.sustainability || ""}
              onChange={(e) => setData((d) => ({ ...d, sustainability: e.target.value }))}
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm"
            />
          </Field>

          <Field label="Tags (comma separated)">
            <input
              value={tagText}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                }))
              }
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm"
            />
          </Field>

          <Field label="Narrative (Markdown)">
            <textarea
              value={data.body || ""}
              onChange={(e) => setData((d) => ({ ...d, body: e.target.value }))}
              className="min-h-64 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 font-mono text-xs"
            />
          </Field>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
            <div className="text-sm font-semibold">Publishing</div>
            <div className="mt-3 grid gap-3">
              <select
                value={data.status}
                onChange={(e) => setData((d) => ({ ...d, status: e.target.value as any }))}
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
              <div className="text-xs text-[rgb(var(--muted))]">Draft archives won’t appear on the public site.</div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-5">
            <div className="text-sm font-semibold">Gallery Images</div>
            <p className="mt-1 text-xs text-[rgb(var(--muted))]">
              Add images with caption/credit/notes. The public archive page shows these per photo.
            </p>

            <div className="mt-4">
              <ImageUploader
                onUploaded={(url) => {
                  setData((d) => ({
                    ...d,
                    images: [...d.images, { url, alt: "Archive image", caption: "", credit: "", notes: "", order: d.images.length }],
                  }))
                }}
              />
            </div>

            <div className="mt-4 grid gap-4">
              {data.images.map((img, idx) => (
                <div key={idx} className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-4">
                  <div className="text-xs text-[rgb(var(--muted))] break-all">{img.url}</div>

                  <div className="mt-3 grid gap-2">
                    <input
                      value={img.alt}
                      onChange={(e) => {
                        const alt = e.target.value
                        setData((d) => {
                          const next = d.images.slice()
                          next[idx] = { ...next[idx], alt }
                          return { ...d, images: next }
                        })
                      }}
                      placeholder="Alt text"
                      className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm"
                    />

                    <input
                      value={img.caption || ""}
                      onChange={(e) => {
                        const caption = e.target.value
                        setData((d) => {
                          const next = d.images.slice()
                          next[idx] = { ...next[idx], caption }
                          return { ...d, images: next }
                        })
                      }}
                      placeholder="Caption"
                      className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm"
                    />

                    <input
                      value={img.credit || ""}
                      onChange={(e) => {
                        const credit = e.target.value
                        setData((d) => {
                          const next = d.images.slice()
                          next[idx] = { ...next[idx], credit }
                          return { ...d, images: next }
                        })
                      }}
                      placeholder="Credit (optional)"
                      className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm"
                    />

                    <textarea
                      value={img.notes || ""}
                      onChange={(e) => {
                        const notes = e.target.value
                        setData((d) => {
                          const next = d.images.slice()
                          next[idx] = { ...next[idx], notes }
                          return { ...d, images: next }
                        })
                      }}
                      placeholder="Notes (optional)"
                      className="min-h-20 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setData((d) => {
                            const next = d.images.slice()
                            if (idx > 0) [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
                            return { ...d, images: next.map((x, i) => ({ ...x, order: i })) }
                          })
                        }}
                        className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1 text-sm hover:bg-[rgb(var(--card))]"
                      >
                        Up
                      </button>
                      <button
                        onClick={() => {
                          setData((d) => {
                            const next = d.images.slice()
                            if (idx < next.length - 1) [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]
                            return { ...d, images: next.map((x, i) => ({ ...x, order: i })) }
                          })
                        }}
                        className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1 text-sm hover:bg-[rgb(var(--card))]"
                      >
                        Down
                      </button>
                      <button
                        onClick={() => {
                          setData((d) => {
                            const next = d.images.slice()
                            next.splice(idx, 1)
                            return { ...d, images: next.map((x, i) => ({ ...x, order: i })) }
                          })
                        }}
                        className="ml-auto rounded-full border border-red-200 bg-[rgb(var(--bg))] px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {!data.images.length ? <div className="text-sm text-[rgb(var(--muted))]">No images yet.</div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">{label}</div>
      {children}
    </div>
  )
}
