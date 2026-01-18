export const dynamic = "force-dynamic"
export const revalidate = 0

import Link from "next/link"
import { Container } from "@/src/components/Container"
import { prisma } from "@/src/lib/prisma"
import { ProjectCard } from "@/src/components/ProjectCard"
import BackPill from "@/src/components/BackPill"

type SP = Record<string, string | string[] | undefined>

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] ?? "" : v ?? ""
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?: Promise<SP>
}) {
  const sp = searchParams ? await searchParams : {}
  const q = first(sp.q).trim()
  const tag = first(sp.tag).trim()

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

  const all = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    select: { tags: true },
  })
  const tags = Array.from(new Set(all.flatMap((p) => p.tags))).sort()

  return (
    <Container className="py-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <BackPill />

          <div>
            <h1 className="text-4xl font-medium tracking-tight text-gray-800 sm:text-6xl">
              Projects
            </h1>
            {/* <p className="mt-1 text-base font-semibold text-[rgba(var(--fg),0.72)]">
              Browse completed work. Filter by category or search by keyword.
            </p> */}
          </div>
        </div>

        <form className="flex w-full gap-2 sm:w-auto" action="/projects" method="get">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search projects…"
            className="w-full rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-base font-medium text-[rgb(var(--fg))] outline-none placeholder:text-[rgba(var(--fg),0.45)] focus:ring-2 focus:ring-[rgba(var(--accent),0.35)] sm:w-80"
          />
          <button className="rounded-full bg-[rgb(var(--fg))] px-5 py-2.5 text-base font-semibold text-white hover:opacity-90">
            Search
          </button>
        </form>
      </div>

      {tags.length ? (
        <>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/projects"
              className={` px-3 py- text-2xl font-semibold ${
                !tag
                  ? "border-b border-b-[3px] border-[rgb(var(--fg))] bg-[rgba(var(--fg),0.04)] text-[rgb(var(--fg))]"
                  : "border-[rgb(var(--border))] bg-white text-[rgba(var(--fg),0.72)] hover:bg-[rgba(var(--accent),0.06)]"
              }`}
            >
              All
            </Link>

            {tags.map((t) => (
              <Link
                key={t}
                href={`/projects?tag=${encodeURIComponent(t)}`}
                className={` px-3 py- text-2xl font-semibold transition-colors ${
                  tag === t
                    ? "border-[rgb(var(--accent))] bg-[rgba(var(--accent),0.10)] text-[rgb(var(--fg))]"
                    : "border-[rgb(var(--border))] bg-white text-[rgba(var(--fg),0.72)] hover:border-[rgba(var(--accent),0.55)] hover:bg-[rgba(var(--accent),0.06)]"
                }`}
              >
                {t}
              </Link>
            ))}
          </div>

          {/* <p className="mt-3 text-sm font-semibold text-[rgba(var(--fg),0.70)]">
            Tip: Select a category to refine the list.
          </p> */}
        </>
      ) : null}

      {/* <div className="mt-6 text-sm font-semibold text-[rgba(var(--fg),0.70)]">
        Showing <span className="text-[rgb(var(--fg))]">{projects.length}</span> project
        {projects.length === 1 ? "" : "s"}
        {tag ? (
          <>
            {" "}
            in <span className="text-[rgb(var(--fg))]">{tag}</span>
          </>
        ) : null}
        {q ? (
          <>
            {" "}
            for <span className="text-[rgb(var(--fg))]">“{q}”</span>
          </>
        ) : null}
        .
      </div> */}

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p as any} />
        ))}
      </div>
    </Container>
  )
}
