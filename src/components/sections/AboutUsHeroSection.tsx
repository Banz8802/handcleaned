'use client';

import Link from "next/link";

function WaveDivider() {
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none"
      style={{ height: "60px" }}
    >
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 min-w-[1440px] w-full h-full"
      >
        <path
          d="
            M0,60
            C60,46 120,22 200,30
            C260,36 290,52 360,44
            C420,38 450,22 520,16
            C590,12 630,28 700,32
            C760,38 800,28 860,22
            C930,14 970,30 1040,36
            C1110,42 1150,26 1220,22
            C1290,16 1360,32 1440,38
            L1440,60
            Z
          "
          fill="white"
        />
        <path
          d="
            M0,60
            C80,52 160,38 240,44
            C300,50 330,60 400,54
            C470,48 510,34 580,38
            C640,44 680,54 750,50
            C820,46 860,36 930,40
            C1000,44 1040,54 1120,50
            C1190,46 1260,38 1320,42
            C1370,46 1410,54 1440,52
            L1440,60
            Z
          "
          fill="white"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

function EyebrowBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#F5C518] text-[#1A2E44] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-3.5 h-3.5 flex-shrink-0"
        aria-hidden="true"
      >
        <path d="M8 0a5.5 5.5 0 0 0-5.5 5.5C2.5 9.5 8 16 8 16s5.5-6.5 5.5-10.5A5.5 5.5 0 0 0 8 0Zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
      </svg>
      {text}
    </span>
  );
}

import { getSiteContent, type AboutPageContent } from "@/lib/data/contentConfig";

interface AboutUsHeroSectionProps {
  content?: AboutPageContent['hero'];
}

export default function AboutUsHeroSection({ content: customContent }: AboutUsHeroSectionProps) {
  const content = customContent || getSiteContent().aboutPage.hero;
  const headingLines = (content.heading || "").split("\n");

  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-br from-[#00AEEF] via-[#17739C] to-[#1A2E44] z-0"
      aria-label="About Us Hero"
    >
      {/* Ambient background glow circle */}
      <div
        aria-hidden="true"
        className="absolute -top-20 -right-20 w-80 h-80 bg-[#FFE67B]/20 rounded-full blur-3xl pointer-events-none z-0"
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="pt-16 pb-24 lg:pt-20 lg:pb-28 text-left max-w-[760px] w-full">
          {/* Eyebrow */}
          <div className="mb-4">
            <EyebrowBadge text={content.badgeText || "About Us"} />
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-white leading-[1.18] tracking-tight mb-5">
            {headingLines.map((line, idx) => (
              <span key={idx}>
                {line}
                {idx < headingLines.length - 1 && <br />}
              </span>
            ))}
          </h1>

          {/* Supporting Text */}
          <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-8 max-w-[640px]">
            {content.subheading}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#2CBAE8] hover:bg-[#17739C] text-white font-bold text-sm transition-all duration-200 shadow-md shadow-[#2CBAE8]/20 hover:shadow-lg hover:shadow-[#2CBAE8]/30 hover:scale-[1.02]"
            >
              {content.ctaText || "Book Your Clean"}
            </Link>
            {content.phone && (
              <a
                href={`tel:${content.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-white/15 border border-white/30 text-white font-semibold text-sm hover:bg-white/25 transition-all duration-200 backdrop-blur-sm"
              >
                <span>Call {content.phone}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Wave Transition */}
      <WaveDivider />
    </section>
  );
}
