import Link from "next/link"
import Image from "next/image"

function unwrapCdnUrl(url: string) {
  // Example:
  // https://www.aoassociates.com/x/cdn/?https://storage.googleapis.com/...
  try {
    const u = new URL(url)
    if (u.pathname.startsWith("/x/cdn/")) {
      const candidate = u.searchParams.toString() // sometimes it's stored as raw query without key
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
  // This is just a safety check. Next/image enforces config anyway.
  // We use it to decide whether to render <Image> or <img>.
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
    // relative paths like /images/...
    return src.startsWith("/")
  }
}

export function ProjectCard({ project }: { project: any }) {
  const rawCover = project.images?.[0]?.url || project.coverImageUrl || ""
  const cover = rawCover ? unwrapCdnUrl(rawCover) : ""

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group overflow-hidden bg-gray-100/10 hover:shadow-md hover:scale-[1.01] transition"
    >
      <div className="relative aspect-[4/3] w-full bg-[rgb(var(--card))]">
        {cover ? (
          isLikelyAllowedForNextImage(cover) ? (
            <Image
              src={cover}
              alt={project.title || "Project image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          ) : (
            // Fallback that will NOT crash, even for unknown hostnames
            <img
              src={cover}
              alt={project.title || "Project image"}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-xl text-[rgb(var(--muted))]">
            No image
          </div>
        )}
      </div>

      <div className="px-3 py-1">
        <div className="text-3xl text-green-700 font-semibold">{project.title}</div>
        <div className="mt-1 text-xl text-yellow-700 font-medium">
          {project.location || "—"} {project.year ? `• ${project.year}` : ""}
        </div>
        {project.summary ? (
          <div className="mt-2 line-clamp-2 text-xl text-gray-700">
            {project.summary}
          </div>
        ) : null}
      </div>
    </Link>
  )
}
