import Link from "next/link"
import Image from "next/image"
import { Container } from "@/src/components/Container"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-[rgb(var(--border))]/50 bg-green-900 text-white">
      <Container className="py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="text-2xl font-semibold tracking-wide text-white">
              AO + ASSOCIATES
            </div>
            <p className="mt-4 text-lg leading-relaxed text-white">
              Architecture • Planning • Sustainable Design • Net-Zero Consulting
            </p>

          </div>

          {/* Office */}
          <div className="sm:pl-10">
            <div className="text-2xl font-semibold uppercase tracking-wide text-white">
              Office
            </div>
            <div className="mt-3 text-lg leading-relaxed text-white">
              1270 Av. of The Americas
              <br />
              7th Floor, #1154
              <br />
              New York, NY 10020
            </div>
          </div>

          {/* Feedback */}
          <div className="">
            <div className="text-2xl font-semibold uppercase tracking-wide text-white">
              Feedback
            </div>
            <p className="mt-3 text-lg leading-relaxed text-white">
              Send us a note or enquiry. We review and respond promptly.
            </p>
            <Link
              href="/contact"
              className={[
                "mt-4 inline-flex items-center justify-center rounded-full",
                "bg-[rgb(var(--bg))]",
                "px-5 py-2 text-sm font-semibold text-[rgb(var(--accent))]",
                "transition-colors hover:bg-[rgb(var(--accent))] hover:text-white",
              ].join(" ")}
            >
              Send feedback
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-[rgb(var(--border))] pt-5 text-xs text-white sm:flex-row sm:items-center sm:justify-between">
          <div>© {year} AO + Associates. All rights reserved.</div>
           <div className=" flex items-center gap-5 sm:justify-end">
              <BadgeImg src="/images/netzero.png" alt="Net Zero Focus" />
              <BadgeImg src="/images/badges/logo1.webp" alt="MWBE Certified" />
              <BadgeImg src="/images/badges/logo2.png" alt="DBE Certified" />
            </div>
        </div>
      </Container>
    </footer>
  )
}


function BadgeImg({
  src,
  alt,
  square,
}: {
  src: string
  alt: string
  square?: boolean
}) {
  return (
    <span className="inline-flex items-center justify-center h-9 w-9 sm:h-16 sm:w-16">
      <Image
        src={src}
        alt={alt}
        width={square ? 44 : 96}
        height={square ? 44 : 36} 
        className={square ? "h-full w-full object-contain" : "h-full w-auto object-cover"}
      />
    </span>
  )
}