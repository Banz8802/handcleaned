"use client";

import { useState } from "react";
import Image from "next/image";
import { getSiteContent, type TestimonialSectionContent } from "@/lib/data/contentConfig";

interface TestimonialSectionProps {
  content?: TestimonialSectionContent;
}

export default function TestimonialSection({ content: customContent }: TestimonialSectionProps) {
  const content = customContent || getSiteContent().testimonials;
  const activeTestimonials = (content.items || []).filter((item) => item.active !== false);
  const items = activeTestimonials.length > 0 ? activeTestimonials : (content.items || []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const current = items[currentIndex] || items[0] || {
    id: "1",
    name: "Emily Davis",
    role: "CLIENT",
    text: "Hand Cleaned has been a complete game-changer for our busy household.",
    avatar: "/images/avatar1.jpg",
    rating: 5,
    active: true,
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const headingLines = (content.sectionHeading || "We are Very Happy for\nClient’s Reviews.").split("\n");

  return (
    <section
      className="relative w-full bg-[#EBF6FB] py-20 lg:py-28 overflow-hidden"
      aria-labelledby="testimonial-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* ── Section Header ────────────────────────────────────────────── */}
        <div className="text-center mb-14 lg:mb-20">
          <span className="inline-block text-[#2CBAE8] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
            {content.sectionBadge || "Testimonial"}
          </span>
          <h2
            id="testimonial-heading"
            className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A2E44] leading-tight tracking-tight max-w-[600px] mx-auto"
          >
            {headingLines.map((line, idx) => (
              <span key={idx}>
                {line}
                {idx < headingLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
        </div>

        {/* ── Content Grid ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ── Left Side: Avatar Collage Cluster ───────────────────────── */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="relative w-full max-w-[460px] h-[360px] sm:h-[400px] flex items-center justify-center">
              
              {/* Left-top small avatar */}
              <div className="absolute top-[15%] left-[2%] w-24 h-24 sm:w-28 sm:h-28 rounded-[24px] overflow-hidden shadow-lg border-4 border-white transform -rotate-3 transition-transform hover:scale-105">
                <Image
                  src="/images/avatar1.jpg"
                  alt="Client review"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Center Main Large Featured Avatar */}
              <div className="absolute top-[5%] left-[22%] w-36 h-36 sm:w-44 sm:h-44 rounded-[32px] overflow-hidden shadow-2xl border-4 border-white z-10 transition-transform hover:scale-105">
                <Image
                  src={current.avatar || "/images/avatar2.jpg"}
                  alt={current.name || "Client review"}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Right-top avatar */}
              <div className="absolute top-[18%] right-[5%] w-24 h-24 sm:w-28 sm:h-28 rounded-[24px] overflow-hidden shadow-lg border-4 border-white transform rotate-3 transition-transform hover:scale-105">
                <Image
                  src="/images/avatar3.jpg"
                  alt="Client review"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Bottom-left avatar */}
              <div className="absolute bottom-[8%] left-[20%] w-24 h-24 sm:w-28 sm:h-28 rounded-[24px] overflow-hidden shadow-lg border-4 border-white transition-transform hover:scale-105">
                <Image
                  src="/images/avatar4.jpg"
                  alt="Client review"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Center-bottom small circular avatar */}
              <div className="absolute bottom-[28%] right-[32%] w-16 h-16 rounded-full overflow-hidden shadow-md border-4 border-white z-20 transition-transform hover:scale-105">
                <Image
                  src="/images/avatar1.jpg"
                  alt="Client review"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Bottom-right featured avatar */}
              <div className="absolute bottom-[2%] right-[18%] w-24 h-24 sm:w-28 sm:h-28 rounded-[28px] overflow-hidden shadow-xl border-4 border-white z-10 transform rotate-2 transition-transform hover:scale-105">
                <Image
                  src="/images/avatar5.jpg"
                  alt="Client review"
                  fill
                  className="object-cover"
                />
              </div>

            </div>
          </div>

          {/* ── Right Side: Dark Card + Controls ───────────────────────── */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-end">
            <div className="w-full max-w-[500px]">
              
              {/* Dark Testimonial Card */}
              <div className="relative bg-[#17739C] rounded-[28px] p-8 sm:p-10 text-white shadow-2xl mb-8 min-h-[260px] flex flex-col justify-between">
                
                {/* Yellow Quote Badge */}
                <div className="absolute -top-6 left-8 w-14 h-14 bg-[#FFE67B] rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    viewBox="0 0 24 24"
                    fill="#17739C"
                    className="w-7 h-7"
                    aria-hidden="true"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Review Text */}
                <p className="text-white/85 text-sm sm:text-base leading-relaxed pt-4 mb-6">
                  {current.text}
                </p>

                {/* Author Info & Large Decorative Quote Mark */}
                <div className="flex items-end justify-between pt-2">
                  <div>
                    <h3 className="font-bold text-white text-lg tracking-tight">
                      {current.name}
                    </h3>
                    <p className="text-xs text-white/50 font-semibold tracking-wider uppercase mt-0.5">
                      {current.role}
                    </p>
                  </div>

                  {/* Watermark Quote Icon */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-16 h-16 text-white/10 flex-shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
              </div>

              {/* ── Carousel Navigation Controls ───────────────────────── */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                    className="w-10 h-10 rounded-xl bg-[#2CBAE8] hover:bg-[#17739C] text-white flex items-center justify-center transition-colors shadow-sm"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next testimonial"
                    className="w-10 h-10 rounded-xl bg-[#2CBAE8] hover:bg-[#17739C] text-white flex items-center justify-center transition-colors shadow-sm"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* Counter */}
                <div className="text-sm font-semibold text-[#1A2E44]">
                  <span className="font-bold text-[#1A2E44]">{currentIndex + 1}</span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="text-gray-400">{items.length}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
