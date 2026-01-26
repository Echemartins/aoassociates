export const dynamic = "force-dynamic"
export const revalidate = 0

import Link from "next/link"
import { Container } from "@/src/components/Container"
import { prisma } from "@/src/lib/prisma"
import { ProjectCard } from "@/src/components/ProjectCard"
import { ProjectsGridWithOverlay } from "@/src/components/projects/ProjectsGridWithOverlay"

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
    orderBy: [{ sortOrder: "asc" }, { year: "desc" }, { title: "asc" }],
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
        <div className="flex flex-col gap-1">
          <BackPill />

          <div>
            <h1 className="text-4xl font-medium tracking-tight text-green-800 sm:text-6xl">
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
            className="w-full rounded-full border border-green-800 bg-white px-5 py-1.5 text-base font-medium text-[rgb(var(--fg))] outline-none placeholder:text-green-800 focus:ring-2 focus:ring-[rgba(var(--accent),0.35)] sm:w-80"
          />
          <button className="rounded-full bg-green-800 px-5 py-1.5 text-base font-semibold text-white hover:opacity-90">
            Search
          </button>
        </form>
      </div>

      <ProjectsGridWithOverlay projects={projects as any} />

    </Container>
  )
}
