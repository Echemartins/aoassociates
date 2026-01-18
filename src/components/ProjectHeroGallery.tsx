"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi"

type Img = {
  url: string
  alt: string
  caption?: string | null
  credit?: string | null
  notes?: string | null
}

function isLocal(src: string) {
  return src?.startsWith("/")
}

/**
 * Avoid Next/Image remote-host restrictions by using <img> for remote URLs.
 * Local assets (/images/...) still use next/image.
 */
function MediaFill({ src, alt, className }: { src: string; alt: string; className?: string }) {
  if (!src) return null

  if (isLocal(src)) {
    return (
      <Image
        src={src}
        alt={alt || "Image"}
        fill
        sizes="100vw"
        className={className || "object-cover"}
        priority={false}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt || "Image"}
      className={className || "object-cover"}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      loading="lazy"
    />
  )
}

export function ProjectHeroGallery({ images }: { images: Img[] }) {
  const list = useMemo(() => (images || []).filter((x) => x?.url), [images])
  const [index, setIndex] = useState(0)

  // Overlay (details modal)
  const [open, setOpen] = useState(false)
  const [modalIndex, setModalIndex] = useState(0)

  const hero = list[index]

  const canPrev = index > 0
  const canNext = index < list.length - 1

  function prev() {
    if (!canPrev) return
    setIndex((i) => Math.max(0, i - 1))
  }

  function next() {
    if (!canNext) return
    setIndex((i) => Math.min(list.length - 1, i + 1))
  }

  function openModal(i: number) {
    setModalIndex(i)
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
  }

  // ESC close + body scroll lock
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
      if (!open) return
      if (e.key === "ArrowLeft") setModalIndex((x) => Math.max(0, x - 1))
      if (e.key === "ArrowRight") setModalIndex((x) => Math.min(list.length - 1, x + 1))
    }

    if (open) {
      document.addEventListener("keydown", onKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [open, list.length])

  if (!list.length) return null

  const modalImg = list[modalIndex]
  const modalCanPrev = modalIndex > 0
  const modalCanNext = modalIndex < list.length - 1

  return (
    <div className="mt-8">
      {/* HERO IMAGE (90vw) */}
      <div className="mx-auto w-full">
        <div className="relative overflow-hidden border border-[rgb(var(--border))] bg-[rgb(var(--card))]">
          <div className="relative h-[78vh] min-h-[280px] max-h-[880px] w-full">
            {/* “See all parts” centering */}
            <div className="absolute inset-0 bg-[rgb(var(--card))]" />

            <button
              type="button"
              onClick={() => openModal(index)}
              className="absolute inset-0 cursor-zoom-in"
              aria-label="Open image details"
              title="Open image details"
            />

            <div className="absolute inset-0">
              <MediaFill
                src={hero.url}
                alt={hero.alt || "Project image"}
                className="object-cover"
              />
            </div>

            {/* HERO ARROWS */}
            <button
              type="button"
              onClick={prev}
              disabled={!canPrev}
              aria-label="Previous image"
              className={[
                "absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border",
                "border-[rgb(var(--border))] bg-[rgba(255,255,255,0.80)] backdrop-blur",
                "transition-opacity hover:opacity-95",
                !canPrev ? "opacity-35 cursor-not-allowed" : "",
              ].join(" ")}
            >
              <FiChevronLeft className="h-5 w-5 text-[rgb(var(--fg))]" />
            </button>

            <button
              type="button"
              onClick={next}
              disabled={!canNext}
              aria-label="Next image"
              className={[
                "absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border",
                "border-[rgb(var(--border))] bg-[rgba(255,255,255,0.80)] backdrop-blur",
                "transition-opacity hover:opacity-95",
                !canNext ? "opacity-35 cursor-not-allowed" : "",
              ].join(" ")}
            >
              <FiChevronRight className="h-5 w-5 text-[rgb(var(--fg))]" />
            </button>

            {/* INDEX CHIP */}
            <div className="absolute bottom-3 left-3 rounded-full border border-[rgb(var(--border))] bg-[rgba(255,255,255,0.80)] px-3 py-1 text-xs text-[rgb(var(--muted))] backdrop-blur">
              {index + 1} / {list.length}
            </div>
          </div>
        </div>

        {/* THUMBNAILS */}
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {list.map((img, i) => {
            const active = i === index
            return (
              <button
                key={`${img.url}-${i}`}
                type="button"
                onClick={() => {
                  setIndex(i)
                  openModal(i) // open details “as before”
                }}
                className={[
                  "relative overflow-hidden hover:scale-105 transition-transform",
                  active ? "scale-103" : "",
                ].join(" ")}
                aria-label={`Open image ${i + 1}`}
                title="Open image details"
              >
                <div className="relative aspect-[4/3] w-full">
                  <div className="absolute inset-0">
                    <MediaFill src={img.url} alt={img.alt || "Thumbnail"} className="object-cover" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <p className="mt-2 text-xs text-[rgb(var(--muted))]">
          Tip: Use the arrows on the main image to browse. Click any thumbnail to open details.
        </p>
      </div>

      {/* DETAILS OVERLAY (caption/credit/notes) */}
      {open ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <button
            aria-label="Close"
            onClick={closeModal}
            className="absolute inset-0 bg-black/60"
          />

          {/* Modal */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl overflow-hidden rounded-[12px] border border-[rgb(var(--border))] bg-[rgb(var(--bg))] shadow-xl">
              {/* Top bar */}
              <div className="flex items-center justify-between border-b border-[rgb(var(--border))] px-4 py-3">
                <div className="text-sm font-semibold text-[rgb(var(--fg))]">
                  Image {modalIndex + 1} / {list.length}
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] hover:bg-[rgb(var(--card))]"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Image area */}
              <div className="relative bg-[rgb(var(--card))]">
                <div className="relative h-[60vh] min-h-[320px] w-full">
                  {/* “See all parts” centering */}
                  <div className="absolute inset-0">
                    <MediaFill
                      src={modalImg.url}
                      alt={modalImg.alt || "Project image"}
                      className="object-contain"
                    />
                  </div>

                  {/* Overlay arrows */}
                  <button
                    type="button"
                    onClick={() => modalCanPrev && setModalIndex((x) => x - 1)}
                    disabled={!modalCanPrev}
                    aria-label="Previous"
                    className={[
                      "absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border",
                      "border-[rgb(var(--border))] bg-[rgba(255,255,255,0.85)] backdrop-blur",
                      !modalCanPrev ? "opacity-35 cursor-not-allowed" : "hover:opacity-95",
                    ].join(" ")}
                  >
                    <FiChevronLeft className="h-5 w-5 text-[rgb(var(--fg))]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => modalCanNext && setModalIndex((x) => x + 1)}
                    disabled={!modalCanNext}
                    aria-label="Next"
                    className={[
                      "absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border",
                      "border-[rgb(var(--border))] bg-[rgba(255,255,255,0.85)] backdrop-blur",
                      !modalCanNext ? "opacity-35 cursor-not-allowed" : "hover:opacity-95",
                    ].join(" ")}
                  >
                    <FiChevronRight className="h-5 w-5 text-[rgb(var(--fg))]" />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="grid gap-2 px-4 py-4 text-sm">
                {modalImg.caption ? (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                      Caption
                    </div>
                    <div className="mt-1 text-[rgb(var(--fg))]">{modalImg.caption}</div>
                  </div>
                ) : null}

                {modalImg.credit ? (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                      Credit
                    </div>
                    <div className="mt-1 text-[rgb(var(--fg))]">{modalImg.credit}</div>
                  </div>
                ) : null}

                {modalImg.notes ? (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                      Notes
                    </div>
                    <div className="mt-1 text-[rgb(var(--fg))]">{modalImg.notes}</div>
                  </div>
                ) : null}

                {!modalImg.caption && !modalImg.credit && !modalImg.notes ? (
                  <div className="text-[rgb(var(--muted))]">No additional details for this image.</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
