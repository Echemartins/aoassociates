import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose prose-gray max-w-none prose-headings:tracking-tight prose-a:text-[rgb(var(--fg))]">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
