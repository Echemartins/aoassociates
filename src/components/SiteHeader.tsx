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

  // Close menu on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // ESC to close + body scroll lock (optional)
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
      <Container className="flex h-32 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/aoalogo.png"
            alt="AO + Associates"
            width={140}
            height={40}
            priority
            className="h-32 w-auto object-contain"
          />
          <span className="hidden text-2xl font-medium text-green-800 sm:inline">
            Green Architecture &amp; Planning
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-3 md:flex" aria-label="Primary navigation">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={[
                "rounded-full border px-6 py-0.5 text-center w-30 text-xl font-medium transition-colors",
                item.active
                  ? "bg-yellow-700/90 text-white hover:bg-yellow-700"
                  : "border-[rgb(var(--border))] bg-green-800 text-white hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--bg))] hover:text-[rgb(var(--accent))]",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}

          {/* CTA */}
          {/* <Link
            href="/contact"
            className="ml-2 rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--accent))] transition-colors hover:bg-[rgb(var(--accent-soft))] hover:text-white"
          >
            Start a Project
          </Link> */}
        </nav>

        {/* Mobile actions: Hamburger */}
        <div className="flex sm:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-controls="mobile-menu"
            aria-expanded={open}
            className="inline-flex items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-2 hover:bg-[rgb(var(--card))]"
          >
            <HamburgerIcon />
          </button>
        </div>
      </Container>

      {/* MOBILE DROPDOWN (full-width, height fits content, no gap, animated) */}
      <div className="sm:hidden">
        {/* Backdrop starts under header (top-16) */}
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className={[
            "fixed left-0 right-0 top-16 z-40 h-[calc(100dvh-4rem)] bg-black/30 transition-opacity duration-200",
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          ].join(" ")}
        />

        {/* Panel sits directly under header (top-16) and spans full width */}
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          className={[
            "absolute left-0 right-0 top-16 z-50 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))] shadow-lg",
            "origin-top transition-all duration-200 ease-out",
            open
              ? "opacity-100 translate-y-0 scale-y-100 pointer-events-auto"
              : "opacity-0 -translate-y-2 scale-y-95 pointer-events-none",
          ].join(" ")}
        >
          <div className="px-4 py-4">
            <div className="grid text-center">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className={[
                    "border px-4 py-3 text-sm font-semibold transition-colors",
                    item.active
                      ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent))] text-white"
                      : "border-[rgb(var(--border))] bg-[rgb(var(--bg))] text-[rgb(var(--fg))] hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-soft))] hover:text-[rgb(var(--accent))]",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-3">
              <Link
                href="/contact"
                className="block border border-[rgb(var(--accent))] bg-[rgb(var(--bg))] px-4 py-3 text-center text-sm font-semibold text-[rgb(var(--accent))] transition-colors hover:bg-[rgb(var(--accent))] hover:text-white"
              >
                Start a Project
              </Link>
            </div>

            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-xs font-semibold text-[rgb(var(--fg))] hover:bg-[rgb(var(--card))]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
