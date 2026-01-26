"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi"

type ArchiveLite = {
  id: string
  slug: string
  title?: string | null
  summary?: string | null
  location?: string | null
  interventionType?: string | null
  interventionYear?: number | null
  tags?: string[]
  images?: { url: string }[]
  coverImageUrl?: string | null
}

type Img = {
  url: string
  alt: string
  caption?: string | null
  credit?: string | null
  notes?: string | null
}

function unwrapCdnUrl(url: string) {
  try {
    const u = new URL(url)
    if (u.pathname.startsWith("/x/cdn/")) {
      const candidate = u.searchParams.toString()
      const urlParam = u.searchParams.get("url")
      const raw = urlParam || (candidate.startsWith("http") ? candidate : "")
      return raw ? decodeURIComponent(raw) : url
    }
  } catch {}
  return url
}

function isLocal(src: string) {
  return src?.startsWith("/")
}

function isLikelyAllowedForNextImage(src: string) {
  try {
    const h = new URL(src).hostname
    const allowed = new Set([
      "aoassociates.com",
      "www.aoassociates.com",
      "storage.googleapis.com",
      "s3.amazonaws.com",
    ])
    if (allowed.has(h)) return true
    if (h.endsWith(".s3.amazonaws.com")) return true
    if (h.includes(".s3.") && h.endsWith(".amazonaws.com")) return true
    return false
  } catch {
    return src.startsWith("/")
  }
}

function shouldBypassNextImageOptimization(src: string) {
  try {
    const h = new URL(src).hostname
    return h.includes("amazonaws.com") || h.includes("s3.")
  } catch {
    return false
  }
}

/**
 * Card image: NO CROP (object-contain) + optional bottom anchor + optional soft backdrop (disabled here for cleaner look).
 * If you want the blurred backdrop like Projects, you can re-add it.
 */
function MediaContainOne({
  src,
  alt,
  containClass = "object-contain object-bottom",
}: {
  src: string
  alt: string
  containClass?: string
}) {
  if (!src) return null

  if (isLocal(src)) {
    return (
      <Image
        src={src}
        alt={alt || "Image"}
        fill
        sizes="100vw"
        className={containClass}
        priority={false}
      />
    )
  }

  if (isLikelyAllowedForNextImage(src)) {
    const bypass = shouldBypassNextImageOptimization(src)
    return (
      <Image
        src={src}
        alt={alt || "Image"}
        fill
        sizes="100vw"
        className={containClass}
        priority={false}
        unoptimized={bypass}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt || "Image"}
      className={`absolute inset-0 h-full w-full ${containClass}`}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  )
}

/** Overlay image: NO CROP (object-contain). */
function MediaNoCropFill({
  src,
  alt,
  containClass = "object-contain",
}: {
  src: string
  alt: string
  containClass?: string
}) {
  if (!src) return null

  if (isLocal(src)) {
    return (
      <Image
        src={src}
        alt={alt || "Image"}
        fill
        sizes="100vw"
        className={containClass}
        priority={false}
      />
    )
  }

  if (isLikelyAllowedForNextImage(src)) {
    const bypass = shouldBypassNextImageOptimization(src)
    return (
      <Image
        src={src}
        alt={alt || "Image"}
        fill
        sizes="100vw"
        className={containClass}
        priority={false}
        unoptimized={bypass}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt || "Image"}
      className={`absolute inset-0 h-full w-full ${containClass}`}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  )
}

