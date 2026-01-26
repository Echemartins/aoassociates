export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

import Link from "next/link"
import { Container } from "@/src/components/Container"
import { prisma } from "@/src/lib/prisma"
import BackPill from "@/src/components/BackPill"
import { ArchivesGridWithOverlay } from "@/src/components/archives/ArchivesGridWithOverlay"

type SP = Record<string, string | string[] | undefined>
function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] ?? "" : v ?? ""
}

export default async function ArchivesPage({
  searchParams,
}: {
  searchParams?: Promise<SP>
}) {
  const sp = searchParams ? await searchParams : {}
  const q = first(sp.q).trim()
  const tag = first(sp.tag).trim()

  const archives = await prisma.archiveProject.findMany({
    where: {
      status: "PUBLISHED",
      AND: [
        q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { summary: { contains: q, mode: "insensitive" } },
                { location: { contains: q, mode: "insensitive" } },
                { interventionType: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        tag ? { tags: { has: tag } } : {},
      ],
    },
    orderBy: [{ interventionYear: "desc" }, { title: "asc" }],
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  })

  // tags
  const all = await prisma.archiveProject.findMany({
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
              Archives
            </h1>
            {/* Optional subtitle like Projects (kept commented in your Projects page) */}
            {/* <p className="mt-1 text-base font-semibold text-[rgba(var(--fg),0.72)]">
              Legacy work: renovations, adaptive reuse, and historical projects.
            </p> */}
          </div>
        </div>

        <form className="flex w-full gap-2 sm:w-auto" action="/archives" method="get">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search archives…"
            className="w-full rounded-full border border-green-800 bg-white px-5 py-1.5 text-base font-medium text-[rgb(var(--fg))] outline-none placeholder:text-green-800 focus:ring-2 focus:ring-[rgba(var(--accent),0.35)] sm:w-80"
          />
          <button className="rounded-full bg-green-800 px-5 py-1.5 text-base font-semibold text-white hover:opacity-90">
            Search
          </button>
        </form>
      </div>

      {/* Tag pills (kept, but styled to match the Projects vibe) */}
      {/* {tags.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/archives"
            className={[
              "rounded-full border px-4 py-1 text-xs font-semibold",
              !tag
                ? "border-green-800 text-green-800 bg-white"
                : "border-[rgb(var(--border))] text-[rgb(var(--muted))] bg-[rgb(var(--bg))]",
            ].join(" ")}
          >
            All
          </Link>

          {tags.map((t) => (
            <Link
              key={t}
              href={`/archives?tag=${encodeURIComponent(t)}`}
              className={[
                "rounded-full border px-3 py-1 text-xs font-semibold",
                tag === t
                  ? "border-green-800 text-green-800 bg-white"
                  : "border-[rgb(var(--border))] text-[rgb(var(--muted))] bg-[rgb(var(--bg))]",
              ].join(" ")}
            >
              {t}
            </Link>
          ))}
        </div>
      ) : null} */}

      <ArchivesGridWithOverlay archives={archives as any} />
    </Container>
  )
}
