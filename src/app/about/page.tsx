import { Container } from "@/src/components/Container"

export default function AboutPage() {
  return (
    <Container className="py-10">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold">About</h1>
        <p className="mt-3 text-[rgb(var(--muted))]">
          Replace this with your firm biography, licenses, and service approach.
          Keep it concise, and link to Projects for proof.
        </p>

        <div className="mt-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <div className="text-sm font-semibold">Core Services</div>
          <ul className="mt-3 grid gap-2 text-sm text-[rgb(var(--muted))]">
            <li>• Architectural Design & Documentation</li>
            <li>• Sustainability / Net-Zero Consulting</li>
            <li>• Permit Support & Coordination</li>
            <li>• Construction Administration</li>
          </ul>
        </div>
      </div>
    </Container>
  )
}
