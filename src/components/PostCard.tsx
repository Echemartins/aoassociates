import Link from "next/link"

export function PostCard({ post }: { post: any }) {
  return (
    <Link
      href={`/archives/${post.slug}`}
      className="rounded-2xl border border-[rgb(var(--border))] bg-white p-5 hover:shadow-sm"
    >
      <div className="text-sm text-[rgb(var(--muted))]">
        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "—"}
        {post.category ? ` • ${post.category}` : ""}
      </div>
      <div className="mt-2 text-lg font-semibold">{post.title}</div>
      {post.excerpt ? (
        <div className="mt-2 line-clamp-3 text-sm text-[rgb(var(--muted))]">{post.excerpt}</div>
      ) : null}
    </Link>
  )
}
