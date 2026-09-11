'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

// ── Icons for the 6 specialized services (Dark main outline, Light blue accent) ──
function VacuumIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="#1A2E44"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-10 h-10"
      aria-hidden="true"
    >
      {/* Canister body */}
      <rect x="8" y="20" width="24" height="18" rx="4" />
      {/* Wheels */}
      <circle cx="14" cy="38" r="4" fill="#00AEEF" stroke="#00AEEF" />
      <circle cx="26" cy="38" r="4" fill="#00AEEF" stroke="#00AEEF" />
      {/* Hose and wand */}
      <path d="M32 26h4a4 4 0 0 0 4-4V10c0-1-1-2-2-2h-6" />
      {/* Wand nozzle */}
      <path d="M32 6v4" strokeWidth="3" />
      {/* Small details */}
      <path d="M14 26h8" stroke="#00AEEF" />
    </svg>
  );
}

function HouseIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="#1A2E44"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-10 h-10"
      aria-hidden="true"
    >
      {/* Roof */}
      <path d="M6 22 L24 6 L42 22" />
      {/* Walls */}
      <path d="M10 20v22h28V20" />
      {/* Bucket inside */}
      <rect x="22" y="30" width="10" height="8" rx="1" fill="#00AEEF" stroke="#00AEEF" />
      {/* Mop handle */}
      <path d="M18 38V24" stroke="#00AEEF" />
      {/* Mop head */}
      <path d="M15 24h6" stroke="#00AEEF" strokeWidth="3.5" />
    </svg>
  );
}

function KitchenIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="#1A2E44"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-10 h-10"
      aria-hidden="true"
    >
      {/* Range hood chimney */}
      <path d="M18 6h12v12H18z" />
      {/* Range hood body */}
      <path d="M10 18h28v8H10z" />
      {/* Cooktop/stove body */}
      <path d="M10 32h28v10H10z" />
      {/* Knobs */}
      <circle cx="16" cy="37" r="1.5" fill="#00AEEF" stroke="#00AEEF" />
      <circle cx="24" cy="37" r="1.5" fill="#00AEEF" stroke="#00AEEF" />
      <circle cx="32" cy="37" r="1.5" fill="#00AEEF" stroke="#00AEEF" />
      {/* Cooktop elements */}
      <path d="M14 32h6" stroke="#00AEEF" />
      <path d="M28 32h6" stroke="#00AEEF" />
    </svg>
  );
}

function OfficeIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="#1A2E44"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-10 h-10"
      aria-hidden="true"
    >
      <rect x="6" y="8" width="36" height="22" rx="3" />
      <path d="M24 30v8M16 38h16" />
      <path d="M12 14h24" stroke="#00AEEF" />
      <path d="M12 20h16" stroke="#00AEEF" />
    </svg>
  );
}

function WindowIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="#1A2E44"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-10 h-10"
      aria-hidden="true"
    >
      <rect x="8" y="6" width="32" height="36" rx="4" />
      <path d="M24 6v36M8 24h32" />
      <path d="M14 12l4 4" stroke="#00AEEF" />
      <path d="M30 28l4 4" stroke="#00AEEF" />
    </svg>
  );
}

function MoveIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="#1A2E44"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-10 h-10"
      aria-hidden="true"
    >
      <path d="M8 22 L24 8 L40 22" />
      <path d="M12 20v22h24V20" />
      <path d="M20 42V30h8v12" stroke="#00AEEF" />
    </svg>
  );
}

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="relative flex flex-col bg-white rounded-3xl p-6 lg:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 h-full border border-gray-100/50 overflow-hidden">
      
      {/* Water splash decoration in top-right */}
      <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none opacity-30 select-none overflow-hidden rounded-tr-3xl">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-sky-100" stroke="currentColor" strokeWidth="1">
          <path d="M50 0 Q60 30 100 40 Q70 60 50 100 Q40 60 0 45 Q30 30 50 0 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Icon frame */}
      <div className="w-16 h-16 border border-sky-100 rounded-2xl flex items-center justify-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] mb-5 flex-shrink-0 relative z-10">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-bold text-[#1A2E44] leading-snug mb-3 text-left relative z-10">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-400 leading-relaxed mb-6 text-left line-clamp-3 relative z-10">
        {description}
      </p>

      {/* View Service button */}
      <Link
        href="#contact"
        className="mt-auto inline-flex items-center justify-center text-xs font-semibold text-white bg-[#2CBAE8] hover:bg-[#17739C] px-5 py-2.5 rounded-full transition-colors w-full md:w-auto relative z-10"
      >
        View Service
      </Link>
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous services" : "Next services"}
      className={`
        flex-shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center
        transition-all duration-200
        ${
          disabled
            ? "border-gray-200 text-gray-300 cursor-not-allowed bg-white"
            : "border-[#00AEEF] text-[#00AEEF] hover:bg-[#00AEEF] hover:text-white bg-white cursor-pointer shadow-sm"
        }
      `}
    >
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-3.5 h-3.5"
        aria-hidden="true"
      >
        {direction === "left" ? (
          <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
        ) : (
          <path d="M1 8a.5.5 0 0 1 .5-.5h11.793L10.146 4.354a.5.5 0 1 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
        )}
      </svg>
    </button>
  );
}