function ArchiveOverlay({
  open,
  onClose,
  archive,
}: {
  open: boolean
  onClose: () => void
  archive: any | null
}) {
  const list: Img[] = useMemo(() => {
    const imgs = (archive?.images || []).filter((x: any) => x?.url)
    return imgs.map((x: any) => ({
      ...x,
      url: unwrapCdnUrl(x.url),
      alt: x.alt || archive?.title || "Archive image",
    }))
  }, [archive])

  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (open) setIdx(0)
  }, [open])

  if (!open) return null

  const img = list[idx]
  const canPrev = idx > 0
  const canNext = idx < list.length - 1

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60" />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[92vh] w-[92vw] max-w-7xl overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] shadow-xl">
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-1 top-1 z-20 inline-flex h-10 w-10 lg:h-14 lg:w-14 items-center justify-center rounded-full border border-[rgb(var(--border))] bg-black/60 hover:opacity-95"
          >
            <FiX className="h-10 w-10 text-white" />
          </button>

          {/* Count */}
          <div className="absolute left-3 top-3 z-20 rounded-full border border-[rgb(var(--border))] bg-[rgba(255,255,255,0.85)] px-3 py-1 text-xs font-semibold text-[rgb(var(--fg))] backdrop-blur">
            {list.length ? `${idx + 1} / ${list.length}` : "—"}
          </div>

          <div className="h-full w-full overflow-y-auto md:overflow-hidden">
            <div className="grid min-h-full md:h-full md:grid-cols-12">
              {/* Logo */}
              <div className="md:col-span-2 border-b border-[rgb(var(--border))] md:border-b-0 md:border-r bg-[rgb(var(--card))]">
                <div className="flex h-full justify-center p-4">
                  <div className="relative h-24 w-40 md:h-44 md:w-full">
                    <Image
                      src="/images/aoalogo.png"
                      alt="Company logo"
                      fill
                      sizes="(max-width: 768px) 50vw, 160px"
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="md:col-span-3 border-b border-[rgb(var(--border))] md:border-b-0 md:border-r bg-[rgb(var(--card))]">
                <div className="h-full w-full md:overflow-y-auto">
                  <div className="px-3 py-3">
                    <div className="text-2xl font-semibold text-[rgb(var(--fg))]">
                      {archive?.title || "—"}
                    </div>

                    {/* <div className="mt-1 text-sm font-medium text-[rgb(var(--muted))]">
                      {archive?.location || "—"}
                      {archive?.interventionYear ? ` • ${archive.interventionYear}` : ""}
                    </div> */}

                    {/* <div className="mt-3">
                      <Link
                        href={`/archives/${encodeURIComponent(archive?.slug || "")}`}
                        className="text-sm font-semibold text-green-800 underline underline-offset-4"
                      >
                        Open full archive page
                      </Link>
                    </div> */}
                  </div>

                  <div className="px-3 pb-3 grid gap-1 text-sm">
                    {img?.notes ? (
                      <div>
                        <div className="mt-1 text-lg text-[rgb(var(--fg))]">{img.notes}</div>
                      </div>
                    ) : null}

                    {!img?.notes ? (
                      <div className="text-[rgb(var(--muted))]">
                        {list.length ? "No additional details for this image." : "No images found for this archive."}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="md:col-span-7 bg-[rgb(var(--card))]">
                <div className="relative h-[44vh] min-h-[280px] md:h-full w-full">
                  {img?.url ? (
                    <div className="absolute inset-0">
                      <MediaNoCropFill
                        src={img.url}
                        alt={img.alt || "Archive image"}
                        containClass="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-medium text-[rgb(var(--muted))]">
                      Loading image…
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => canPrev && setIdx((x) => x - 1)}
                    disabled={!canPrev}
                    aria-label="Previous"
                    className={[
                      "absolute left-3 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 lg:h-16 lg:w-16 items-center justify-center rounded-full border",
                      "border-[rgb(var(--border))] bg-black/60",
                      !canPrev ? "opacity-35 cursor-not-allowed" : "hover:opacity-95",
                    ].join(" ")}
                  >
                    <FiChevronLeft className="h-5 w-5 lg:h-10 lg:w-10 text-white" />
                  </button>

                  <button
                    type="button"
                    onClick={() => canNext && setIdx((x) => x + 1)}
                    disabled={!canNext}
                    aria-label="Next"
                    className={[
                      "absolute right-3 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 lg:h-16 lg:w-16 items-center justify-center rounded-full border",
                      "border-[rgb(var(--border))] bg-black/60",
                      !canNext ? "opacity-35 cursor-not-allowed" : "hover:opacity-95",
                    ].join(" ")}
                  >
                    <FiChevronRight className="h-5 w-5 lg:h-10 lg:w-10 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export function ArchivesGridWithOverlay({ archives }: { archives: ArchiveLite[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeArchive, setActiveArchive] = useState<any | null>(null)

  // summary expand state per card
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  function toggleExpanded(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  async function openFromArchive(a: ArchiveLite) {
    setOpen(true)
    setLoading(true)
    setActiveArchive(null)

    try {
      const res = await fetch(`/api/public/archives/${encodeURIComponent(a.slug)}`, { cache: "no-store" })
      const j = await res.json().catch(() => null)
      if (!res.ok) throw new Error(j?.error || "Failed to load archive")
      setActiveArchive(j)
    } catch {
      setActiveArchive({ slug: a.slug, title: a.title, location: a.location, interventionYear: a.interventionYear, images: [] })
    } finally {
      setLoading(false)
    }
  }

  function close() {
    setOpen(false)
  }

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {archives.map((archive) => {
          const rawCover = archive.images?.[0]?.url || archive.coverImageUrl || ""
          const cover = rawCover ? unwrapCdnUrl(rawCover) : ""

          const isExpanded = !!expanded[archive.id]
          const summary = (archive.summary || "").trim()
          const showMore = summary.length > 140

          return (
            <button
              key={archive.id}
              type="button"
              onClick={() => openFromArchive(archive)}
              className={[
                "group w-full text-left",
                "transition hover:relative shadow hover:z-10 hover:shadow-md",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--accent),0.35)]",
              ].join(" ")}
            >
              {/* MEDIA: taller on desktop so contain images look larger, still no crop */}
              <div className="relative w-full overflow-hidden bg-[rgb(var(--card-2))] h-32 sm:h-36">
                {cover ? (
                  <MediaContainOne
                    src={cover}
                    alt={archive.title || "Archive image"}
                    containClass="object-contain object-bottom"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-medium text-[rgb(var(--muted))]">
                    No image
                  </div>
                )}
              </div>

              {/* DETAILS */}
              <div className="flex h-full text-center flex-col px-4 py-3">
                <div className="text-xl font-semibold tracking-tight text-green-800 md:text-2xl line-clamp-2">
                  {archive.title}
                </div>

                {summary ? (
                  <>
                    <div className={["mt-2 text-base font-medium text-gray-700", isExpanded ? "" : "line-clamp-3"].join(" ")}>
                      {summary}
                    </div>

                    {showMore ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleExpanded(archive.id)
                        }}
                        className="mt-2 w-fit text-sm font-semibold text-green-800 underline underline-offset-4 hover:opacity-85"
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? "Less" : "More"}
                      </button>
                    ) : null}
                  </>
                ) : null}

                <div className="mt-auto" />
              </div>
            </button>
          )
        })}
      </div>

      {open && loading ? (
        <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-[rgb(var(--border))] bg-white/90 px-4 py-2 text-sm font-semibold text-[rgb(var(--fg))] backdrop-blur">
          Loading archive…
        </div>
      ) : null}

      <ArchiveOverlay open={open} onClose={close} archive={activeArchive} />
    </>
  )
}
