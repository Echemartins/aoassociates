import Link from "next/link"
import Image from "next/image"

export function ArchiveCard({ archive }: { archive: any }) {
  const cover = archive.images?.[0]?.url || archive.coverImageUrl || ""

  return (
    <Link
      href={`/archives/${archive.slug}`}
      className="group overflow-hidden rounded-[6px] bg-[rgb(var(--card))] hover:shadow-md hover:scale-[1.01] transition"
    >
      <div className="relative aspect-[4/3] w-full bg-[rgb(var(--card))]">
        {cover ? (
          <Image
            src={cover}
            alt={archive.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[rgb(var(--muted))]">No image</div>
        )}
      </div>

      <div className="p-3">
        <div className="text-md font-semibold">{archive.title}</div>

        <div className="mt-1 text-sm font-medium text-[rgb(var(--muted))]">
          {archive.location || "—"}
        </div>

        <div className="mt-1 text-xs text-[rgb(var(--muted))]">
          {archive.interventionType ? <span>{archive.interventionType}</span> : null}
          {archive.interventionYear ? <span> {archive.interventionType ? "• " : ""}{archive.interventionYear}</span> : null}
        </div>

        {archive.summary ? (
          <div className="mt-2 line-clamp-2 text-sm text-[rgb(var(--muted))]">{archive.summary}</div>
        ) : null}
      </div>
    </Link>
  )
}
