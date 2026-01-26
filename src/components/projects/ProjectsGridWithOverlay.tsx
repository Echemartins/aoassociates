"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi"

type ProjectLite = {
    id: string
    slug: string
    title?: string | null
    summary?: string | null
    location?: string | null
    year?: number | null
    images?: { url: string }[]
    coverImageUrl?: string | null
}

type Img = {
    url: string
    alt: string
    caption?: string | null
    credit?: string | null
    notes?: string | null
}

function unwrapCdnUrl(url: string) {
    try {
        const u = new URL(url)
        if (u.pathname.startsWith("/x/cdn/")) {
            const candidate = u.searchParams.toString()
            const urlParam = u.searchParams.get("url")
            const raw = urlParam || (candidate.startsWith("http") ? candidate : "")
            return raw ? decodeURIComponent(raw) : url
        }
    } catch { }
    return url
}

function isLocal(src: string) {
    return src?.startsWith("/")
}

function isLikelyAllowedForNextImage(src: string) {
    try {
        const h = new URL(src).hostname
        const allowed = new Set([
            "aoassociates.com",
            "www.aoassociates.com",
            "storage.googleapis.com",
            "s3.amazonaws.com",
        ])
        if (allowed.has(h)) return true
        if (h.endsWith(".s3.amazonaws.com")) return true
        if (h.includes(".s3.") && h.endsWith(".amazonaws.com")) return true
        return false
    } catch {
        return src.startsWith("/")
    }
}

/**
 * IMPORTANT: "No cropping" means we must use object-contain for the real image.
 * To still "fill" the container visually, we layer a blurred object-cover behind it.
 */
function MediaNoCropFill({
    src,
    alt,
    containClass = "object-contain",
}: {
    src: string
    alt: string
    containClass?: string
}) {
    if (!src) return null

    // Local: safe with next/image
    if (isLocal(src)) {
        return (
            <Image
                src={src}
                alt={alt || "Image"}
                fill
                sizes="100vw"
                className={containClass} // keep object-contain to avoid cropping
                priority={false}
            />
        )
    }

    // Remote: use next/image only if host allowed; else fallback to <img>
    if (isLikelyAllowedForNextImage(src)) {
        return (
            <Image
                src={src}
                alt={alt || "Image"}
                fill
                sizes="100vw"
                className={containClass} // keep object-contain to avoid cropping
                priority={false}
            />
        )
    }

    // Fallback for unknown hosts
    return (
        <img
            src={src}
            alt={alt || "Image"}
            className={`absolute inset-0 h-full w-full ${containClass}`} // object-contain
            loading="eager"
            referrerPolicy="no-referrer"
        />
    )
}

function shouldBypassNextImageOptimization(src: string) {
    try {
        const h = new URL(src).hostname
        // avoid Next optimizer hitting S3 and timing out
        return h.includes("amazonaws.com") || h.includes("s3.")
    } catch {
        return false
    }
}

// function MediaFillOne({
//   src,
//   alt,
//   className,
// }: {
//   src: string
//   alt: string
//   className: string
// }) {
//   if (!src) return null

//   // Local always ok
//   if (isLocal(src)) {
//     return (
//       <Image
//         src={src}
//         alt={alt || "Image"}
//         fill
//         sizes="100vw"
//         className={className}
//         priority={false}
//       />
//     )
//   }

//   // Remote: use next/image only if allowed; bypass optimizer for S3 to prevent 500/timeouts
//   if (isLikelyAllowedForNextImage(src)) {
//     return (
//       <Image
//         src={src}
//         alt={alt || "Image"}
//         fill
//         sizes="100vw"
//         className={className}
//         priority={false}
//         unoptimized={shouldBypassNextImageOptimization(src)}
//       />
//     )
//   }

//   // Unknown host fallback
//   return (
//     <img
//       src={src}
//       alt={alt || "Image"}
//       className={`absolute inset-0 h-full w-full ${className}`}
//       loading="lazy"
//       referrerPolicy="no-referrer"
//     />
//   )
// }

