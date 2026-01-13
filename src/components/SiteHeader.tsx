import Link from "next/link"
import { Container } from "@/src/components/Container"

const nav = [
  { href: "/projects", label: "Projects" },
  { href: "/archives", label: "Archives" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgb(var(--border))] bg-white/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-wide">AO ASSOCIATES</span>
          <span className="hidden text-xs text-[rgb(var(--muted))] sm:inline">
            Sustainable Architecture
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="hidden rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2 text-sm hover:bg-white sm:inline"
          >
            Start a Project
          </Link>
        </nav>
      </Container>
    </header>
  )
}
