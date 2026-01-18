export const runtime = "nodejs"

import { requireAdmin } from "@/src/lib/admin"
import { ArchiveProjectForm } from "@/src/components/admin/ArchiveProjectForm"

export default async function EditArchivePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  return <ArchiveProjectForm mode="edit" id={id} />
}