function MediaContainWithBackdropOne({
    src,
    alt,
    containClass = "object-contain",
}: {
    src: string
    alt: string
    containClass?: string
}) {
    if (!src) return null

    // LOCAL
    if (isLocal(src)) {
        return (
            <>
                {/* backdrop fill */}
                {/* <Image
                    src={src}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="100vw"
                    className="object-cover scale-110 blur-xl opacity-25"
                    priority={false}
                /> */}
                {/* real image (no crop) */}
                <Image
                    src={src}
                    alt={alt || "Image"}
                    fill
                    sizes="100vw"
                    className={containClass}
                    priority={false}
                />
            </>
        )
    }

    // REMOTE (Next/Image allowed) — bypass optimizer for S3 to avoid timeouts/500s
    if (isLikelyAllowedForNextImage(src)) {
        const bypass = shouldBypassNextImageOptimization(src)
        return (
            <>
                {/* <Image
                    src={src}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="100vw"
                    className="object-cover scale-110 blur-xl opacity-25"
                    priority={false}
                    unoptimized={bypass}
                /> */}
                <Image
                    src={src}
                    alt={alt || "Image"}
                    fill
                    sizes="100vw"
                    className={containClass} // object-contain
                    priority={false}
                    unoptimized={bypass}
                />
            </>
        )
    }

    // UNKNOWN HOST fallback
    return (
        <>
            <img
                src={src}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover scale-110 blur-xl opacity-25"
                loading="lazy"
                referrerPolicy="no-referrer"
            />
            <img
                src={src}
                alt={alt || "Image"}
                className={`absolute inset-0 h-full w-full ${containClass}`} // object-contain
                loading="lazy"
                referrerPolicy="no-referrer"
            />
        </>
    )
}





