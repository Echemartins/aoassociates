// export const dynamic = "force-dynamic"


// import { Container } from "@/src/components/Container"
// import { prisma } from "@/src/lib/prisma"
// import { PostCard } from "@/src/components/PostCard"

// export const revalidate = 60

// export default async function ArchivesPage() {
//   const posts = await prisma.post.findMany({
//     where: { status: "PUBLISHED" },
//     orderBy: { publishedAt: "desc" },
//   })

//   return (
//     <Container className="py-10">
//       <h1 className="text-2xl font-semibold">Archives</h1>
//       <p className="mt-1 text-sm text-[rgb(var(--muted))]">
//         Notes, research, net-zero strategy, and behind-the-scenes decisions.
//       </p>

//       <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//         {posts.map((p) => (
//           <PostCard key={p.id} post={p as any} />
//         ))}
//       </div>
//     </Container>
//   )
// }

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import Link from "next/link"
import { Container } from "@/src/components/Container"
import { prisma } from "@/src/lib/prisma"
import { ArchiveCard } from "@/src/components/ArchiveCard"

export default async function ArchivesPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; tag?: string }>
}) {
  const sp = (await searchParams) || {}
  const q = (sp.q || "").trim()
  const tag = (sp.tag || "").trim()

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

  const all = await prisma.archiveProject.findMany({
    where: { status: "PUBLISHED" },
    select: { tags: true },
  })
  const tags = Array.from(new Set(all.flatMap((p) => p.tags))).sort()

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Archives</h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            Legacy work: renovations, reconstructions, adaptive reuse, and historical projects.
          </p>
        </div>

        <form className="flex w-full gap-2 sm:w-auto" action="/archives" method="get">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search archives…"
            className="w-full rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(var(--accent),0.35)] sm:w-72"
          />
          <button className="rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))] hover:text-white transition-colors">
            Search
          </button>
        </form>
      </div>

      {tags.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/archives"
            className={`rounded-full border px-4 py-1 text-xs ${
              !tag
                ? "border-[rgb(var(--accent))] text-[rgb(var(--accent))] bg-[rgb(var(--accent-soft))]"
                : "border-[rgb(var(--border))] text-[rgb(var(--muted))]"
            }`}
          >
            All
          </Link>
          {tags.map((t) => (
            <Link
              key={t}
              href={`/archives?tag=${encodeURIComponent(t)}`}
              className={`rounded-full border px-3 py-1 text-xs ${
                tag === t
                  ? "border-[rgb(var(--accent))] text-[rgb(var(--accent))] bg-[rgb(var(--accent-soft))]"
                  : "border-[rgb(var(--border))] text-[rgb(var(--muted))]"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {archives.map((a) => (
          <ArchiveCard key={a.id} archive={a as any} />
        ))}
      </div>
    </Container>
  )
}