interface ServiceData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const SERVICES_DATA: ServiceData[] = [
  {
    id: "deeper-cleaning",
    title: "Deeper and More Efficient Cleaning Results",
    description: "Professional companies use trained staff...",
    icon: <VacuumIcon />,
  },
  {
    id: "saves-time",
    title: "Saves Time and Effort",
    description: "Professional cleaning services allow individuals",
    icon: <HouseIcon />,
  },
  {
    id: "well-being",
    title: "Improved Well-being and Comfort at Home",
    description: "Living in a clean, organized, and germ-free environment",
    icon: <KitchenIcon />,
  },
  {
    id: "office-cleaning",
    title: "Office Cleaning",
    description: "Keep your workplace productive and presentable with regular office cleaning.",
    icon: <OfficeIcon />,
  },
  {
    id: "window-cleaning",
    title: "Window Cleaning",
    description: "Crystal-clear windows inside and out using streak-free solutions.",
    icon: <WindowIcon />,
  },
  {
    id: "move-in-out",
    title: "Move In / Move Out Cleaning",
    description: "Comprehensive cleaning for your new home or end-of-tenancy.",
    icon: <MoveIcon />,
  },
];

// ---------------------------------------------------------------------------
// SpecializedServicesSection — main export
// ---------------------------------------------------------------------------
export default function SpecializedServicesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine visible count from container width
  const updateVisibleCount = useCallback(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.offsetWidth;
    if (w < 400) setVisibleCount(1);
    else if (w < 600) setVisibleCount(2);
    else setVisibleCount(3);
  }, []);

  useEffect(() => {
    updateVisibleCount();
    const ro = new ResizeObserver(updateVisibleCount);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [updateVisibleCount]);

  // Clamp index whenever visibleCount changes
  useEffect(() => {
    const maxIndex = Math.max(0, SERVICES_DATA.length - visibleCount);
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [visibleCount]);

  const maxIndex = Math.max(0, SERVICES_DATA.length - visibleCount);
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < maxIndex;

  function goLeft() {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }
  const goRight = useCallback(() => {
    setCurrentIndex((i) => Math.min(maxIndex, i + 1));
  }, [maxIndex]);

  // Card width as percentage of the track (relative to visible window)
  const cardWidthPct = 100 / visibleCount;
  // Gap between cards in px
  const GAP = 16;

  return (
    <section
      className="relative w-full bg-white overflow-hidden py-20 lg:py-28"
      aria-labelledby="specialized-heading"
    >
      {/* ── Soft floating bubbles (left side per mockup) ─── */}
      <div aria-hidden="true" className="absolute top-[25%] left-[4%] w-14 h-14 rounded-full border border-pink-200 opacity-30 pointer-events-none animate-pulse" />
      <div aria-hidden="true" className="absolute top-[35%] left-[2%] w-8 h-8 rounded-full bg-pink-100 opacity-20 pointer-events-none" />
      <div aria-hidden="true" className="absolute top-[8%] left-[22%] w-16 h-16 rounded-full bg-sky-100 opacity-15 pointer-events-none" />

      {/* ── Inner container ───────────────────────────────────────── */}
      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8">
        
        {/* Two-column layout: text content left, cards panel right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.4fr] gap-8 lg:gap-12 items-center">
          
          {/* LEFT: Text Content */}
          <div className="flex flex-col text-center lg:text-left items-center lg:items-start max-w-[480px] mx-auto lg:mx-0">
            {/* Small label */}
            <span className="inline-block text-[#00AEEF] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
              Specialized
            </span>

            {/* Heading */}
            <h2
              id="specialized-heading"
              className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A2E44] leading-tight tracking-tight mb-5"
            >
              Do you require
              <br />
              specialized advice?
            </h2>

            {/* Supporting description */}
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              We provide reliable, professional cleaning with eco-friendly
              products, trained staff, and customized plans for spotless results.
            </p>

            {/* CTA Button */}
            <Link
              href="#services"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#2CBAE8] text-white font-semibold text-sm hover:bg-[#17739C] transition-colors"
            >
              All Services
            </Link>
          </div>

          {/* RIGHT: Cards panel with slider */}
          <div className="flex flex-col gap-6 w-full min-w-0">
            <div className="flex items-center gap-3 w-full">
              {/* Left arrow */}
              <ArrowButton direction="left" onClick={goLeft} disabled={!canGoLeft} />

              {/* Blue container surrounding the cards */}
              <div className="flex-1 bg-[#00AEEF] rounded-3xl p-6 lg:p-8 overflow-hidden relative">
                {/* Viewport: clips overflow */}
                <div className="overflow-hidden" ref={containerRef}>
                  {/* Track: slides horizontally */}
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{
                      gap: `${GAP}px`,
                      transform: `translateX(calc(-${currentIndex} * (${cardWidthPct}% + ${GAP / visibleCount}px)))`,
                    }}
                  >
                    {SERVICES_DATA.map((service) => (
                      <div
                        key={service.id}
                        className="flex-shrink-0"
                        style={{
                          width: `calc(${cardWidthPct}% - ${(GAP * (visibleCount - 1)) / visibleCount}px)`,
                        }}
                      >
                        <BenefitCard
                          icon={service.icon}
                          title={service.title}
                          description={service.description}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right arrow */}
              <ArrowButton direction="right" onClick={goRight} disabled={!canGoRight} />
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2" role="tablist" aria-label="Carousel position">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={currentIndex === i}
                  aria-label={`Go to position ${i + 1}`}
                  onClick={() => setCurrentIndex(i)}
                  className={`rounded-full transition-all duration-200 ${
                    currentIndex === i
                      ? "w-5 h-2 bg-[#00AEEF]"
                      : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}