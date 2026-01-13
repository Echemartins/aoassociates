import { Container } from "@/src/components/Container"
import { AdminNav } from "@/src/components/admin/AdminNav"

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[rgb(var(--card))]">
      <Container className="py-8">
        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <AdminNav />
          </aside>
          <section className="lg:col-span-9">{children}</section>
        </div>
      </Container>
    </div>
  )
}
