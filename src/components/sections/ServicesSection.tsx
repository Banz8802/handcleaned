import ServiceCard, { type ServiceCardData } from "@/components/ui/ServiceCard";
import BubbleDecoration from "@/components/ui/BubbleDecoration";

// ---------------------------------------------------------------------------
// Service data — update title, price, and image path when real assets arrive.
// The image field is the src that will be passed to <Image> in ServiceCard.
// ---------------------------------------------------------------------------
const SERVICES: ServiceCardData[] = [
  {
    id: "airbnb-cleaning",
    title: "Airbnb Cleaning",
    description: "Fast turnaround turnover cleaning and guest-ready preparation for your short-term rental.",
    image: "/images/airbnb-cleaning.webp",
    href: "#contact",
  },
  {
    id: "residential-cleaning",
    title: "Residential Cleaning",
    description: "Comprehensive home cleaning tailored to maintain a clean, hygienic, and welcoming space.",
    image: "/images/Deep Cleaning.webp",
    href: "#contact",
  },
  {
    id: "commercial-cleaning",
    title: "Commercial Cleaning",
    description: "Reliable office and workspace cleaning to keep your workplace healthy and productive.",
    image: "/images/Commercial Cleaning.webp",
    href: "#contact",
  },
  {
    id: "linen-hire",
    title: "Linen Hire",
    description: "Fresh, premium hotel-quality bed sheets, towels, and linen supply for your properties.",
    image: "/images/Linen Hire.webp",
    href: "#contact",
  },
];

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
      className="relative w-full bg-[#F7FBFF] overflow-hidden py-20 lg:py-28"
      aria-labelledby="services-heading"
    >
      {/* ── Inner container ───────────────────────────────────────── */}
      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8">

        {/* ── Background floating bubble PNG images (centered framing) ── */}
        {/* Top Left Cluster — framing header on left */}
        <BubbleDecoration
          imageIndex={1}
          size={110}
          className="-top-2 left-[2%] sm:left-[6%] lg:left-[10%] opacity-90"
          animationIndex={1}
        />
        <BubbleDecoration
          imageIndex={2}
          size={45}
          className="top-12 left-[14%] sm:left-[18%] lg:left-[21%] opacity-80"
          animationIndex={2}
        />
        <BubbleDecoration
          imageIndex={3}
          size={55}
          className="top-20 left-[7%] sm:left-[11%] lg:left-[14%] opacity-85"
          animationIndex={3}
        />

        {/* Top Right Cluster — framing header on right */}
        <BubbleDecoration
          imageIndex={2}
          size={90}
          className="-top-3 right-[2%] sm:right-[6%] lg:right-[10%] opacity-85"
          animationIndex={4}
        />
        <BubbleDecoration
          imageIndex={3}
          size={45}
          className="top-12 right-[12%] sm:right-[16%] lg:right-[19%] opacity-80"
          animationIndex={1}
        />
        <BubbleDecoration
          imageIndex={1}
          size={40}
          className="top-24 right-[5%] sm:right-[9%] lg:right-[13%] opacity-75"
          animationIndex={2}
        />

        {/* Lower Left & Right — framing cards */}
        <BubbleDecoration
          imageIndex={3}
          size={85}
          className="bottom-4 left-[1%] sm:left-[4%] opacity-80"
          animationIndex={3}
        />
        <BubbleDecoration
          imageIndex={1}
          size={95}
          className="bottom-2 right-[1%] sm:right-[4%] opacity-85"
          animationIndex={4}
        />

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