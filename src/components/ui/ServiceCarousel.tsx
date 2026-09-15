'use client';

import { useState, useRef, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Specialized service data shape
// image: path for future <Image src={image} fill alt={title} />
// ---------------------------------------------------------------------------
export interface SpecializedService {
  id: string;
  title: string;
  description: string;
  image: string;
  href?: string;
}

// ---------------------------------------------------------------------------
// Individual carousel card
// REPLACE: swap the inner placeholder <div> for:
//   <Image src={image} fill alt={title} className="object-cover" />
// inside the image wrapper when real assets are available.
// ---------------------------------------------------------------------------
function CarouselCard({ title, description, href = "#contact" }: SpecializedService) {
  return (
    <article className="flex flex-col bg-white rounded-2xl shadow-[0_2px_14px_rgba(0,0,0,0.07)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.11)] transition-shadow overflow-hidden h-full">

      {/* Image slot */}
      <div className="relative w-full aspect-[4/3] bg-sky-50 overflow-hidden flex-shrink-0">
        {/* Replace this div with <Image src={image} fill alt={title} className="object-cover" /> */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-sky-300">
          <svg
            viewBox="0 0 48 48"
            className="w-10 h-10 opacity-40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <rect x="4" y="4" width="40" height="40" rx="4" />
            <circle cx="16" cy="16" r="5" />
            <path d="M4 32 l10-10 8 8 8-8 14 14" strokeLinejoin="round" />
          </svg>
          <span className="text-[9px] font-medium uppercase tracking-wider opacity-50">
            Image coming soon
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className="text-sm font-semibold text-[#1A2E44] leading-snug">
          {title}
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 flex-1">
          {description}
        </p>
        <a
          href={href}
          className="inline-flex items-center gap-1 text-[#00AEEF] text-xs font-semibold hover:text-[#0099CC] transition-colors mt-auto pt-1"
        >
          Read more
          <svg
            viewBox="0 0 12 12"
            fill="currentColor"
            className="w-2.5 h-2.5"
            aria-hidden="true"
          >
            <path d="M1 6h8.586L6.293 2.707a1 1 0 0 1 1.414-1.414l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 1 1-1.414-1.414L9.586 8H1a1 1 0 0 1 0-2z" />
          </svg>
        </a>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Arrow button — left or right navigation
// ---------------------------------------------------------------------------
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
            : "border-[#00AEEF] text-[#00AEEF] hover:bg-[#00AEEF] hover:text-white bg-white cursor-pointer"
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

// ---------------------------------------------------------------------------
// ServiceCarousel — slides 3 cards on desktop, 2 on tablet, 1 on mobile
// ---------------------------------------------------------------------------
interface ServiceCarouselProps {
  services: SpecializedService[];
}

export default function ServiceCarousel({ services }: ServiceCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine visible count from container width
  const updateVisibleCount = useCallback(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.offsetWidth;
    if (w < 480) setVisibleCount(1);
    else if (w < 768) setVisibleCount(2);
    else setVisibleCount(3);
  }, []);

  useEffect(() => {
    updateVisibleCount();
    const ro = new ResizeObserver(updateVisibleCount);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [updateVisibleCount]);

  const maxIndex = Math.max(0, services.length - visibleCount);
  const effectiveIndex = Math.min(currentIndex, maxIndex);
  const canGoLeft = effectiveIndex > 0;
  const canGoRight = effectiveIndex < maxIndex;

  function goLeft() {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }
  function goRight() {
    setCurrentIndex((i) => Math.min(maxIndex, i + 1));
  }

  // Card width as percentage of the track (relative to visible window)
  const cardWidthPct = 100 / visibleCount;
  // Gap between cards in px — must match the gap applied below
  const GAP = 16;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ── Cards + arrows row ─────────────────────────────────────── */}
      <div className="flex items-center gap-3">

        {/* Left arrow */}
        <ArrowButton direction="left" onClick={goLeft} disabled={!canGoLeft} />

        {/* Viewport: clips overflow */}
        <div className="flex-1 overflow-hidden" ref={containerRef}>
          {/* Track: slides horizontally */}
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              gap: `${GAP}px`,
              // Each card takes (100% - gaps) / visibleCount of the viewport
              transform: `translateX(calc(-${currentIndex} * (${cardWidthPct}% + ${GAP / visibleCount}px)))`,
            }}
          >
            {services.map((service) => (
              <div
                key={service.id}
                className="flex-shrink-0"
                style={{
                  // Card width = (100% of viewport - total gap space) / visibleCount
                  width: `calc(${cardWidthPct}% - ${(GAP * (visibleCount - 1)) / visibleCount}px)`,
                }}
              >
                <CarouselCard {...service} />
              </div>
            ))}
          </div>
        </div>

        {/* Right arrow */}
        <ArrowButton direction="right" onClick={goRight} disabled={!canGoRight} />
      </div>

      {/* ── Dot indicators ────────────────────────────────────────── */}
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
  );
}