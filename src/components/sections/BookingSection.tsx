import BookingForm from "@/components/ui/BookingForm";
import Image from "next/image";


// ---------------------------------------------------------------------------
// Sparkle icon — 4-pointed teal star, shared decorative element
// ---------------------------------------------------------------------------
function Sparkle({ className, size = "w-7 h-7" }: { className: string; size?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`absolute pointer-events-none ${size} ${className}`}
      aria-hidden="true"
      fill="#00AEEF"
    >
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Decorative bubble
// ---------------------------------------------------------------------------
function Bubble({ className, size, variant = "outline" }: {
  className: string;
  size: string;
  variant?: "outline" | "fill";
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute rounded-full pointer-events-none ${size} ${className} ${variant === "outline"
        ? "border-2 border-sky-200 opacity-30"
        : "bg-pink-100 opacity-25"
        }`}
    />
  );
}


// ---------------------------------------------------------------------------
// BookingSection — main export
// ---------------------------------------------------------------------------
export default function BookingSection() {
  return (
    <section
      className="relative w-full bg-[#EBF6FB] overflow-hidden py-20 lg:py-28"
      aria-labelledby="booking-heading"
    >
      {/* ── White outer card container ────────────────────────────── */}
      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8">

        {/* Decorative sparkles & bubbles (framed close to center card) */}
        {/* Top Left Cluster */}
        <Sparkle className="-top-6 left-[2%] sm:left-[4%]" size="w-6 h-6" />
        <Sparkle className="-top-10 left-[10%] sm:left-[14%]" size="w-4 h-4" />
        <Bubble size="w-24 h-24" className="-top-8 left-[1%] sm:left-[4%]" />
        <Bubble size="w-10 h-10" className="top-12 left-[8%] sm:left-[12%]" variant="fill" />

        {/* Bottom Left Cluster */}
        <Sparkle className="-bottom-8 left-[3%] sm:left-[6%]" size="w-5 h-5" />
        <Bubble size="w-16 h-16" className="-bottom-6 left-[2%] sm:left-[5%]" variant="fill" />

        {/* Top Right Cluster */}
        <Sparkle className="-top-8 right-[2%] sm:right-[5%]" size="w-4 h-4" />
        <Bubble size="w-20 h-20" className="-top-10 right-[1%] sm:right-[4%]" />
        <Bubble size="w-8 h-8" className="top-12 right-[8%] sm:right-[12%]" variant="fill" />

        {/* Bottom Right Cluster */}
        <Sparkle className="-bottom-6 right-[4%] sm:right-[8%]" size="w-6 h-6" />
        <Bubble size="w-12 h-12" className="-bottom-4 right-[2%] sm:right-[5%]" />

        <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.08)] overflow-hidden">

          {/* Inner grid: form left, illustration right */}
          <div className="flex flex-col lg:flex-row items-stretch gap-0">

            {/* ── Left: dark booking form card ──────────────────── */}
            <div className="w-full lg:w-[42%] xl:w-[38%] flex-shrink-0 p-8 lg:p-10 flex items-center">
              <div className="w-full max-w-[340px] mx-auto lg:mx-0">
                <h2 id="booking-heading" className="sr-only">
                  Book a Cleaning Service
                </h2>
                <BookingForm />
              </div>
            </div>

            {/* ── Right: full-bleed image background ──────────────── */}
            <div className="flex-1 relative min-h-[360px] lg:min-h-0 overflow-hidden">
              <Image
                src="/images/contact-img.webp"
                alt="Book a cleaning service"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 62vw"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}