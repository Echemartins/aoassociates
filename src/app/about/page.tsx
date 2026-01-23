import Link from "next/link"
import Image from "next/image"
import { Container } from "@/src/components/Container"

export default function AboutPage() {
  return (
    <Container className="py-8 sm:py-12">
      <div className="mx-auto ">
        {/* Header */}
        <header className="grid gap-2 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <h1 className="text-4xl font-semibold tracking-tight text-green-800 sm:text-6xl">
              AO + Associates Inc.
            </h1>

            <p className="mt-3 text-lg font-semibold text-green-800 sm:text-xl">
              Balanced • Regenerative • Green, Sustainable &amp; Net-Zero Architecture
            </p>

            <p className="mt-6 text-lg leading-relaxed text-[rgb(var(--fg))]">
              AO + Associates, Inc. was established by <span className="font-semibold">Ade Obayemi</span> following
              the events of September 11, 2001. Mr. Obayemi was a Senior Project Manager with an internationally
              renowned interior design firm, with its NYC offices on the 22nd &amp; 23rd floors of Tower #1 of the World
              Trade Center. He also held key managerial positions in prominent NYC firms and institutions before
              establishing AO + Associates Inc. in 2002 beginning with the hands-on gut renovation of a brownstone shell
              in the heart of Harlem, NY, a portion of which housed the firm’s main office for several years.
            </p>

            {/* <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--accent),0.10)] px-5 py-2.5 text-base font-semibold text-[rgb(var(--fg))] hover:bg-[rgba(var(--accent),0.16)]"
              >
                View Projects
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-base font-semibold text-[rgb(var(--fg))] hover:bg-[rgba(var(--accent),0.06)]"
              >
                Contact
              </Link>
            </div> */}
          </div>

          {/* Single image (only one image on the page) */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden">
              <div className="relative aspect-[4/3] w-full">
                <iframe
                  title="AO + Associates walkthrough video"
                  src="https://player.vimeo.com/video/1149345792?h=6723e7e5ca&autoplay=1&loop=1&muted=1&background=1"
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>


            {/* <p className="mt-2 text-sm font-medium text-[rgb(var(--muted))]">
              Add one representative image here (studio, leadership collage, or a signature project moment).
            </p> */}
          </div>
        </header>

        {/* Experience + Focus */}
        <section className="mt-10 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7 rounded shadow-sm bg-[rgb(var(--card))] p-6">
            <h2 className="text-2xl font-semibold text-green-800 sm:text-3xl">Experience</h2>
            <p className="mt-3 text-lg leading-relaxed text-[rgb(var(--fg))]">
              With more than <span className="font-semibold">35 years</span> of wide-ranging experience, we have designed,
              assisted, and helped build projects ranging from small residential brownstone renovations to major retail,
              commercial, financial, and corporate interior offices, as well as public transportation facilities,
              educational, banking, and religious institution projects.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-[rgb(var(--fg))]">
              Our team drives mission-critical projects from initial planning through approvals and final execution,
              ensuring safety, compliance, and excellence at every step.
            </p>
          </div>

          <div className="lg:col-span-5 rounded shadow-sm bg-[rgb(var(--card))] p-6">
            <h2 className="text-2xl font-semibold text-green-800 sm:text-3xl">Sustainability Focus</h2>
            <p className="mt-3 text-lg leading-relaxed text-[rgb(var(--fg))]">
              In recent years, we have concentrated more on <span className="font-semibold text-green-800">Green, Sustainable &amp; Net-Zero</span>{" "}
              developments aligned with growing global mandates for environmental responsibility, low-embodied carbon,
              and climate change mitigation.
            </p>

            {/* <div className="mt-5 border-t border-[rgb(var(--border))] pt-5">
              <div className="text-sm font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                Licensure &amp; Affiliations
              </div>
              <ul className="mt-3 grid gap-2 text-base font-medium text-[rgb(var(--fg))]">
                <li>• Architectural Registration: New York &amp; New Jersey</li>
                <li>• Professional Affiliation: AIA</li>
                <li>• Professional Affiliation: NOMA</li>
              </ul>
            </div> */}
          </div>
        </section>

        <div className="relative overflow-hidden rounded aspect-[3/1.4] bg-red-600 shadow-sm mt-10">
          <Image
            src="/images/about_Image.jpg"
            alt="AO + Associates studio and leadership"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
            priority={false}
          />

        </div>



        {/* Services */}
        <section className="mt-10">
          <div className="">
            <h2 className="text-3xl lg:text-5xl font-semibold text-center text-green-800 sm:text-4xl">Services</h2>
            {/* <div className="text-sm font-semibold text-[rgb(var(--muted))]">Planning → Approvals → Delivery</div> */}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Commercial */}
            <div className="rounded shadow-sm bg-[rgb(var(--card))] p-6">
              <div className="text-xl font-semibold text-green-800">
                Commercial • Industrial • Education
              </div>
              <ul className="mt-4 grid gap-2 text-lg text-[rgb(var(--fg))]">
                <li><span className="text-green-800 font-extrabold mr-1 text-xl" >•</span> Pre-design: programming, scope definition, development review</li>
                <li><span className="text-green-800 font-extrabold mr-1 text-xl" >•</span> Master planning, site planning, space planning</li>
                <li><span className="text-green-800 font-extrabold mr-1 text-xl" >•</span> Field investigation and as-built drawings</li>
                <li><span className="text-green-800 font-extrabold mr-1 text-xl" >•</span> Schematic design</li>
                <li><span className="text-green-800 font-extrabold mr-1 text-xl" >•</span> Design development</li>
                <li><span className="text-green-800 font-extrabold mr-1 text-xl" >•</span> Construction documents</li>
                <li><span className="text-green-800 font-extrabold mr-1 text-xl" >•</span> Interior design</li>
                <li><span className="text-green-800 font-extrabold mr-1 text-xl" >•</span> Landscape / hardscape / exterior design</li>
                <li><span className="text-green-800 font-extrabold mr-1 text-xl" >•</span> Accessibility &amp; universal design review</li>
                <li><span className="text-green-800 font-extrabold mr-1 text-xl" >•</span> Energy efficiency compliance review</li>
                <li><span className="text-green-800 font-extrabold mr-1 text-xl" >•</span> Coordination with project consultants</li>
                <li><span className="text-green-800 font-extrabold mr-1 text-xl" >•</span> Plan check &amp; permitting assistance</li>
                <li><span className="text-green-800 font-extrabold mr-1 text-xl" >•</span> Presentation renderings</li>
              </ul>
            </div>

            {/* Residential */}
            <div className="rounded shadow-sm bg-[rgb(var(--card))] p-6">
              <div className="text-xl font-semibold text-green-800">Residential • Homeowner</div>
              <ul className="mt-4 grid gap-2 text-lg text-[rgb(var(--fg))]">
                <li><span className="text-green-800 font-extrabold mr-2 text-xl" >•</span>Documentation of existing property conditions</li>
                <li><span className="text-green-800 font-extrabold mr-2 text-xl" >•</span>Assessment of owner needs + options development</li>
                <li><span className="text-green-800 font-extrabold mr-2 text-xl" >•</span>Additions, remodels, and new residences</li>
                <li><span className="text-green-800 font-extrabold mr-2 text-xl" >•</span>3D computer modeling for visualization</li>
                <li><span className="text-green-800 font-extrabold mr-2 text-xl" >•</span>Plans/specs for permits and contractor bidding</li>
                <li><span className="text-green-800 font-extrabold mr-2 text-xl" >•</span>Plan check assistance</li>
                <li><span className="text-green-800 font-extrabold mr-2 text-xl" >•</span>Statements of probable project costs</li>
                <li><span className="text-green-800 font-extrabold mr-2 text-xl" >•</span>Green building modeling</li>
                <li><span className="text-green-800 font-extrabold mr-2 text-xl" >•</span>Energy efficiency compliance documents</li>
                <li><span className="text-green-800 font-extrabold mr-2 text-xl" >•</span>Interior design</li>
                <li><span className="text-green-800 font-extrabold mr-2 text-xl" >•</span>Permit compliance support for prior unpermitted work</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="mt-10 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <h2 className="text-3xl font-semibold text-green-800 sm:text-4xl">Leadership - <i>The Associates</i></h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Ade */}
            <div className="overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-white">
              <div className="relative aspect-[16/11] w-full bg-[rgb(var(--card-2))]">
                <Image
                  src="/images/team/AdeObayomi.jpg"
                  alt="Ade Obayemi"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-contain"
                />
              </div>

              <div className="p-4">
                <div className="text-xl font-semibold text-[rgb(var(--fg))]">Ade Obayemi, RA</div>
                <div className="mt-1 text-base font-semibold text-green-800">Principal Architect</div>
                <div className="mt-2 text-sm font-medium text-[rgb(var(--muted))]">AIA • NOMA</div>
              </div>
            </div>

            {/* Matthew */}
            <div className="overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-white">
              <div className="relative aspect-[16/11] w-full bg-[rgb(var(--card-2))]">
                <Image
                  src="/images/team/MathewAnthony.jpg"
                  alt="Matthew Anthony"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-contain"
                />
              </div>

              <div className="p-4">
                <div className="text-xl font-semibold text-[rgb(var(--fg))]">Matthew Anthony</div>
                <div className="mt-1 text-base font-semibold text-green-800">Senior Project Manager</div>
                <div className="mt-2 text-sm font-medium text-[rgb(var(--muted))]">Architect</div>
              </div>
            </div>

            {/* Samir */}
            <div className="overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-white">
              <div className="relative aspect-[16/11] w-full bg-[rgb(var(--card-2))]">
                <Image
                  src="/images/team/Samir_Dani.jpg"
                  alt="Samir Dani"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-contain"
                />
              </div>

              <div className="p-4">
                <div className="text-xl font-semibold text-[rgb(var(--fg))]">Samir Dani</div>
                <div className="mt-1 text-base font-semibold text-green-800">Office Manager</div>
                <div className="mt-2 text-sm font-medium text-[rgb(var(--muted))]">Architect</div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-[rgb(var(--border))] pt-5">
            <p className="text-lg leading-relaxed text-[rgb(var(--fg))]">
              We bring together planning, technical rigor, and sustainability leadership to deliver reliable outcomes
              through approvals and construction while maintaining the design intent and performance goals of each project.
            </p>
          </div>
        </section>


      </div>
    </Container>
  )
}
