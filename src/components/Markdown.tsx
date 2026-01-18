import type { ReactNode } from "react"

export function Markdown({ content }: { content: string }) {
  // Keep your existing markdown renderer logic here.
  // If you already return rendered HTML, just apply the className below to the container.

  return (
    <article
      className={[
        "text-xl leading-7",
        // "prose-headings:tracking-tight",
        // "prose-headings:text-[rgb(var(--fg))]",
        // "prose-p:leading-relaxed prose-p:text-[rgb(var(--muted))]",
        // "prose-li:text-[rgb(var(--muted))]",
        // "prose-strong:text-[rgb(var(--fg))]",
        // "prose-a:text-[rgb(var(--accent))] prose-a:no-underline hover:prose-a:underline",
        // "prose-hr:border-[rgb(var(--border))]",
        // // tighten default spacing
        // "prose-p:my-3 prose-ul:my-3 prose-ol:my-3 prose-li:my-1",
        // "prose-h2:mt-6 prose-h2:mb-2 prose-h3:mt-5 prose-h3:mb-2",
      ].join(" ")}
    >
      {/* Replace this with your renderer output */}
      <div>{content}</div>
    </article>
  )
}