/** This is your SAME overlay structure: Logo | Details | Image, with arrows + disable at ends. */
function ProjectOverlay({
    open,
    onClose,
    project,
}: {
    open: boolean
    onClose: () => void
    project: any | null
}) {
    const list: Img[] = useMemo(() => {
        const imgs = (project?.images || []).filter((x: any) => x?.url)
        return imgs.map((x: any) => ({
            ...x,
            url: unwrapCdnUrl(x.url),
            alt: x.alt || project?.title || "Project image",
        }))
    }, [project])

    const [idx, setIdx] = useState(0)

    useEffect(() => {
        if (open) setIdx(0)
    }, [open])

    if (!open) return null

    const img = list[idx]
    const canPrev = idx > 0
    const canNext = idx < list.length - 1

    return (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60" />

            {/* Modal */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-[92vh] w-[92vw] max-w-7xl overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] shadow-xl">
                    {/* Close icon (absolute) */}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute right-1 top-1 z-20 inline-flex h-10 w-10 lg:h-14 lg:w-14 items-center justify-center rounded-full border border-[rgb(var(--border))] bg-black/60 hover:opacity-95"
                    >
                        <FiX className="h-10 w-10 text-white" />
                    </button>

                    {/* Image count (absolute) */}
                    <div className="absolute left-3 top-3 z-20 rounded-full border border-[rgb(var(--border))] bg-[rgba(255,255,255,0.85)] px-3 py-1 text-xs font-semibold text-[rgb(var(--fg))] backdrop-blur">
                        {list.length ? `${idx + 1} / ${list.length}` : "—"}
                    </div>

                    {/* Mobile fix: make whole modal scrollable on small screens so image is never hidden */}
                    <div className="h-full w-full overflow-y-auto md:overflow-hidden">
                        <div className="grid min-h-full md:h-full md:grid-cols-12">
                            {/* Logo */}
                            <div className="md:col-span-2 border-b border-[rgb(var(--border))] md:border-b-0 md:border-r bg-[rgb(var(--card))]">
                                <div className="flex h-full      justify-center p-4">
                                    <div className="relative h-24 w-40 md:h-44 md:w-full">
                                        <Image
                                            src="/images/aoalogo.png"
                                            alt="Company logo"
                                            fill
                                            sizes="(max-width: 768px) 50vw, 160px"
                                            className="object-contain"
                                            priority
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="md:col-span-3 border-b border-[rgb(var(--border))] md:border-b-0 md:border-r bg-[rgb(var(--card))]">
                                {/* Allow the details column to scroll independently on desktop */}
                                <div className="h-full w-full md:overflow-y-auto">
                                    <div className="px-3 py-3">
                                        <div className="text-2xl font-semibold text-[rgb(var(--fg))]">{project?.title || "—"}</div>




                                    </div>

                                    <div className="px-3 py-3 grid gap-3 text-sm">
                                        {img?.notes ? (
                                            <div>
                                                <div className="mt-1 text-lg text-[rgb(var(--fg))]">{img.notes}</div>
                                            </div>
                                        ) : null}

                                        {!img?.notes ? (
                                            <div className="text-[rgb(var(--muted))]">
                                                {list.length ? "No additional details for this image." : "No images found for this project."}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            {/* Image */}
                            <div className="md:col-span-7 bg-[rgb(var(--card))]">
                                {/* On mobile we give the image its own height so it shows after details */}
                                <div className="relative h-[44vh] min-h-70 bg-green-400 md:h-full w-full">
                                    {img?.url ? (
                                        <div className="absolute h-full bg-white/80 w-full inset-0">
                                            {/* KEY FIX: no cropping */}
                                            <MediaNoCropFill src={img.url} alt={img.alt || "Project image"} containClass="object-contain" />
                                        </div>
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm font-medium text-[rgb(var(--muted))]">
                                            {"Loading Image..."}
                                        </div>
                                    )}

                                    {/* Arrows (disable at ends) */}
                                    <button
                                        type="button"
                                        onClick={() => canPrev && setIdx((x) => x - 1)}
                                        disabled={!canPrev}
                                        aria-label="Previous"
                                        className={[
                                            "absolute left-3 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 lg:h-16 lg:w-16 items-center justify-center rounded-full border",
                                            "border-[rgb(var(--border))] bg-black/60",
                                            !canPrev ? "opacity-35 cursor-not-allowed" : "hover:opacity-95",
                                        ].join(" ")}
                                    >
                                        <FiChevronLeft className="h-5 w-5 lg:h-10 lg:w-10 text-white" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => canNext && setIdx((x) => x + 1)}
                                        disabled={!canNext}
                                        aria-label="Next"
                                        className={[
                                            "absolute right-3 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 lg:h-16 lg:w-16 items-center justify-center rounded-full border",
                                            "border-[rgb(var(--border))] bg-black/60",
                                            !canNext ? "opacity-35 cursor-not-allowed" : "hover:opacity-95",
                                        ].join(" ")}
                                    >
                                        <FiChevronRight className="h-5 w-5 lg:h-10 lg:w-10 text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

// export function ProjectsGridWithOverlay({ projects }: { projects: ProjectLite[] }) {
//     const [open, setOpen] = useState(false)
//     const [loading, setLoading] = useState(false)
//     const [activeSlug, setActiveSlug] = useState<string | null>(null)
//     const [activeProject, setActiveProject] = useState<any | null>(null)

//     async function openFromProject(p: ProjectLite) {
//         setOpen(true)
//         setActiveSlug(p.slug)
//         setLoading(true)
//         setActiveProject(null)

//         try {
//             const res = await fetch(`/api/public/projects/${encodeURIComponent(p.slug)}`, { cache: "no-store" })
//             const j = await res.json().catch(() => null)
//             if (!res.ok) throw new Error(j?.error || "Failed to load project")
//             setActiveProject(j)
//         } catch {
//             // Keep overlay open; show minimal project data
//             setActiveProject({ slug: p.slug, title: p.title, location: p.location, year: p.year, images: [] })
//         } finally {
//             setLoading(false)
//         }
//     }

//     function close() {
//         setOpen(false)
//         setActiveSlug(null)
//     }

//     return (
//         <>
//             {/* Grid cards (same look as your current ProjectCard) */}
//             <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//                 {projects.map((project) => {
//                     const rawCover = project.images?.[0]?.url || project.coverImageUrl || ""
//                     const cover = rawCover ? unwrapCdnUrl(rawCover) : ""

//                     return (
//                         <button
//                             key={project.id}
//                             type="button"
//                             onClick={() => openFromProject(project)}
//                             className={[
//                                 "group block w-full text-left overflow-hidden rounded border border-[rgb(var(--border))]",
//                                 "bg-[rgb(var(--card))] shadow-[0_0_0_0_rgba(0,0,0,0)]",
//                                 "transition hover:-translate-y-0.5 hover:shadow-md",
//                             ].join(" ")}
//                         >
//                             <div className="relative aspect-4/3 w-full bg-[rgb(var(--card-2))]">
//                                 {cover ? (
//                                     // KEY FIX: no cropping on the card either
//                                     <MediaNoCropFill src={cover} alt={project.title || "Project image"} containClass="object-contain" />
//                                 ) : (
//                                     <div className="flex h-full items-center justify-center text-sm font-medium text-[rgb(var(--muted))]">
//                                         No image
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="p-4">
//                                 <div className="text-2xl md:text-3xl font-semibold tracking-tight text-green-800">
//                                     {project.title}
//                                 </div>

//                                 {project.summary ? (
//                                     <div className="mt-2 line-clamp-2 text-xl leading-relaxed font-medium text-gray-700">
//                                         {project.summary}
//                                     </div>
//                                 ) : null}
//                             </div>
//                         </button>
//                     )
//                 })}
//             </div>

//             {/* Optional small loading hint (doesn't change overlay layout) */}
//             {open && loading ? (
//                 <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] rounded-full border border-[rgb(var(--border))] bg-white/90 px-4 py-2 text-sm font-semibold text-[rgb(var(--fg))] backdrop-blur">
//                     Loading project…
//                 </div>
//             ) : null}

//             {/* Your overlay */}
//             <ProjectOverlay open={open} onClose={close} project={activeProject} />
//         </>
//     )
// }

export function ProjectsGridWithOverlay({ projects }: { projects: ProjectLite[] }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [activeProject, setActiveProject] = useState<any | null>(null)

    // summary expand state per card
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})

    function toggleExpanded(id: string) {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    async function openFromProject(p: ProjectLite) {
        setOpen(true)
        setLoading(true)
        setActiveProject(null)

        try {
            const res = await fetch(`/api/public/projects/${encodeURIComponent(p.slug)}`, { cache: "no-store" })
            const j = await res.json().catch(() => null)
            if (!res.ok) throw new Error(j?.error || "Failed to load project")
            setActiveProject(j)
        } catch {
            setActiveProject({ slug: p.slug, title: p.title, location: p.location, year: p.year, images: [] })
        } finally {
            setLoading(false)
        }
    }

    function close() {
        setOpen(false)
    }

    return (
        <>
            {/* No “air gaps”: use 1px separators instead of spacing */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {projects.map((project) => {
                    const rawCover = project.images?.[0]?.url || project.coverImageUrl || ""
                    const cover = rawCover ? unwrapCdnUrl(rawCover) : ""
                    const isExpanded = !!expanded[project.id]
                    const summary = (project.summary || "").trim()
                    const showMore = summary.length > 140

                    return (
                        <button
                            key={project.id}
                            type="button"
                            onClick={() => openFromProject(project)}
                            className={[
                                "group w-full text-left",
                                "transition hover:relative shadow hover:z-10 hover:shadow-md",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--accent),0.35)]",
                            ].join(" ")}
                        >
                            {/* MEDIA (full-bleed, no padding) */}
                            <div className="relative h-56 w-full overflow-hidden sm:h-60 md:h-64">
                                {cover ? (
                                    //   <MediaFillOne
                                    //     src={cover}
                                    //     alt={project.title || "Project image"}
                                    //     className="object-cover" // fills media area fully
                                    //   />
                                    <MediaContainWithBackdropOne
                                        src={cover}
                                        alt={project.title || "Project image"}
                                        containClass="object-contain object-bottom"
                                    />

                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm font-medium text-[rgb(var(--muted))]">
                                        No image
                                    </div>
                                )}
                            </div>

                            {/* DETAILS (separate div) */}
                            <div className="flex h-full text-center flex-col px-4 py-3">
                                <div className="text-xl font-semibold tracking-tight text-green-800 md:text-2xl line-clamp-2">
                                    {project.title}
                                </div>

                                {summary ? (
                                    <>
                                        <div className={["mt-2 text-base font-medium text-gray-700", isExpanded ? "" : "line-clamp-3"].join(" ")}>
                                            {summary}
                                        </div>

                                        {showMore ? (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation() // IMPORTANT: don’t open overlay
                                                    toggleExpanded(project.id)
                                                }}
                                                className="mt-2 w-fit text-sm font-semibold text-green-800 underline underline-offset-4 hover:opacity-85"
                                                aria-expanded={isExpanded}
                                            >
                                                {isExpanded ? "Less" : "More"}
                                            </button>
                                        ) : null}
                                    </>
                                ) : null}

                                {/* optional: keep bottom alignment consistent if you later add meta */}
                                <div className="mt-auto" />
                            </div>
                        </button>
                    )
                })}
            </div>

            {open && loading ? (
                <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-[rgb(var(--border))] bg-white/90 px-4 py-2 text-sm font-semibold text-[rgb(var(--fg))] backdrop-blur">
                    Loading project…
                </div>
            ) : null}

            <ProjectOverlay open={open} onClose={close} project={activeProject} />
        </>
    )
}
