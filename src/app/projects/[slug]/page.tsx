// export const runtime = "nodejs"
// export const dynamic = "force-dynamic"
// export const revalidate = 0

// import { notFound, redirect } from "next/navigation"
// import { Container } from "@/src/components/Container"
// import { prisma } from "@/src/lib/prisma"
// import { Markdown } from "@/src/components/Markdown"
// import { ProjectGallery } from "@/src/components/ProjectGallery"
// import { toSlug } from "@/src/lib/slug"

// export default async function ProjectDetailPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>
// }) {
//   const { slug: slugParam } = await params

//   const raw = decodeURIComponent(slugParam || "").trim()
//   if (!raw) return notFound()

//   const normalized = toSlug(raw).toLowerCase()
//   const candidates = Array.from(new Set([raw, normalized])).filter(Boolean)

//   let project: any = null
//   let matchedSlug: string | null = null

//   for (const s of candidates) {
//     const found = await prisma.project.findUnique({
//       where: { slug: s },
//       include: { images: { orderBy: { order: "asc" } } },
//     })
//     if (found) {
//       project = found
//       matchedSlug = s
//       break
//     }
//   }

//   if (!project || project.status !== "PUBLISHED") return notFound()

//   if (matchedSlug && project.slug && matchedSlug !== project.slug) {
//     redirect(`/projects/${encodeURIComponent(project.slug)}`)
//   }

//   return (
//     <Container className="py-5">
//       {/* Header */}
//       <div className="max-w-4xl">
//         <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{project.title}</h1>

//         {project.tags?.length ? (
//           <div className="mt-4 flex flex-wrap gap-2">
//             {project.tags.map((t: string) => (
//               <span
//                 key={t}
//                 className="rounded bg-[rgb(var(--card))] shadow-sm px-3 py-1 text-xs text-green-600"
//               >
//                 {t}
//               </span>
//             ))}
//           </div>
//         ) : null}
//         {/* Location + Year (same line) */}
//         <div className="mt-3 flex flex-wrap items-center text-yellow-600 font-medium gap-x-5 gap-y-2 text-sm text-[rgb(var(--muted))]">
//           {project.location ? <span> {project.location}</span> : null}
//           {project.year ? <span>• {project.year}</span> : null}
//         </div>

//         {/* Typology (separate line) */}
//         {project.typology ? (
//           <div className="mt-3 text-xs font-medium text-[rgb(var(--muted))]">
//             {/* <span className="font-medium text-[rgb(var(--fg))]">Typology:</span>{" "} */}
//             <span>{project.typology}</span>
//           </div>
//         ) : null}

//         {/* Tags */}
//       </div>

//       {/* GALLERY FIRST */}
//       {project.images?.length ? (
//         <section className="mt-8">
//           <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <h2 className="text-xl font-semibold">Gallery</h2>
//               <p className="mt-1 text-xs text-[rgb(var(--muted))]">
//                 Click any image to view details (caption, credit, notes). Use arrows to navigate gallery.
//               </p>
//             </div>
//           </div>

//           <div className="mt-5">
//             <ProjectGallery images={project.images as any} />
//           </div>
//         </section>
//       ) : null}

//       {/* Body + Info (no aside, no card) */}
//       <section className="mt-10 grid gap-10 lg:grid-cols-12">
//         {/* Story */}
//         <div className="lg:col-span-8">
//           {project.body ? <Markdown content={project.body} /> : null}
//         </div>

//         {/* Info (simple, not a card) */}
//         <div className="lg:col-span-4">
//           <div className="border-l-0 border-t border-[rgb(var(--border))] pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
//             <div className="text-sm font-semibold">Project Info</div>

//             <dl className="mt-4 grid gap-4 text-sm">
//               <div>
//                 <dt className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
//                   Services
//                 </dt>
//                 <dd className="mt-1 text-[rgb(var(--fg))]">{project.services || "—"}</dd>
//               </div>

//               <div>
//                 <dt className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
//                   Sustainability
//                 </dt>
//                 <dd className="mt-1 text-[rgb(var(--fg))]">{project.sustainability || "—"}</dd>
//               </div>

//               <div>
//                 <dt className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
//                   Client
//                 </dt>
//                 <dd className="mt-1 text-[rgb(var(--fg))]">{project.client || "—"}</dd>
//               </div>
//             </dl>
//           </div>
//         </div>
//       </section>
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
import { toSlug } from "@/src/lib/slug"
import { ProjectHeroGallery } from "@/src/components/ProjectHeroGallery"
import BackPill from "@/src/components/BackPill"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug: slugParam } = await params

  const raw = decodeURIComponent(slugParam || "").trim()
  if (!raw) return notFound()

  const normalized = toSlug(raw).toLowerCase()
  const candidates = Array.from(new Set([raw, normalized])).filter(Boolean)

  let project: any = null
  let matchedSlug: string | null = null

  for (const s of candidates) {
    const found = await prisma.project.findUnique({
      where: { slug: s },
      include: { images: { orderBy: { order: "asc" } } },
    })
    if (found) {
      project = found
      matchedSlug = s
      break
    }
  }

  if (!project || project.status !== "PUBLISHED") return notFound()

  if (matchedSlug && project.slug && matchedSlug !== project.slug) {
    redirect(`/projects/${encodeURIComponent(project.slug)}`)
  }

  return (
    <Container className="py-2 relative">
        <BackPill />

      {/* HERO IMAGE + THUMBNAILS + DETAILS OVERLAY */}
      {project.images?.length ? <ProjectHeroGallery images={project.images as any} /> : null}

      <div className="max-w-4xl mt-8">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{project.title}</h1>

        {project.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((t: string) => (
              <span
                key={t}
                className="text-xl text-green-600"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {/* Location + Year */}
        <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2 text-xl font-medium text-yellow-600">
          {project.location ? <span>{project.location}</span> : null}
          {project.year ? <span>• {project.year}</span> : null}
        </div>

        {/* Typology (separate line) */}
        {project.typology ? (
          <div className="mt-3 text-xl font-medium text-[rgb(var(--muted))]">
            <span>{project.typology}</span>
          </div>
        ) : null}
      </div>

      {/* Body + Info */}
      <section className="mt-10 grid gap-8 font-sm lg:grid-cols-12">
        <div className="lg:col-span-8">{project.body ? <Markdown content={project.body} /> : null}</div>

        <div className="lg:col-span-4">
          <div className="border-l-0 border-t border-[rgb(var(--border))] pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div className="text-2xl font-semibold">Project Info</div>

            <dl className="mt-4 grid gap-4 text-lg">
              <div>
                <dt className="text-xl font-semibold uppercase tracking-wide text-[rgb(var(--fg))]">
                  Services
                </dt>
                <dd className="mt-1 text-gray-700">{project.services || "—"}</dd>
              </div>

              <div>
                <dt className="text-xl font-semibold uppercase tracking-wide text-[rgb(var(--fg))]">
                  Sustainability
                </dt>
                <dd className="mt-1 text-gray-700">{project.sustainability || "—"}</dd>
              </div>

              <div>
                <dt className="text-xl font-semibold uppercase tracking-wide text-[rgb(var(--fg))]">
                  Client
                </dt>
                <dd className="mt-1 text-gray-700">{project.client || "—"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </Container>
  )
}

