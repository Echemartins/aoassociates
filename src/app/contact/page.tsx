import { Container } from "@/src/components/Container"

export default function ContactPage() {
  return (
    <Container className="py-10">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold">Contact</h1>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          Send an inquiry or general feedback. Both will appear in Admin for tracking.
        </p>

        <div className="mt-8 grid gap-6">
          <form
            className="rounded-2xl border border-[rgb(var(--border))] bg-white p-6"
            action="/api/public/inquiry"
            method="post"
          >
            <div className="text-sm font-semibold">Project Inquiry</div>

            <div className="mt-4 grid gap-3">
              <input name="name" placeholder="Name" className="rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm" />
              <input name="email" placeholder="Email" className="rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm" />
              <input name="phone" placeholder="Phone (optional)" className="rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm" />
              <input name="projectType" placeholder="Project type (e.g., residential, commercial)" className="rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm" />
              <textarea
                name="message"
                placeholder="Describe your project…"
                className="min-h-32 rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm"
              />
              <button className="rounded-full bg-[rgb(var(--fg))] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">
                Submit Inquiry
              </button>
            </div>
          </form>

          <form
            className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6"
            action="/api/public/feedback"
            method="post"
          >
            <div className="text-sm font-semibold">Site Feedback</div>
            <div className="mt-4 grid gap-3">
              <input name="name" placeholder="Name (optional)" className="rounded-xl border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm" />
              <input name="email" placeholder="Email (optional)" className="rounded-xl border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm" />
              <textarea
                name="message"
                placeholder="What should we fix or improve?"
                className="min-h-28 rounded-xl border border-[rgb(var(--border))] bg-white px-4 py-2 text-sm"
              />
              <button className="rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-sm font-medium hover:bg-[rgb(var(--card))]">
                Send Feedback
              </button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  )
}
