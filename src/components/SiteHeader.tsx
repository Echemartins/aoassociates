"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Container } from "@/src/components/Container"

const nav = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/archives", label: "Archives" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(href + "/")
}

export function SiteHeader() {
  const pathname = usePathname() || "/"
  const [open, setOpen] = useState(false)

  const items = useMemo(
    () => nav.map((i) => ({ ...i, active: isActivePath(pathname, i.href) })),
    [pathname]
  )

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    if (open) {
      document.addEventListener("keydown", onKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/aoalogo.png"
            alt="AO + Associates"
            width={140}
            height={40}
            priority
            className="h-14 w-auto object-contain"
          />
          <span className="hidden text-xs text-[rgb(var(--muted))] sm:inline">
            Green Architecture &amp; Planning
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 sm:flex" aria-label="Primary navigation">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={[
                "rounded-full border px-4 py-0.5 text-sm font-medium transition-colors",
                item.active
                  ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent))] text-white hover:bg-[rgb(var(--accent-soft))]"
                  : "border-[rgb(var(--border))] bg-[rgb(var(--accent-soft))] text-[rgb(var(--muted))] hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--bg))] hover:text-[rgb(var(--accent))]",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}

          {/* CTA (no black; outlined brand) */}
          <Link
            href="/contact"
            className="ml-2 rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--accent))] transition-colors hover:bg-[rgb(var(--accent-soft))] hover:text-white"
          >
            Start a Project
          </Link>
        </nav>

        {/* Mobile actions: Hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-controls="mobile-menu"
            aria-expanded={open}
            className="inline-flex items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-2 hover:bg-[rgb(var(--card))]"
          >
            <HamburgerIcon />
          </button>
        </div>
      </Container>

      {/* Mobile menu overlay */}
      {open ? (
        <div className="fixed inset-0 z-50 sm:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div
            id="mobile-menu"
            className="absolute right-0 top-0 h-full w-[88%] max-w-sm border-l border-[rgb(var(--border))] bg-[rgb(var(--bg))] shadow-xl"
          >
            <div className="flex h-16 items-center justify-between border-b border-[rgb(var(--border))] px-4">
              <div className="text-sm font-semibold text-[rgb(var(--fg))]">Menu</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-2 hover:bg-[rgb(var(--card))]"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="p-4">
              {/* Mobile nav list (each item pill) */}
              <div className="grid gap-2">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={item.active ? "page" : undefined}
                    className={[
                      "rounded-full border px-4 py-3 text-sm font-semibold transition-colors",
                      item.active
                        ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent))] text-white"
                        : "border-[rgb(var(--border))] bg-[rgb(var(--bg))] text-[rgb(var(--fg))] hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-soft))] hover:text-[rgb(var(--accent))]",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Mobile CTA (outlined brand) */}
              <div className="mt-4">
                <Link
                  href="/contact"
                  className="block rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--bg))] px-4 py-3 text-center text-sm font-semibold text-[rgb(var(--accent))] transition-colors hover:bg-[rgb(var(--accent))] hover:text-white"
                >
                  Start a Project
                </Link>
                <p className="mt-3 text-xs text-[rgb(var(--muted))]">
                  For permits, feasibility, and sustainable design support.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
