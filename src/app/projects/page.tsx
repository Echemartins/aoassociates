import Link from "next/link"
import { Container } from "@/src/components/Container"
import { prisma } from "@/src/lib/prisma"
import { ProjectCard } from "@/src/components/ProjectCard"

export const revalidate = 60

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?: { q?: string; tag?: string }
}) {
  const q = (searchParams?.q || "").trim()
  const tag = (searchParams?.tag || "").trim()

  const projects = await prisma.project.findMany({
    where: {
      status: "PUBLISHED",
      AND: [
        q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { summary: { contains: q, mode: "insensitive" } },
                { location: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        tag ? { tags: { has: tag } } : {},
      ],
    },
    orderBy: [{ year: "desc" }, { title: "asc" }],
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  })

  // Gather tags for filter UI
  const all = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    select: { tags: true },
  })
  const tags = Array.from(new Set(all.flatMap((p) => p.tags))).sort()

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            Case studies with story + photo details.
          </p>
        </div>

        <form className="flex w-full gap-2 sm:w-auto" action="/projects" method="get">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search projects…"
            className="w-full rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(var(--accent),0.35)] sm:w-72"
          />
          <button className="rounded-full bg-[rgb(var(--fg))] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            Search
          </button>
        </form>
      </div>

      {tags.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/projects"
            className={`rounded-full border px-3 py-1 text-xs ${
              !tag ? "border-[rgb(var(--fg))] text-[rgb(var(--fg))]" : "border-[rgb(var(--border))] text-[rgb(var(--muted))]"
            }`}
          >
            All
          </Link>
          {tags.map((t) => (
            <Link
              key={t}
              href={`/projects?tag=${encodeURIComponent(t)}`}
              className={`rounded-full border px-3 py-1 text-xs ${
                tag === t ? "border-[rgb(var(--fg))] text-[rgb(var(--fg))]" : "border-[rgb(var(--border))] text-[rgb(var(--muted))]"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p as any} />
        ))}
      </div>
    </Container>
  )
}
