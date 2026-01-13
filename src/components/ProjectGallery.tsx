"use client"

import Image from "next/image"
import { useMemo, useState } from "react"

type Img = {
  id: string
  url: string
  alt: string
  caption?: string | null
  credit?: string | null
  notes?: string | null
}

export function ProjectGallery({ images }: { images: Img[] }) {
  const sorted = useMemo(() => images.slice().sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)), [images])
  const [active, setActive] = useState<number | null>(null)

  const current = active === null ? null : sorted[active]

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((img, idx) => (
          <button
            key={img.id}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-left"
            onClick={() => setActive(idx)}
          >
            <Image
              src={img.url}
              alt={img.alt || "Project image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            {img.caption ? (
              <div className="absolute inset-x-0 bottom-0 bg-black/45 p-2 text-xs text-white">
                <div className="line-clamp-1">{img.caption}</div>
              </div>
            ) : null}
          </button>
        ))}
      </div>

      {current ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <div
            className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[rgb(var(--border))] p-3">
              <div className="text-sm text-[rgb(var(--muted))]">
                Image {active! + 1} of {sorted.length}
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-sm hover:bg-[rgb(var(--card))]"
                  onClick={() => setActive((v) => (v === null ? null : Math.max(0, v - 1)))}
                  disabled={active === 0}
                >
                  Prev
                </button>
                <button
                  className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-sm hover:bg-[rgb(var(--card))]"
                  onClick={() => setActive((v) => (v === null ? null : Math.min(sorted.length - 1, v + 1)))}
                  disabled={active === sorted.length - 1}
                >
                  Next
                </button>
                <button
                  className="rounded-full bg-[rgb(var(--fg))] px-3 py-1 text-sm text-white hover:opacity-90"
                  onClick={() => setActive(null)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-3">
              <div className="relative lg:col-span-2">
                <div className="relative aspect-[16/10] w-full bg-[rgb(var(--card))]">
                  <Image
                    src={current.url}
                    alt={current.alt || "Project image"}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
              </div>

              <div className="border-t border-[rgb(var(--border))] p-5 lg:border-l lg:border-t-0">
                <div className="text-sm font-semibold">Photo details</div>
                <div className="mt-3 grid gap-3 text-sm text-[rgb(var(--muted))]">
                  {current.caption ? (
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--fg))]">
                        Caption
                      </div>
                      <div>{current.caption}</div>
                    </div>
                  ) : null}

                  {current.credit ? (
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--fg))]">
                        Credit
                      </div>
                      <div>{current.credit}</div>
                    </div>
                  ) : null}

                  {current.notes ? (
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--fg))]">
                        Notes
                      </div>
                      <div className="whitespace-pre-wrap">{current.notes}</div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
