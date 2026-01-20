export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import Link from "next/link"
import Image from "next/image"
import { Container } from "@/src/components/Container"
import { prisma } from "@/src/lib/prisma"
import { ProjectCard } from "@/src/components/ProjectCard"
import { ArchiveCard } from "@/src/components/ArchiveCard"

export const revalidate = 60

export default async function HomePage() {
  const [projects, archives] = await Promise.all([
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { year: "desc" },
      take: 6,
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
    }),
    prisma.archiveProject.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ interventionYear: "desc" }, { updatedAt: "desc" }],
      take: 3,
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
    }),
  ])

  return (
    <div>
      {/* HERO */}
      <section className="border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]">
        <Container className="py-1 sm:py-3">
          <div className="relative overflow-hidden rounded-sm border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm">
            <div className="relative aspect-[12/10] w-full md:aspect-[28/10]">
              <Image
                src="/images/hero.png"
                alt="AO + Associates hero image"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />

              {/* NetZero logo */}
              <div className="absolute right-3 top-3">
                <Image
                  src="/images/netzero.png"
                  alt="NetZero"
                  width={92}
                  height={92}
                  className="h-16 w-16 object-contain sm:h-30 sm:w-30"
                />
              </div>

              {/* Readability gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

              {/* Centered overlay content */}
              <div className="absolute bottom-0 left-3 right-3 sm:left-5 sm:right-5">
                <div className="mx-auto max-w-5xl p-3 sm:p-4">
                  <div className="flex items-center justify-center gap-2 sm:gap-6">
                    <HeroBadgeImg src="/images/badges/logo1.webp" alt="MWBE Certified" />

                    <div className="text-center">
                      <div className="text-base font-semibold tracking-tight text-white sm:text-3xl">
                        AO + Associates Inc.
                      </div>
                      <div className="mt-1 text-[11px] leading-snug text-white/90 sm:text-xl">
                        Environmentally responsible, resource-efficient, green &amp; net-zero architecture.
                      </div>

                      {/* green cue under title */}
                      {/* <div className="mt-2 flex justify-center">
                        <span className="h-[3px] w-24 rounded-full bg-green-800" />
                      </div> */}
                    </div>

                    <HeroBadgeImg src="/images/badges/logo2.png" alt="DBE Certified" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content below hero */}
          <div className="grid gap-4">
            <div className="bg-[rgb(var(--bg))] p-6">
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Office */}
                <div className="flex md:text-right flex-col gap-4 rounded-xl bg-[rgb(var(--card))] p-5">
                  <div className="flex items-center gap-3 md:justify-end">
                    {/* <span className="h-8 w-1.5 rounded-full bg-green-800" /> */}
                    <div className="text-4xl font-bold uppercase tracking-wide text-green-800">
                      Office
                    </div>
                  </div>

                  <div className="text-2xl lg:text-3xl font-semibold text-gray-800">
                    1270 Av. of The Americas
                    <br />
                    7th Floor, #1154
                    <br />
                    New York, NY 10020
                  </div>

                  <p className="text-xl mt-6 font-medium text-green-800">
                    Environmentally responsible, resource efficient, green &amp; net-zero architecture.
                  </p>
                </div>

                {/* Sustainability */}
                <div className="rounded-xl bg-[rgb(var(--card))] p-5">
                  <div className="flex items-center gap-3">
                    {/* <span className="h-8 w-1.5 rounded-full bg-green-800" /> */}
                    <div className="text-4xl font-bold uppercase tracking-wide text-green-800">
                    Sustainability focus
                    </div>
                  </div>

                  <ul className="mt-4 grid gap-3 text-2xl font-medium text-[rgb(var(--fg))]">
                    {[
                      "Renewable clean energy sources",
                      "Energy efficiency",
                      "Rainwater harvest, recycle & reuse",
                      "Site sensitivity & adaptation",
                      "Indoor environmental quality",
                      "Waste reduction & recycling",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 text-green-800">•</span>
                        <span className="text-gray-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Walkthrough Video */}
      <section className="border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]">
        <Container className="py-10">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                
                <p className="text-2xl font-semibold text-[rgb(var(--fg))]">
                  A quick tour of our sustainability-first approach and recent work.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center py-1 text-xl font-semibold text-green-800">
                  1-minute walkthrough
                </span>
            <div className="mt-1 overflow-hidden rounded-[7px] border border-[rgb(var(--border))] bg-black shadow-sm">
              <video
                className="w-full max-h-[520px] object-cover"
                controls
                playsInline
                preload="metadata"
                poster="/images/mirage/mirage2.jpg"
              >
                <source
                  src="/videos/aoassociates-walkthrough-cinematic-60s-compressed-60s.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            
          </div>
        </Container>
      </section>

      {/* Featured Projects */}
      <section className="bg-[rgb(var(--bg))]">
        <Container className="py-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl lg:text-5xl font-medium text-green-800">
              Featured Projects
            </h2>

            <Link
              href="/projects"
              className="text-2xl border border-green-800 px-4 rounded-full font-semibold text-green-800 hover:opacity-80"
            >
              View all →
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
            <h2 className="text-3xl lg:text-5xl font-medium text-green-800">
              Latest Archives
            </h2>

            <Link
              href="/archives"
              className="text-2xl border border-green-800 px-4 rounded-full font-semibold text-green-800 hover:opacity-80"
            >
              View all →
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {archives.map((a) => (
              <ArchiveCard key={a.id} archive={a as any} />
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
        className="h-12 w-auto object-contain sm:h-20"
      />
    </span>
  )
}
