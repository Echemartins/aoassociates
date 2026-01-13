import { notFound } from "next/navigation"
import { Container } from "@/src/components/Container"
import { prisma } from "@/src/lib/prisma"
import { Markdown } from "@/src/components/Markdown"
import { ProjectGallery } from "@/src/components/ProjectGallery"

export const revalidate = 60

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: { images: { orderBy: { order: "asc" } } },
  })

  if (!project || project.status !== "PUBLISHED") return notFound()

  return (
    <Container className="py-10">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[rgb(var(--muted))]">
          {project.location ? <span>{project.location}</span> : null}
          {project.year ? <span>• {project.year}</span> : null}
          {project.typology ? <span>• {project.typology}</span> : null}
        </div>

        {project.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[rgb(var(--border))] bg-white px-3 py-1 text-xs text-[rgb(var(--muted))]"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {project.body ? <Markdown content={project.body} /> : null}
        </div>

        <aside className="lg:col-span-4">
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
            <div className="text-sm font-semibold">Project Info</div>
            <dl className="mt-3 grid gap-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--fg))]">Services</dt>
                <dd className="text-[rgb(var(--muted))]">{project.services || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--fg))]">Sustainability</dt>
                <dd className="text-[rgb(var(--muted))]">{project.sustainability || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--fg))]">Client</dt>
                <dd className="text-[rgb(var(--muted))]">{project.client || "—"}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      {project.images.length ? (
        <div className="mt-12">
          <h2 className="text-xl font-semibold">Gallery</h2>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            Click any image to view details (caption, credit, notes).
          </p>
          <div className="mt-5">
            <ProjectGallery images={project.images as any} />
          </div>
        </div>
      ) : null}
    </Container>
  )
}
