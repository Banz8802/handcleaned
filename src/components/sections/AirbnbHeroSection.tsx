'use client';

import Link from "next/link";

function WaveDivider() {
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none"
      style={{ height: "80px" }}
    >
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 min-w-[1440px] w-full h-full"
      >
        <path
          d="
            M0,80
            C60,62 120,30 200,40
            C260,48 290,68 360,58
            C420,50 450,28 520,22
            C590,16 630,38 700,44
            C760,50 800,36 860,28
            C930,18 970,40 1040,48
            C1110,56 1150,34 1220,28
            C1290,22 1360,42 1440,50
            L1440,80
            Z
          "
          fill="white"
        />
        <path
          d="
            M0,80
            C80,70 160,52 240,60
            C300,66 330,80 400,72
            C470,64 510,46 580,52
            C640,58 680,72 750,68
            C820,64 860,50 930,54
            C1000,58 1040,72 1120,68
            C1190,64 1260,52 1320,58
            C1370,62 1410,74 1440,72
            L1440,80
            Z
          "
          fill="white"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#F5C518] text-[#1A2E44] text-xs font-semibold px-3 py-1.5 rounded-full leading-none tracking-wide shadow-sm">
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

import { getSiteContent, type ServicePageContent } from "@/lib/data/contentConfig";

interface AirbnbHeroSectionProps {
  content?: ServicePageContent['hero'];
}

export default function AirbnbHeroSection({ content: customContent }: AirbnbHeroSectionProps) {
  const content = customContent || getSiteContent().airbnbPage.hero;
  const headingLines = (content.heading || "").split("\n");

  return (
    <section
      className="relative w-full overflow-hidden bg-[#00AEEF] z-0"
      aria-label="Airbnb Cleaning Hero"
    >
      {/* Background Video */}
      <video
        className="absolute inset-0 h-full w-full object-cover object-center z-0"
        src="/videos/hero-bg-final.webm"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Brand Overlay preserving existing colors and ensuring readability */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(0, 174, 239, 0.45) 0%, rgba(23, 115, 156, 0.50) 45%, rgba(26, 46, 68, 0.65) 100%)",
        }}
      />

      {/* Decorative ambient light circle */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-96 h-96 bg-[#FFE67B]/20 rounded-full blur-3xl pointer-events-none z-0"
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="pt-20 pb-32 lg:pt-24 lg:pb-36 text-left max-w-[720px] w-full">
          {/* Location Badge */}
          <div className="mb-6">
            <Badge text={content.badgeText || "Sydney & Greater NSW Airbnb Cleaning Specialists"} />
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-white leading-[1.15] tracking-tight mb-6">
            {headingLines.map((line, idx) => (
              <span key={idx}>
                {line}
                {idx < headingLines.length - 1 && <br />}
              </span>
            ))}
          </h1>

          {/* Description */}
          <p className="text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed mb-10 max-w-[600px]">
            {content.subheading}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={content.cta1Link || "#pricing"}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#2CBAE8] hover:bg-[#17739C] text-white font-bold text-sm transition-all duration-200 shadow-md shadow-[#2CBAE8]/20 hover:shadow-lg hover:shadow-[#2CBAE8]/30 hover:scale-[1.02]"
            >
              {content.cta1Text || "Explore 4 Pricing Options"}
            </a>
            <Link
              href={content.cta2Link || "/booking"}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-white/15 border border-white/30 text-white font-semibold text-sm hover:bg-white/25 transition-all duration-200 backdrop-blur-sm"
            >
              {content.cta2Text || "Reserve Directly"}
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Wave Divider */}
      <WaveDivider />
    </section>
  );
}
