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
    <div className="mt-1">
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
        <p className="mt-2 text-l text-[rgb(var(--muted))]">
            Use the arrows on the main image to browse.
        </p>

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

        <p className="mt-2 text-l text-[rgb(var(--muted))]">
          Click any Image to open details.
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

    {/* Modal (full-bleed content, minimal chrome) */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-[92vh] w-[92vw] max-w-7xl overflow-hidden rounded-[12px] border border-[rgb(var(--border))] bg-[rgb(var(--bg))] shadow-xl">
        {/* Absolute close */}
        <button
          type="button"
          onClick={closeModal}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgba(255,255,255,0.85)] backdrop-blur hover:opacity-95"
        >
          <FiX className="h-5 w-5 text-[rgb(var(--fg))]" />
        </button>

        {/* Absolute image counter */}
        <div className="absolute left-3 top-3 z-20 rounded-full border border-[rgb(var(--border))] bg-[rgba(255,255,255,0.85)] px-3 py-1 text-xs font-semibold text-[rgb(var(--fg))] backdrop-blur">
          {modalIndex + 1} / {list.length}
        </div>

        {/* Full-bleed 3-column layout: Logo | Details | Image */}
        <div className="grid h-full w-full md:grid-cols-12">
          {/* Logo (left) */}
          <div className="md:col-span-2 border-b border-[rgb(var(--border))] md:border-b-0 md:border-r bg-[rgb(var(--card))]">
            <div className="h-full w-full flex pt-10 justify-center">
              <div className="relative h-44 w-[95%]">
                <Image
                  src="/images/aoalogo.png" // <- change to your logo path
                  alt="Company logo"
                  fill
                  sizes="(max-width: 768px) 30vw, 160px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Details (middle) */}
          <div className="md:col-span-3 border-b border-[rgb(var(--border))] md:border-b-0 md:border-r bg-[rgb(var(--card))] overflow-auto">
            {/* No padding: use only minimal internal spacing via typography */}
            <div className="h-full w-full  overflow-auto">
              <div className="px-3 py-3">
                {/* <div className="text-2xl font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                  Image details
                </div> */}
              </div>

              <div className="px-3 py-3 grid gap-3 text-sm">
                {modalImg.caption ? (
                  <div>
                    <div className="text-xl font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                      Caption
                    </div>
                    <div className="mt-1 text-2xl text-[rgb(var(--fg))]">{modalImg.caption}</div>
                  </div>
                ) : null}

                {modalImg.credit ? (
                  <div>
                    <div className="text-xl mt-5 font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                      Credit
                    </div>
                    <div className="mt-1 text-2xl text-[rgb(var(--fg))]">{modalImg.credit}</div>
                  </div>
                ) : null}

                {modalImg.notes ? (
                  <div>
                    <div className="text-xl mt-5 font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                      Notes
                    </div>
                    <div className="mt-1 text-2xl text-[rgb(var(--fg))]">{modalImg.notes}</div>
                  </div>
                ) : null}

                {!modalImg.caption && !modalImg.credit && !modalImg.notes ? (
                  <div className="text-[rgb(var(--muted))]">No additional details for this image.</div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Image (right) */}
          <div className="md:col-span-7 bg-[rgb(var(--card))]">
            <div className="relative h-full w-full">
              {/* Image fill */}
              <div className="absolute inset-0">
                <MediaFill
                  src={modalImg.url}
                  alt={modalImg.alt || "Project image"}
                  className="object-cover"
                />
              </div>

              {/* Overlay arrows */}
              <button
                type="button"
                onClick={() => modalCanPrev && setModalIndex((x) => x - 1)}
                disabled={!modalCanPrev}
                aria-label="Previous"
                className={[
                  "absolute left-3 top-1/2 -translate-y-1/2 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border",
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
                  "absolute right-3 top-1/2 -translate-y-1/2 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border",
                  "border-[rgb(var(--border))] bg-[rgba(255,255,255,0.85)] backdrop-blur",
                  !modalCanNext ? "opacity-35 cursor-not-allowed" : "hover:opacity-95",
                ].join(" ")}
              >
                <FiChevronRight className="h-5 w-5 text-[rgb(var(--fg))]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
) : null}


    </div>
  )
}
