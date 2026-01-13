import Link from "next/link"
import Image from "next/image"

export function ProjectCard({ project }: { project: any }) {
  const cover = project.images?.[0]?.url || project.coverImageUrl || ""

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-white hover:shadow-sm"
    >
      <div className="relative aspect-[4/3] w-full bg-[rgb(var(--card))]">
        {cover ? (
          <Image
            src={cover}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[rgb(var(--muted))]">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-sm font-semibold">{project.title}</div>
        <div className="mt-1 text-sm text-[rgb(var(--muted))]">
          {project.location || "—"} {project.year ? `• ${project.year}` : ""}
        </div>
        {project.summary ? (
          <div className="mt-2 line-clamp-2 text-sm text-[rgb(var(--muted))]">
            {project.summary}
          </div>
        ) : null}
      </div>
    </Link>
  )
}
