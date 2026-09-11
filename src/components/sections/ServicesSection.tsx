import ServiceCard, { type ServiceCardData } from "@/components/ui/ServiceCard";

// ---------------------------------------------------------------------------
// Service data — update title, price, and image path when real assets arrive.
// The image field is the src that will be passed to <Image> in ServiceCard.
// ---------------------------------------------------------------------------
const SERVICES: ServiceCardData[] = [
  {
    id: "deep-cleaning",
    title: "Deep Cleaning",
    price: "$258",
    image: "/images/Deep Cleaning.webp",
    href: "#contact",
  },
  {
    id: "end-of-lease",
    title: "End of Lease Cleaning",
    price: "$395",
    image: "/images/End of Lease Cleaning.webp",
    href: "#contact",
  },
  {
    id: "airbnb-cleaning",
    title: "Initial / Deep Cleaning Airbnb",
    price: "$258",
    image: "/images/Deep Cleaning Airbnb.webp",
    href: "#contact",
  },
  {
    id: "commercial-cleaning",
    title: "Commercial Cleaning",
    price: "$258",
    image: "/images/Commercial Cleaning.webp",
    href: "#contact",
  },
];

// ---------------------------------------------------------------------------
// Subtle background bubble — decorative only, no interaction
// ---------------------------------------------------------------------------
function BgBubble({
  className,
  size,
  variant = "outline",
}: {
  className: string;
  size: string;
  variant?: "outline" | "fill";
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute rounded-full pointer-events-none ${size} ${className} ${variant === "outline"
          ? "border border-sky-200 opacity-30"
          : "bg-pink-100 opacity-20"
        }`}
    />
  );
}

// ---------------------------------------------------------------------------
// Section label — shared pattern across all sections
// ---------------------------------------------------------------------------
function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-block text-[#00AEEF] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
      {text}
    </span>
  );
}

// ---------------------------------------------------------------------------
// ServicesSection — main export
// ---------------------------------------------------------------------------
export default function ServicesSection() {
  return (
    <section
      className="relative w-full bg-[#F7FBFF] overflow-hidden"
      aria-labelledby="services-heading"
    >
      {/* ── Background decorative bubbles ─────────────────────────── */}
      <BgBubble size="w-20 h-20" className="top-8  left-4" />
      <BgBubble size="w-10 h-10" className="top-20 left-24" variant="fill" />
      <BgBubble size="w-14 h-14" className="top-6  right-8" />
      <BgBubble size="w-8  h-8" className="top-28 right-20" variant="fill" />
      <BgBubble size="w-16 h-16" className="bottom-10 left-10" variant="fill" />
      <BgBubble size="w-12 h-12" className="bottom-8  right-6" />
      <BgBubble size="w-6  h-6" className="bottom-24 right-28" variant="fill" />

      {/* ── Subtle curved line watermark (top) ────────────────────── */}
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute top-0 left-0 w-full h-14 opacity-[0.04] pointer-events-none"
        aria-hidden="true"
      >
        <path
          d="M0,30 Q360,60 720,30 Q1080,0 1440,30"
          fill="none"
          stroke="#00AEEF"
          strokeWidth="80"
        />
      </svg>

      {/* ── Inner container ───────────────────────────────────────── */}
      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8 py-20 lg:py-28">

        {/* ── Section header — centered ──────────────────────────── */}
        <div className="text-center mb-12 lg:mb-16">
          <SectionLabel text="Our Services" />
          <h2
            id="services-heading"
            className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A2E44] leading-tight tracking-tight"
          >
            Professional Cleaning
            <br className="hidden sm:block" />
            {" "}Services
          </h2>
        </div>

        {/* ── Service cards grid ────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>

      </div>
    </section>
  );
}