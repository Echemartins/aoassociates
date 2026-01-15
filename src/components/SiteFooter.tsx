import Link from "next/link"
import { Container } from "@/src/components/Container"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-14 border-t border-white/10 bg-black text-white">
      <Container className="py-8">
        {/* 3 columns on desktop, stacked on mobile */}
        <div className="grid items-start gap-6 sm:grid-cols-3">
          {/* Left: Brand */}
          <div>
            <div className="text-sm font-semibold tracking-wide">AO ASSOCIATES</div>
            <p className="mt-1 text-sm text-white/70">
              Architecture • Planning • Sustainable Design • Net-Zero Consulting
            </p>
          </div>

          {/* Middle: Office (centered) */}
          <div className="md:pl-12">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Office</div>
            <div className="mt-2 text-sm leading-relaxed text-white/80">
              1270 Av. of The Americas
              <br />
              7th Floor, #1154
              <br />
              New York, NY 10020
            </div>
          </div>

          {/* Right: Feedback (short) */}
          <div className="">
            <div className="text-xs font-semibold uppercase tracking-wide text-white">Feedback</div>
            <p className="mt-2 text-sm text-white/70">Send us a note or enquiry, we will review shortly.</p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-white/35 hover:bg-white/10"
            >
              Send feedback
            </Link>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-6 border-t border-white/10 pt-4 text-xs text-white/55">
          © {year} AO Associates. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}


// import Link from "next/link"
// import { Container } from "@/src/components/Container"

// export function SiteFooter() {
//   const year = new Date().getFullYear()

//   const mapsUrl =
//     "https://www.google.com/maps/search/?api=1&query=" +
//     encodeURIComponent("1270 Av. of The Americas, 7th Floor #1154, New York, NY 10020")

//   return (
//     <footer className="mt-12 border-t border-white/10 bg-black text-white">
//       <Container className="py-6">
//         <div className="grid gap-6 sm:grid-cols-3 sm:items-start">
//           {/* Left: Brand */}
//           <div>
//             <div className="text-sm font-semibold tracking-wide">AO ASSOCIATES</div>
//             <p className="mt-1 text-xs text-white/70">
//               Architecture • Planning • Sustainable Design • Net-Zero Consulting
//             </p>
//           </div>

//           {/* Middle: Contact grid (clickable) */}
//           <div className="sm:justify-self-center">
//             <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Contact</div>

//             <div className="mt-3 grid gap-2 sm:grid-cols-2">
//               {/* Address */}
//               <a
//                 href={mapsUrl}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="group rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:border-white/25 hover:bg-white/10"
//               >
//                 <div className="flex items-start gap-2">
//                   <AddressIcon />
//                   <div className="min-w-0">
//                     <div className="text-xs font-semibold text-white/85">Address</div>
//                     <div className="mt-0.5 text-xs text-white/70">
//                       New York, New Jersey
//                     </div>
//                     <div className="mt-0.5 text-[11px] text-white/55">
//                       1270 Av. of The Americas, 7th Floor, #1154, NY 10020
//                     </div>
//                   </div>
//                 </div>
//               </a>

//               {/* Phone */}
//               <a
//                 href="tel:+12128283456"
//                 className="group rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:border-white/25 hover:bg-white/10"
//               >
//                 <div className="flex items-start gap-2">
//                   <PhoneIcon />
//                   <div className="min-w-0">
//                     <div className="text-xs font-semibold text-white/85">Phone</div>
//                     <div className="mt-0.5 text-xs text-white/70">(212) 828-3456</div>
//                   </div>
//                 </div>
//               </a>

//               {/* Email */}
//               <a
//                 href="mailto:info@aoassociates.com"
//                 className="group rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:border-white/25 hover:bg-white/10"
//               >
//                 <div className="flex items-start gap-2">
//                   <MailIcon />
//                   <div className="min-w-0">
//                     <div className="text-xs font-semibold text-white/85">Email</div>
//                     <div className="mt-0.5 text-xs text-white/70">Info@AOAssociates.com</div>
//                   </div>
//                 </div>
//               </a>

//               {/* Fax (no number provided in the screenshot; keep ready) */}
//               <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
//                 <div className="flex items-start gap-2">
//                   <FaxIcon />
//                   <div className="min-w-0">
//                     <div className="text-xs font-semibold text-white/85">Fax</div>
//                     <div className="mt-0.5 text-xs text-white/55">—</div>
//                     {/* If you have a fax number later, replace "—" with it. */}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right: Feedback (short, compact) */}
//           <div className="sm:justify-self-end">
//             <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Feedback</div>
//             <p className="mt-2 text-xs text-white/70">Send a note—reviewed in Admin.</p>
//             <Link
//               href="/contact"
//               className="mt-3 inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-white/35 hover:bg-white/10"
//             >
//               Send feedback
//             </Link>
//           </div>
//         </div>

//         <div className="mt-5 border-t border-white/10 pt-3 text-[11px] text-white/55">
//           © {year} AO Associates. All rights reserved.
//         </div>
//       </Container>
//     </footer>
//   )
// }

// function AddressIcon() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 text-white/80">
//       <path
//         d="M12 22s7-4.4 7-12a7 7 0 1 0-14 0c0 7.6 7 12 7 12Z"
//         stroke="currentColor"
//         strokeWidth="2"
//       />
//       <path
//         d="M12 13.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
//         stroke="currentColor"
//         strokeWidth="2"
//       />
//     </svg>
//   )
// }

// function PhoneIcon() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 text-white/80">
//       <path
//         d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16.9Z"
//         stroke="currentColor"
//         strokeWidth="2"
//       />
//     </svg>
//   )
// }

// function MailIcon() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 text-white/80">
//       <path
//         d="M4 4h16v16H4V4Z"
//         stroke="currentColor"
//         strokeWidth="2"
//       />
//       <path
//         d="m4 6 8 7 8-7"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinejoin="round"
//       />
//     </svg>
//   )
// }

// function FaxIcon() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 text-white/80">
//       <path
//         d="M7 7V3h10v4"
//         stroke="currentColor"
//         strokeWidth="2"
//       />
//       <path
//         d="M6 17H5a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-1"
//         stroke="currentColor"
//         strokeWidth="2"
//       />
//       <path
//         d="M7 14h10v7H7v-7Z"
//         stroke="currentColor"
//         strokeWidth="2"
//       />
//     </svg>
//   )
// }