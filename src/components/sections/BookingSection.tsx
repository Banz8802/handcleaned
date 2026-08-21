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
      className={`absolute rounded-full pointer-events-none ${size} ${className} ${
        variant === "outline"
          ? "border-2 border-sky-200 opacity-30"
          : "bg-pink-100 opacity-25"
      }`}
    />
  );
}

// ---------------------------------------------------------------------------
// Booking illustration image
// ---------------------------------------------------------------------------
function BookingIllustration() {
  return (
    <div className="relative w-full max-w-[450px] aspect-[715/651] overflow-hidden">
      <Image
        src="/images/contact-img.png"
        alt="Book a cleaning service"
        fill
        className="object-contain"
        sizes="(max-width: 1024px) 100vw, 450px"
      />
    </div>
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
      {/* ── Section-level decorative elements ─────────────────────── */}

      {/* Sparkle stars */}
      <Sparkle className="top-12 left-6"   size="w-6 h-6" />
      <Sparkle className="top-6  left-16"  size="w-4 h-4" />
      <Sparkle className="bottom-16 left-8" size="w-5 h-5" />
      <Sparkle className="top-10 right-6"  size="w-4 h-4" />
      <Sparkle className="bottom-10 right-12" size="w-6 h-6" />

      {/* Background bubbles */}
      <Bubble size="w-24 h-24" className="top-6   left-0"   />
      <Bubble size="w-10 h-10" className="top-28  left-12"  variant="fill" />
      <Bubble size="w-16 h-16" className="bottom-8 left-6"  variant="fill" />
      <Bubble size="w-20 h-20" className="top-4   right-2"  />
      <Bubble size="w-8  h-8"  className="top-32  right-16" variant="fill" />
      <Bubble size="w-12 h-12" className="bottom-6 right-4" />

      {/* ── White outer card container ────────────────────────────── */}
      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8">
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

            {/* ── Right: illustration ────────────────────────────── */}
            <div className="flex-1 bg-[#EBF6FB] flex items-center justify-center px-6 py-10 lg:py-0 min-h-[360px] lg:min-h-0 relative">
              {/* Decorative dots grid pattern */}
              <svg
                viewBox="0 0 200 200"
                className="absolute top-4 right-4 w-24 h-24 opacity-[0.08] pointer-events-none"
                aria-hidden="true"
              >
                {Array.from({ length: 5 }).map((_, row) =>
                  Array.from({ length: 5 }).map((_, col) => (
                    <circle
                      key={`${row}-${col}`}
                      cx={20 + col * 40}
                      cy={20 + row * 40}
                      r="5"
                      fill="#00AEEF"
                    />
                  ))
                )}
              </svg>
              <BookingIllustration />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}