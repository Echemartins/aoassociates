"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function LoginClient() {
  const from = useSearchParams().get("from") || "/admin"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: from,
    })

    // With redirect:true, errors usually show via querystring.
    // This is kept as a fallback.
    if ((res as any)?.error) setError("Invalid login.")
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Admin Login</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">Use your admin credentials.</p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          autoComplete="email"
          className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm"
        />

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <button
          disabled={loading}
          className="rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--bg))] px-5 py-2.5 text-sm font-semibold text-[rgb(var(--accent))] transition-colors hover:bg-[rgb(var(--accent))] hover:text-white disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  )
}
