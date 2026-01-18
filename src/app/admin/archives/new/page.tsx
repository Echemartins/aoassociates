export const runtime = "nodejs"

import { requireAdmin } from "@/src/lib/admin"
import { ArchiveProjectForm } from "@/src/components/admin/ArchiveProjectForm"

export default async function NewArchivePage() {
  await requireAdmin()
  return <ArchiveProjectForm mode="create" />
}
