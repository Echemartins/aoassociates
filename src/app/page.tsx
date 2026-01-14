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
      {/* HERO */}
      <section className="border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]">
        <Container className="py-1 sm:py-3">
          {/* Hero Image (with overlay content INSIDE) */}
          <div className="relative overflow-hidden rounded-sm border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm">
            <div className="relative aspect-[18/10] w-full md:aspect-[28/10]">
              <Image
                src="/images/hero.png"
                alt="AO + Associates hero image"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />

              {/* NetZero logo (top-right inside hero) */}
              <div className="absolute right-3 top-3">
                <div className="">
                  <Image
                    src="/images/netzero.png"
                    alt="NetZero"
                    width={92}
                    height={92}
                    className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                  />
                </div>
              </div>

              {/* Readability gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Centered overlay content (badges left/right of title) */}
              <div className="absolute bottom-0 left-3 right-3 sm:bottom-0 sm:left-5 sm:right-5">
                <div className="mx-auto max-w-4xl p-3 sm:p-4">
                  <div className="flex items-center justify-center gap-2 sm:gap-6">
                    {/* Left badge */}
                    <HeroBadgeImg src="/images/badges/logo1.webp" alt="MWBE Certified" />

                    {/* Center title + tagline */}
                    <div className="text-center">
                      <div className="text-base font-semibold tracking-tight text-white/60 sm:text-2xl">
                        AO + Associates Inc.
                      </div>
                      <div className="mt-1 text-[11px] leading-snug text-white/40 sm:text-sm">
                        Environmentally responsible, resource-efficient, green &amp; net-zero architecture.
                      </div>
                    </div>

                    {/* Right badge */}
                    <HeroBadgeImg src="/images/badges/logo2.jpg" alt="DBE Certified" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content below hero image */}
          <div className="grid gap-4">
            <div className=" bg-[rgb(var(--bg))] p-6">

              {/* Office + Sustainability */}
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="flex flex-col gap-4 rounded-xl bg-[rgb(var(--card))] p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                    Office
                  </div>
                  <div className="mt-2 text-sm text-[rgb(var(--muted))]">
                    1270 Av. of The Americas
                    <br />
                    7th Floor, #1154
                    <br />
                    New York, NY 10020
                  </div>

                  <p className="text-gray-600">Environmentally responsible, Resource Efficient, Green &amp; Net-Zero Architecture.</p>
                </div>

                <div className="rounded-xl bg-[rgb(var(--card))] p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                    Sustainability focus
                  </div>
                  <ul className="mt-2 grid gap-2 text-sm text-[rgb(var(--muted))]">
                    <li>• Renewable clean energy sources</li>
                    <li>• Energy efficiency</li>
                    <li>• Rainwater harvest, recycle &amp; reuse</li>
                    <li>• Site sensitivity &amp; adaptation</li>
                    <li>• Indoor environmental quality</li>
                    <li>• Waste reduction &amp; recycling</li>
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
                  className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-5 py-2.5 text-sm font-medium hover:bg-[rgb(var(--card))]"
                >
                  Read Archives
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-5 py-2.5 text-sm font-medium hover:bg-[rgb(var(--card))]"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Projects */}
      <section className="bg-[rgb(var(--bg))]">
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

function HeroBadgeImg({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="shadow-sm">
      <Image
        src={src}
        alt={alt}
        width={88}
        height={32}
        className="h-6 w-auto object-contain sm:h-7"
      />
    </span>
  )
}
