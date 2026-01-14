import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/src/lib/prisma"
import { requireAdmin } from "@/src/lib/admin"

export const runtime = "nodejs"

function Pill({ children, tone }: { children: React.ReactNode; tone: "green" | "gray" }) {
  const cls =
    tone === "green"
      ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent-soft))] text-[rgb(var(--accent))]"
      : "border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--muted))]"
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>
      {children}
    </span>
  )
}

function formatDate(d?: Date | string | null) {
  if (!d) return "—"
  const dt = typeof d === "string" ? new Date(d) : d
  return dt.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })
}

export default async function AdminProjectOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params

  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: { select: { id: true } } },
  })

  if (!project) return notFound()

  const publicPath = `/projects/${project.slug}`

  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl font-semibold">{project.title}</h1>
            <Pill tone={project.status === "PUBLISHED" ? "green" : "gray"}>
              {project.status === "PUBLISHED" ? "Published" : "Draft"}
            </Pill>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[rgb(var(--muted))]">
            <div>
              Slug: <span className="font-mono text-[rgb(var(--fg))]">{project.slug}</span>
            </div>
            <div>
              Public:{" "}
              <Link
                href={publicPath}
                className="font-mono text-[rgb(var(--accent))] hover:underline"
                target="_blank"
              >
                {publicPath}
              </Link>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/projects/${project.id}/edit`}
            className="rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--accent))] transition-colors hover:bg-[rgb(var(--accent))] hover:text-white"
          >
            Edit
          </Link>

          <Link
            href={publicPath}
            target="_blank"
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-medium text-[rgb(var(--fg))] transition-colors hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-soft))] hover:text-[rgb(var(--accent))]"
          >
            View Public
          </Link>

          <Link
            href="/admin/projects"
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-medium text-[rgb(var(--fg))] transition-colors hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-soft))] hover:text-[rgb(var(--accent))]"
          >
            Back
          </Link>
        </div>
      </div>

      {/* Overview grid */}
      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        {/* Left: metadata */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-5">
            <div className="text-sm font-semibold">Overview</div>

            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <Meta label="Location" value={project.location} />
              <Meta label="Year" value={project.year?.toString()} />
              <Meta label="Typology" value={project.typology} />
              <Meta label="Client" value={project.client} />
              <Meta label="Services" value={project.services} />
              <Meta label="Sustainability" value={project.sustainability} />
              <Meta label="Tags" value={(project.tags || []).join(", ") || "—"} span />
              <Meta label="Images" value={`${project.images?.length ?? 0}`} />
            </dl>

            {project.summary ? (
              <div className="mt-5 rounded-xl bg-[rgb(var(--card))] p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                  Summary
                </div>
                <p className="mt-2 text-sm text-[rgb(var(--fg))]">{project.summary}</p>
              </div>
            ) : null}
          </div>

          {project.body ? (
            <div className="mt-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-5">
              <div className="text-sm font-semibold">Story (Markdown)</div>
              <div className="mt-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
                <pre className="whitespace-pre-wrap break-words text-xs text-[rgb(var(--fg))]">
                  {project.body}
                </pre>
              </div>
            </div>
          ) : null}
        </div>

        {/* Right: timestamps + quick links */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
            <div className="text-sm font-semibold">Timestamps</div>
            <div className="mt-3 grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[rgb(var(--muted))]">Created</span>
                <span className="text-right text-[rgb(var(--fg))]">{formatDate(project.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[rgb(var(--muted))]">Updated</span>
                <span className="text-right text-[rgb(var(--fg))]">{formatDate(project.updatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-5">
            <div className="text-sm font-semibold">Quick Links</div>
            <div className="mt-3 grid gap-2">
              <QuickLink href={`/admin/projects/${project.id}/edit`} label="Edit project" />
              <QuickLink href={publicPath} label="Open public project page" newTab />
              <QuickLink href="/admin/projects" label="Back to all projects" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Meta({ label, value, span }: { label: string; value?: string | null; span?: boolean }) {
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">{label}</dt>
      <dd className="mt-1 text-sm text-[rgb(var(--fg))]">{value && value.trim() ? value : "—"}</dd>
    </div>
  )
}

function QuickLink({ href, label, newTab }: { href: string; label: string; newTab?: boolean }) {
  return (
    <Link
      href={href}
      target={newTab ? "_blank" : undefined}
      className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-medium text-[rgb(var(--fg))] transition-colors hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-soft))] hover:text-[rgb(var(--accent))]"
    >
      {label}
    </Link>
  )
}
