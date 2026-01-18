"use client"

import { useRouter } from "next/navigation"
import { FiArrowLeft } from "react-icons/fi"

export default function BackPill() {
  const router = useRouter()

  return (
    // <button
    //   type="button"
    //   onClick={() => router.back()}
    //   className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--fg))] shadow-sm transition-colors hover:border-[rgb(var(--accent))] hover:bg-[rgba(var(--accent),0.08)]"
    //   aria-label=""
    // >

      <FiArrowLeft className="h-8 w-8 font-bold hover:cursor-pointer" onClick={() => router.back()} />
    //   Back
    // </button>
  )
}
