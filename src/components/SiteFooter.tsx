import Link from "next/link"
import { Container } from "@/src/components/Container"

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[rgb(var(--border))] bg-[rgb(var(--card))]">
      <Container className="py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="text-sm font-semibold tracking-wide">AO ASSOCIATES</div>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">
              Architecture • Planning • Sustainable Design • Net-Zero Consulting
            </p>
          </div>

          <div className="text-sm">
            <div className="font-semibold">Navigation</div>
            <div className="mt-2 grid gap-2 text-[rgb(var(--muted))]">
              <Link href="/projects" className="hover:text-[rgb(var(--fg))]">Projects</Link>
              <Link href="/archives" className="hover:text-[rgb(var(--fg))]">Archives</Link>
              <Link href="/about" className="hover:text-[rgb(var(--fg))]">About</Link>
              <Link href="/contact" className="hover:text-[rgb(var(--fg))]">Contact</Link>
            </div>
          </div>

          <div className="text-sm">
            <div className="font-semibold">Feedback</div>
            <p className="mt-2 text-[rgb(var(--muted))]">
              Found an issue or want an update? Send a note and it will appear in Admin.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm hover:bg-[rgb(var(--card))]"
            >
              Send feedback
            </Link>
          </div>
        </div>

        <div className="mt-10 text-xs text-[rgb(var(--muted))]">
          © {new Date().getFullYear()} AO Associates. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
