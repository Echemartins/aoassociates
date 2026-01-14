"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

type PostPayload = {
  title: string
  slug?: string
  excerpt?: string | null
  category?: string | null
  tags: string[]
  body?: string | null
  status: "DRAFT" | "PUBLISHED"
  publishedAt?: string | null // YYYY-MM-DD for input
}

const empty: PostPayload = {
  title: "",
  slug: "",
  excerpt: "",
  category: "",
  tags: [],
  body: `## Topic\n\n## Context\n\n## Key Decisions\n\n## Outcome\n`,
  status: "DRAFT",
  publishedAt: null,
}

export function PostForm({ mode, id }: { mode: "create" | "edit"; id?: string }) {
  const [data, setData] = useState<PostPayload>(empty)
  const [loading, setLoading] = useState(mode === "edit")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tagText = useMemo(() => data.tags.join(", "), [data.tags])

  useEffect(() => {
    if (mode !== "edit" || !id) return
    ;(async () => {
      setLoading(true)
      const res = await fetch(`/api/admin/posts/${id}`)
      const json = await res.json()

      if (json.post) {
        const p = json.post
        const publishedAt = p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0, 10) : null

        setData({
          title: p.title ?? "",
          slug: p.slug ?? "",
          excerpt: p.excerpt ?? "",
          category: p.category ?? "",
          tags: p.tags ?? [],
          body: p.body ?? "",
          status: p.status ?? "DRAFT",
          publishedAt,
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
      tags: data.tags.filter(Boolean),
      publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : null,
    }

    const res =
      mode === "create"
        ? await fetch("/api/admin/posts", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/admin/posts/${id}`, {
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
      window.location.href = `/admin/posts/${json.post.id}/edit`
      return
    }

    setSaving(false)
  }

  async function remove() {
    if (mode !== "edit" || !id) return
    const ok = confirm("Delete this post permanently?")
    if (!ok) return
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" })
    if (res.ok) window.location.href = "/admin/posts"
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-white p-6">
        Loading…
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-white p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{mode === "create" ? "New Archive Post" : "Edit Archive Post"}</h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            Markdown content renders on /archives/[slug].
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-full bg-[rgb(var(--fg))] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {mode === "edit" ? (
            <button
              onClick={remove}
              className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Delete
            </button>
          ) : null}
          <Link
            href="/admin/posts"
            className="rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm hover:bg-[rgb(var(--card))]"
          >
            Back
          </Link>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Field label="Title">
            <input
              value={data.title}
              onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))}
              className="w-full rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm"
            />
          </Field>

          <Field label="Slug (optional)">
            <input
              value={data.slug || ""}
              onChange={(e) => setData((d) => ({ ...d, slug: e.target.value }))}
              className="w-full rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm"
            />
          </Field>

          <Field label="Excerpt">
            <textarea
              value={data.excerpt || ""}
              onChange={(e) => setData((d) => ({ ...d, excerpt: e.target.value }))}
              className="min-h-20 w-full rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <input
                value={data.category || ""}
                onChange={(e) => setData((d) => ({ ...d, category: e.target.value }))}
                className="w-full rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm"
              />
            </Field>
            <Field label="Published Date (optional)">
              <input
                value={data.publishedAt ?? ""}
                onChange={(e) => setData((d) => ({ ...d, publishedAt: e.target.value || null }))}
                type="date"
                className="w-full rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm"
              />
            </Field>
          </div>

          <Field label="Tags (comma separated)">
            <input
              value={tagText}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                }))
              }
              className="w-full rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm"
            />
          </Field>

          <Field label="Body (Markdown)">
            <textarea
              value={data.body || ""}
              onChange={(e) => setData((d) => ({ ...d, body: e.target.value }))}
              className="min-h-80 w-full rounded-xl border border-[rgb(var(--border))] px-4 py-2 font-mono text-xs"
            />
          </Field>
        </div>

        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
            <div className="text-sm font-semibold">Publishing</div>
            <div className="mt-3 grid gap-3">
              <select
                value={data.status}
                onChange={(e) => setData((d) => ({ ...d, status: e.target.value as any }))}
                className="rounded-xl border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>

              <div className="text-xs text-[rgb(var(--muted))]">
                Published posts appear on the public Archives page.
              </div>
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
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
        {label}
      </div>
      {children}
    </div>
  )
}
