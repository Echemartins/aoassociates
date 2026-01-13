"use client"

import { useState } from "react"

export function ImageUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onPick(file: File | null) {
    if (!file) return
    setBusy(true)
    setError(null)

    try {
      const presign = await fetch("/api/admin/uploads/presign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type || "application/octet-stream" }),
      })
      const p = await presign.json()
      if (!presign.ok) throw new Error(p?.error || "Presign failed")

      const put = await fetch(p.uploadUrl, {
        method: "PUT",
        headers: { "content-type": file.type || "application/octet-stream" },
        body: file,
      })
      if (!put.ok) throw new Error("Upload failed")

      onUploaded(p.publicUrl)
    } catch (e: any) {
      setError(e?.message || "Upload failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-2">
      <input
        type="file"
        accept="image/*"
        disabled={busy}
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        className="block w-full text-sm"
      />
      {busy ? <div className="text-xs text-[rgb(var(--muted))]">Uploading…</div> : null}
      {error ? <div className="text-xs text-red-600">{error}</div> : null}
      <div className="text-xs text-[rgb(var(--muted))]">
        If you haven’t configured S3/R2 yet, paste image URLs manually for now.
      </div>
    </div>
  )
}
