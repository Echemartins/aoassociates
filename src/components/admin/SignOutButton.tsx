"use client"

import { signOut } from "next-auth/react"

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full rounded-xl border border-[rgb(var(--border))] bg-white px-3 py-2 text-sm text-[rgb(var(--muted))] hover:bg-[rgb(var(--card))] hover:text-[rgb(var(--fg))]"
    >
      Sign out
    </button>
  )
}
