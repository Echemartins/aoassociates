import { PostForm } from "@/src/components/admin/PostForm"

export const runtime = "nodejs"

export default function EditPostPage({ params }: { params: { id: string } }) {
  return <PostForm mode="edit" id={params.id} />
}
