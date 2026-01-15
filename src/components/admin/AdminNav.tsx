import Link from "next/link"
import { SignOutButton } from "@/src/components/admin/SignOutButton"

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/posts", label: "Archives" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/feedback", label: "Feedback" },
]

export function AdminNav() {
  return (
    <nav className=" border-x border-x-[rgb(var(--border))] bg-white p-4">
      <div className="text-sm font-semibold">Admin</div>
      <div className="mt-3 grid gap-1">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className="rounded-xl py-2 text-sm text-[rgb(var(--muted))] hover:bg-[rgb(var(--card))] hover:text-[rgb(var(--fg))]"
          >
            {i.label}
          </Link>
        ))}
      </div>
      <div className="mt-3">
        <SignOutButton />
      </div>
    </nav>
  )
}
