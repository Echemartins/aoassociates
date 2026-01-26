import Link from "next/link"
import Image from "next/image"
import { Container } from "@/src/components/Container"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-[rgb(var(--border))]/50 bg-green-900 text-white">
      <Container className="py-3">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Office */}
          <div className="text-center">
            <div className="text-xl font-semibold uppercase text-white">
              Office
            </div>
            <div className="mt-1 text-[16px] leading-6 text-white">
              1270 Av. of The Americas
              <br />
              7th Floor, #1154
              <br />
              New York, NY 10020
              
            </div>
          </div>

          {/* Brand */}
          <div className="text-center">
            <div className="text-xl font-semibold text-white">
              AO + ASSOCIATES Inc.
            </div>
            <p className="mt-1 text-[16px] leading-6 text-white">
              Architecture • Planning • Sustainable Design  <br />Net-Zero Consulting
            </p>
            <div className=" grid grid-cols-3 mt-1 items-center gap-2 w-2/3 mx-auto place-items-center">
                <BadgeImg square src="/images/netzero.png" alt="Net Zero Focus" />
                <BadgeImg src="/images/badges/logo1.webp" alt="MWBE Certified" />
                <BadgeImg src="/images/badges/logo3.png" alt="DBE Certified" />
              </div>

          </div>


          {/* Feedback */}
          <div className="text-center">
            <div className="text-xl font-semibold uppercase text-white">
              Feedback
            </div>
            <p className="mt-1 text-[16px] leading-6 text-white">
              Send us a note or enquiry. We review and respond promptly.
            </p>
            <Link
              href="/contact"
              className={[
                "mt-4 inline-flex items-center justify-center rounded-full",
                "bg-[rgb(var(--bg))]",
                "px-5 py-1.5 text-sm font-semibold text-[rgb(var(--accent))]",
                "transition-colors hover:bg-[rgb(var(--accent))] hover:text-white",
              ].join(" ")}
            >
              Send feedback
            </Link>
          </div>
        </div>

        <div className=" text-center flex flex-col gap-2 border-t border-[rgb(var(--border))] pt-1 mt-1 text-xs text-white sm:flex-row sm:items-center sm:justify-between">
          <div>© {year} AO + Associates. All rights reserved.</div>

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
    <span className={`inline-flex ${square ? "items-center justify-center h-9 w-9 sm:h-14 sm:w-22 mr-6"  : "items-center justify-center h-9 w-9 sm:h-12 sm:w-12"}`}>
      <Image
        src={src}
        alt={alt}
        width={square ? 120 : 96}
        height={square ? 36 : 36} 
        className={square ? "h-full w- object-cover" : "h-full w-auto object-cover"}
      />
    </span>
  )
}