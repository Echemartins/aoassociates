import Link from "next/link"
import Image from "next/image"
import { Container } from "@/src/components/Container"
import { prisma } from "@/src/lib/prisma"
import { ProjectCard } from "@/src/components/ProjectCard"
import { PostCard } from "@/src/components/PostCard"

export const revalidate = 60

export default async function HomePage() {
  const [projects, posts] = await Promise.all([
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { year: "desc" },
      take: 6,
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
    }),
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ])

  return (
    <div>
      {/* HERO (image first; content always below on all screens) */}
      <section className="border-b border-[rgb(var(--border))] bg-white">
        <Container className="py-10 sm:py-14">
          {/* Image */}
          <div className="relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src="/images/hero.png"
                alt="AO + Associates hero image"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Caption */}
          <p className="mt-3 text-xs text-[rgb(var(--muted))]">
            Environmentally responsible, resource-efficient, green & net-zero architecture.
          </p>

          {/* Content (always under image) */}
          <div className="mt-6 grid gap-4">
            {/* Title + badges */}
            <div className="rounded-2xl border border-[rgb(var(--border))] bg-white p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    AO + Associates Inc.
                  </h1>
                  <p className="mt-2 text-sm text-[rgb(var(--muted))]">
                    Green Architecture & Planning — project storytelling, curated galleries, and searchable archives.
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <BadgeImg src="/images/badges/logo1.webp" alt="MWBE Certified" />
                  <BadgeImg src="/images/badges/logo2.jpg" alt="DBE Certified" />
                </div>
              </div>

              {/* Address + Sustainability (side-by-side on large, stacked on mobile) */}
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {/* Office */}
                <div className="rounded-xl bg-[rgb(var(--card))] p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                    Office
                  </div>
                  <div className="mt-2 text-sm">
                    1270 Av. of The Americas
                    <br />
                    7th Floor, #1154
                    <br />
                    New York, NY 10020
                  </div>
                </div>

                {/* Sustainability */}
                <div className="rounded-xl bg-[rgb(var(--card))] p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                    Sustainability focus
                  </div>
                  <ul className="mt-2 grid gap-2 text-sm text-[rgb(var(--muted))]">
                    <li>• Renewable clean energy integration</li>
                    <li>• Energy efficiency + performance upgrades</li>
                    <li>• Rainwater harvest, recycle &amp; reuse</li>
                    <li>• Site sensitivity &amp; adaptation</li>
                    <li>• Indoor environmental quality</li>
                    <li>• Waste reduction &amp; recycling strategies</li>
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="rounded-full bg-[rgb(var(--fg))] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
                >
                  View Projects
                </Link>
                <Link
                  href="/archives"
                  className="rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-sm font-medium hover:bg-[rgb(var(--card))]"
                >
                  Read Archives
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-sm font-medium hover:bg-[rgb(var(--card))]"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* What you'll find here */}
            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
              <div className="text-sm font-semibold">What you’ll find here</div>
              <ul className="mt-3 grid gap-2 text-sm text-[rgb(var(--muted))]">
                <li>• Project story (context → decisions → results)</li>
                <li>• Details per photo (caption, credit, notes)</li>
                <li>• Archives with structured topics &amp; tags</li>
                <li>• Mobile-first, fast, and searchable</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Projects */}
      <section>
        <Container className="py-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold">Featured Projects</h2>
            <Link href="/projects" className="text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]">
              View all →
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p as any} />
            ))}
          </div>
        </Container>
      </section>

      {/* Latest Archives */}
      <section className="border-t border-[rgb(var(--border))] bg-[rgb(var(--card))]">
        <Container className="py-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold">Latest Archives</h2>
            <Link href="/archives" className="text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]">
              View all →
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post as any} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}

function BadgeImg({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-white px-2 py-1">
      <Image src={src} alt={alt} width={80} height={28} className="h-6 w-auto object-contain" />
    </span>
  )
}
