import type { Metadata } from "next"
import "./globals.css"
import { SiteHeader } from "@/src/components/SiteHeader"
import { SiteFooter } from "@/src/components/SiteFooter"

export const metadata: Metadata = {
  title: "AO + Associates",
  description: "Green Architecture & Planning • Sustainable Design • Net-Zero Strategies",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-[rgb(var(--bg))] text-[rgb(var(--fg))] antialiased">
        <SiteHeader />
        <main className="pt-32 text-xl">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
