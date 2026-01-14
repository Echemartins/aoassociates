import { PostForm } from "@/src/components/admin/PostForm"

export const runtime = "nodejs"

export default function NewPostPage() {
  return <PostForm mode="create" />
}
