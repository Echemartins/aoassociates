import Link from "next/link"
import Image from "next/image"

export function ArchiveCard({ archive }: { archive: any }) {
  const cover = archive.images?.[0]?.url || archive.coverImageUrl || ""

  return (
    <Link
      href={`/archives/${encodeURIComponent(archive.slug)}`}
      className={[
        "group block overflow-hidden rounded-[10px] border border-[rgb(var(--border))]",
        "bg-[rgb(var(--card))] transition hover:-translate-y-[2px] hover:shadow-md",
      ].join(" ")}
    >
      <div className="relative aspect-[4/3] w-full bg-[rgb(var(--card-2))]">
        {cover ? (
          <Image
            src={cover}
            alt={archive.title || "Archive image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-medium text-[rgb(var(--muted))]">
            No image
          </div>
        )}

        {/* Archive pill */}
        <div className="absolute left-3 top-3 inline-flex items-center rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          Archive
        </div>
      </div>

      <div className="p-4">
        <div className="text-lg font-semibold tracking-tight text-[rgb(var(--fg))]">
          {archive.title}
        </div>

        <div className="mt-1 text-sm font-medium text-[rgb(var(--muted))]">
          {archive.location || "—"}
        </div>

        {(archive.interventionType || archive.interventionYear) ? (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-[rgb(var(--fg))]">
            {archive.interventionType ? (
              <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--accent-soft))] px-3 py-1 text-[rgb(var(--fg))]">
                {archive.interventionType}
              </span>
            ) : null}

            {archive.interventionYear ? (
              <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1 text-[rgb(var(--muted))]">
                {archive.interventionYear}
              </span>
            ) : null}
          </div>
        ) : null}

        {archive.summary ? (
          <div className="mt-2 line-clamp-2 text-sm leading-relaxed text-[rgb(var(--muted))]">
            {archive.summary}
          </div>
        ) : null}

        <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--accent))]">
          View archive <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </div>
      </div>
    </Link>
  )
}
