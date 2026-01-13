import { Container } from "@/src/components/Container"
import { prisma } from "@/src/lib/prisma"
import { PostCard } from "@/src/components/PostCard"

export const revalidate = 60

export default async function ArchivesPage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  })

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-semibold">Archives</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        Notes, research, net-zero strategy, and behind-the-scenes decisions.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.id} post={p as any} />
        ))}
      </div>
    </Container>
  )
}
