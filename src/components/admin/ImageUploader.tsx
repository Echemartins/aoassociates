"use client"

import { useRef, useState } from "react"

export function ImageUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pickedName, setPickedName] = useState<string>("")

  const [url, setUrl] = useState("")
  const [altHint, setAltHint] = useState("")

  // async function onPick(file: File | null) {
  //   if (!file) return
  //   setPickedName(file.name)
  //   setBusy(true)
  //   setError(null)

  //   try {
  //     const presign = await fetch("/api/admin/uploads/presign", {
  //       method: "POST",
  //       headers: { "content-type": "application/json" },
  //       body: JSON.stringify({ filename: file.name, contentType: file.type || "application/octet-stream" }),
  //     })
  //     const p = await presign.json()
  //     if (!presign.ok) throw new Error(p?.error || "Presign failed")

  //     const put = await fetch(p.uploadUrl, {
  //       method: "PUT",
  //       headers: { "content-type": file.type || "application/octet-stream" },
  //       body: file,
  //     })
  //     if (!put.ok) throw new Error("Upload failed")

  //     onUploaded(p.publicUrl)

  //     // reset input so re-selecting the same file triggers onChange
  //     if (inputRef.current) inputRef.current.value = ""
  //     setPickedName("")
  //   } catch (e: any) {
  //     setError(e?.message || "Upload failed")
  //   } finally {
  //     setBusy(false)
  //   }
  // }
  async function onPick(file: File | null) {
  if (!file) return
  setPickedName(file.name)
  setBusy(true)
  setError(null)

  try {
    const presign = await fetch("/api/admin/uploads/presign", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type || "application/octet-stream",
      }),
    })

    const p = await presign.json().catch(() => ({}))
    if (!presign.ok) throw new Error(p?.error || `Presign failed (${presign.status})`)
    if (!p?.uploadUrl) throw new Error("Presign missing uploadUrl")

    let putRes: Response
    try {
      putRes = await fetch(p.uploadUrl, {
        method: "PUT",
        headers: { "content-type": file.type || "application/octet-stream" },
        body: file,
      })
    } catch (err: any) {
      // Browser-level failure (very commonly CORS/preflight blocked)
      throw new Error(
        "Upload request was blocked by the browser (likely S3 CORS). " +
          "Check bucket CORS AllowedOrigins includes this site."
      )
    }

    if (!putRes.ok) {
      // If S3 returns a body and CORS allows it, show it.
      const text = await putRes.text().catch(() => "")
      throw new Error(`Upload failed (${putRes.status}). ${text ? `Details: ${text}` : ""}`.trim())
    }

    onUploaded(p.publicUrl)

    if (inputRef.current) inputRef.current.value = ""
    setPickedName("")
  } catch (e: any) {
    setError(e?.message || "Upload failed")
  } finally {
    setBusy(false)
  }
}


  function addUrl() {
    const v = url.trim()
    if (!v) return
    onUploaded(v)
    setUrl("")
    setAltHint("")
  }

  return (
    <div className="grid gap-3">
      {/* Hidden native input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        disabled={busy}
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        className="hidden"
      />

      {/* Primary controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--accent))] transition-colors hover:bg-[rgb(var(--accent))] hover:text-white disabled:opacity-60"
        >
          {busy ? "Uploading…" : "Choose Image"}
        </button>

        <div className="text-xs text-[rgb(var(--muted))]">
          {pickedName ? (
            <>
              Selected: <span className="font-medium text-[rgb(var(--fg))]">{pickedName}</span>
            </>
          ) : (
            "PNG/JPG/WebP recommended."
          )}
        </div>
      </div>

      {/* Status */}
      {busy ? (
        <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-xs text-[rgb(var(--muted))]">
          Uploading to storage… please wait.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      ) : null}

      {/* Manual URL entry (always visible) */}
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">Paste Image URL</div>
        <div className="mt-2 grid gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://… or /uploads/…"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm"
          />
          <input
            value={altHint}
            onChange={(e) => setAltHint(e.target.value)}
            placeholder="Alt text (optional)"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addUrl}
              className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-medium text-[rgb(var(--fg))] transition-colors hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-soft))] hover:text-[rgb(var(--accent))]"
            >
              Add URL
            </button>
            <div className="text-xs text-[rgb(var(--muted))]">
              Use this if S3/R2 isn’t configured or for existing hosted images.
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-[rgb(var(--muted))]">
        Tip: Keep filenames short and descriptive (e.g., <span className="font-mono">lobby-01.webp</span>).
      </div>
    </div>
  )
}
