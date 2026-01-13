import { ProjectForm } from "@/src/components/admin/ProjectForm"

export const runtime = "nodejs"

export default function EditProjectPage({ params }: { params: { id: string } }) {
  return <ProjectForm mode="edit" id={params.id} />
}
