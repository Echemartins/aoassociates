import { ProjectForm } from "@/src/components/admin/ProjectForm"

export const runtime = "nodejs"

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ProjectForm mode="edit" id={id} />
}
