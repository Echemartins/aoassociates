export const dynamic = "force-dynamic"
import { notFound } from "next/navigation"
import { Container } from "@/src/components/Container"
import { prisma } from "@/src/lib/prisma"
import { Markdown } from "@/src/components/Markdown"

export const revalidate = 60

export default async function ArchiveDetailPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } })
  if (!post || post.status !== "PUBLISHED") return notFound()

  return (
    <Container className="py-10">
      <div className="max-w-3xl">
        <div className="text-sm text-[rgb(var(--muted))]">
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "—"}
          {post.category ? ` • ${post.category}` : ""}
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{post.title}</h1>
        {post.excerpt ? <p className="mt-3 text-[rgb(var(--muted))]">{post.excerpt}</p> : null}
        <div className="mt-8">{post.body ? <Markdown content={post.body} /> : null}</div>
      </div>
    </Container>
  )
}
