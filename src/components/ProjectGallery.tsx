"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"

type GalleryImage = {
  id?: string
  url: string
  alt: string
  caption?: string | null
  credit?: string | null
  notes?: string | null
}

export function ProjectGallery({ images }: { images: GalleryImage[] }) {
  const items = useMemo(() => images?.filter((i) => i?.url) ?? [], [images])
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(0)

  const atStart = idx <= 0
  const atEnd = idx >= items.length - 1

  function close() {
    setOpen(false)
  }
  function prev() {
    setIdx((i) => Math.max(0, i - 1))
  }
  function next() {
    setIdx((i) => Math.min(items.length - 1, i + 1))
  }

  // keyboard support (esc / arrows)
  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [open, items.length])

  if (!items.length) return null

  const current = items[idx]

  return (
    <div>
      {/* Grid */}
      <div className="grid gap-2 grid-col-2 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((img, i) => (
          <button
            key={img.id ?? img.url}
            type="button"
            onClick={() => {
              setIdx(i)
              setOpen(true)
            }}
            className="group overflow-hidden rounded border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-left"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={img.url}
                alt={img.alt || "Project image"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
          </button>
        ))}
      </div>

      {/* Overlay */}
      {open ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <button
            className="absolute inset-0 bg-black/60"
            aria-label="Close viewer"
            onClick={close}
          />

          {/* Modal */}
          <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6">
            <div className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] shadow-2xl">
              {/* Top bar */}
              <div className="flex items-center justify-between gap-3 border-b border-[rgb(var(--border))] px-4 py-3">
                <div className="text-sm font-semibold">
                  Image {idx + 1} of {items.length}
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-sm hover:bg-[rgb(var(--card))]"
                >
                  Close
                </button>
              </div>

              {/* Viewer area */}
              <div className="relative bg-black/5">
                {/* arrows */}
                <button
                  type="button"
                  onClick={prev}
                  disabled={atStart}
                  aria-label="Previous image"
                  className={[
                    "absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border px-3 py-2 text-sm backdrop-blur transition",
                    atStart
                      ? "cursor-not-allowed border-[rgb(var(--border))] bg-white/50 opacity-40"
                      : "border-[rgb(var(--border))] bg-white/80 hover:bg-white",
                  ].join(" ")}
                >
                  <ArrowLeft />
                </button>

                <button
                  type="button"
                  onClick={next}
                  disabled={atEnd}
                  aria-label="Next image"
                  className={[
                    "absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border px-3 py-2 text-sm backdrop-blur transition",
                    atEnd
                      ? "cursor-not-allowed border-[rgb(var(--border))] bg-white/50 opacity-40"
                      : "border-[rgb(var(--border))] bg-white/80 hover:bg-white",
                  ].join(" ")}
                >
                  <ArrowRight />
                </button>

                {/* image */}
                <div className="relative mx-auto h-[62vh] w-full max-w-6xl">
                  <Image
                    src={current.url}
                    alt={current.alt || "Project image"}
                    fill
                    sizes="100vw"
                    // IMPORTANT: contain + center => shows all parts, centered
                    className="object-contain object-center"
                    priority
                  />
                </div>
              </div>

              {/* Details */}
              {(current.caption || current.credit || current.notes) ? (
                <div className="border-t border-[rgb(var(--border))] px-4 py-4">
                  {current.caption ? (
                    <div className="text-sm font-medium text-[rgb(var(--fg))]">{current.caption}</div>
                  ) : null}
                  {current.credit ? (
                    <div className="mt-1 text-xs text-[rgb(var(--muted))]">Credit: {current.credit}</div>
                  ) : null}
                  {current.notes ? (
                    <div className="mt-2 text-sm text-[rgb(var(--muted))]">{current.notes}</div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ArrowLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
