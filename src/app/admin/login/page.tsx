import { Suspense } from "react"
import { Container } from "@/src/components/Container"
import LoginClient from "./LoginClient"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default function AdminLoginPage() {
  return (
    <Container className="py-12">
      <Suspense
        fallback={
          <div className="mx-auto max-w-md rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-6">
            <div className="text-sm text-[rgb(var(--muted))]">Loading…</div>
          </div>
        }
      >
        <LoginClient />
      </Suspense>
    </Container>
  )
}
