import Link from "next/link"
import Image from "next/image"

function unwrapCdnUrl(url: string) {
  // Example:
  // https://www.aoassociates.com/x/cdn/?https://storage.googleapis.com/...
  try {
    const u = new URL(url)
    if (u.pathname.startsWith("/x/cdn/")) {
      const candidate = u.searchParams.toString()
      // handle both:
      // 1) /x/cdn/?https://....
      // 2) /x/cdn/?url=https://....
      const urlParam = u.searchParams.get("url")
      const raw = urlParam || (candidate.startsWith("http") ? candidate : "")
      return raw ? decodeURIComponent(raw) : url
    }
  } catch {}
  return url
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

export function ProjectCard({ project }: { project: any }) {
  const rawCover = project.images?.[0]?.url || project.coverImageUrl || ""
  const cover = rawCover ? unwrapCdnUrl(rawCover) : ""

  return (
    <Link
      href={`/projects/${encodeURIComponent(project.slug)}`}
      className={[
        "group block overflow-hidden rounded border border-[rgb(var(--border))]",
        "bg-[rgb(var(--card))] shadow-[0_0_0_0_rgba(0,0,0,0)]",
        "transition hover:-translate-y-[2px] hover:shadow-md",
      ].join(" ")}
    >
      {/* Media */}
      <div className="relative aspect-[4/3] w-full bg-[rgb(var(--card-2))]">
        {cover ? (
          isLikelyAllowedForNextImage(cover) ? (
            <Image
              src={cover}
              alt={project.title || "Project image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          ) : (
            <img
              src={cover}
              alt={project.title || "Project image"}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-medium text-[rgb(var(--muted))]">
            No image
          </div>
        )}

        {/* Subtle top gradient for legibility */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/25 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        {/* Status/Tag pill (optional) */}
        {/* {project.year ? (
          <div className="absolute left-3 top-3 inline-flex items-center rounded-full px-3 text-lg font-semibold bg-black/5 text-green-600">
          {project.location ? <span>{project.location}   </span> : <span>—</span>}{"  "}
          {project.year ? <span className="text-[rgb(var(--border))] mr-2">{""}</span> : null}
          {project.year ? <span>{project.year}</span> : null}
          </div>
        ) : null}
        <span></span> */}
      </div>

      {/* Copy */}
      <div className="p-4">
        <div className="text-2xl md:text-3xl font-semibold tracking-tight text-green-800">
          {project.title}
        </div>

        {project.summary ? (
          <div className="mt-2 line-clamp-2 text-xl leading-relaxed font-medium text-gray-700">
            {project.summary}
          </div>
        ) : null}
      </div>
    </Link>
  )
}
