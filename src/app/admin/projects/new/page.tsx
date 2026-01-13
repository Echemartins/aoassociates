import { ProjectForm } from "@/src/components/admin/ProjectForm"

export const runtime = "nodejs"

export default function NewProjectPage() {
  return <ProjectForm mode="create" />
}
