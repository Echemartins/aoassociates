"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Container } from "@/src/components/Container"

export default function AdminLoginPage() {
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

    // Note: with redirect:true, errors usually show via querystring.
    // This is kept as a fallback.
    if ((res as any)?.error) setError("Invalid login.")
    setLoading(false)
  }

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-[rgb(var(--border))] bg-white p-6">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <p className="mt-1 text-sm text-[rgb(var(--muted))]">
          Use your admin credentials.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm"
          />

          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <button
            disabled={loading}
            className="rounded-full bg-[rgb(var(--fg))] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </Container>
  )
}
