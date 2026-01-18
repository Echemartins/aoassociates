// export const dynamic = "force-dynamic"
// import { notFound } from "next/navigation"
// import { Container } from "@/src/components/Container"
// import { prisma } from "@/src/lib/prisma"
// import { Markdown } from "@/src/components/Markdown"

// export const revalidate = 60

// export default async function ArchiveDetailPage({ params }: { params: { slug: string } }) {
//   const post = await prisma.post.findUnique({ where: { slug: params.slug } })
//   if (!post || post.status !== "PUBLISHED") return notFound()

//   return (
//     <Container className="py-10">
//       <div className="max-w-3xl">
//         <div className="text-sm text-[rgb(var(--muted))]">
//           {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "—"}
//           {post.category ? ` • ${post.category}` : ""}
//         </div>
//         <h1 className="mt-2 text-3xl font-semibold tracking-tight">{post.title}</h1>
//         {post.excerpt ? <p className="mt-3 text-[rgb(var(--muted))]">{post.excerpt}</p> : null}
//         <div className="mt-8">{post.body ? <Markdown content={post.body} /> : null}</div>
//       </div>
//     </Container>
//   )
// }

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

import { notFound, redirect } from "next/navigation"
import { Container } from "@/src/components/Container"
import { prisma } from "@/src/lib/prisma"
import { Markdown } from "@/src/components/Markdown"
import { ProjectGallery } from "@/src/components/ProjectGallery"
import { toSlug } from "@/src/lib/slug"

export default async function ArchiveDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug: slugParam } = await params
  const raw = decodeURIComponent(slugParam || "").trim()
  if (!raw) return notFound()

  const normalized = toSlug(raw).toLowerCase()
  const candidates = Array.from(new Set([raw, normalized])).filter(Boolean)

  let archive: any = null
  let matchedSlug: string | null = null

  for (const s of candidates) {
    const found = await prisma.archiveProject.findUnique({
      where: { slug: s },
      include: { images: { orderBy: { order: "asc" } } },
    })
    if (found) {
      archive = found
      matchedSlug = s
      break
    }
  }

  if (!archive || archive.status !== "PUBLISHED") return notFound()

  if (matchedSlug && archive.slug && matchedSlug !== archive.slug) {
    redirect(`/archives/${encodeURIComponent(archive.slug)}`)
  }

  return (
    <Container className="py-10">
      {/* Gallery first */}
      {archive.images?.length ? (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{archive.title}</h1>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            {archive.location || "—"}
          </p>

          <div className="mt-5">
            <ProjectGallery images={archive.images as any} />
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{archive.title}</h1>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            {archive.location || "—"}
          </p>
        </div>
      )}

      {/* Metadata (not in aside/card) */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Meta label="Intervention Type" value={archive.interventionType} />
        <Meta label="Intervention Year" value={archive.interventionYear?.toString()} />
        <Meta label="Original Year" value={archive.originalYear?.toString()} />
        <Meta label="Typology" value={archive.typology} />
        <Meta label="Scope" value={archive.scope} />
        <Meta label="Sustainability" value={archive.sustainability} />
      </div>

      {archive.tags?.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {archive.tags.map((t: string) => (
            <span
              key={t}
              className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1 text-xs text-[rgb(var(--muted))]"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {/* Narrative with softer typography */}
      <div className="mt-10 max-w-3xl">
        <div className="text-sm leading-relaxed text-[rgb(var(--muted))]">
          {archive.body ? <Markdown content={archive.body} /> : null}
        </div>
      </div>
    </Container>
  )
}

function Meta({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">{label}</div>
      <div className="mt-2 text-sm text-[rgb(var(--fg))]">{value || "—"}</div>
    </div>
  )
}

