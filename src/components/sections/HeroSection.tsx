'use client';

import { useEffect, useRef } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Bottom wave divider — organic foam/cloud shape that sits at the very bottom
// of the hero and transitions into the white section below.
// REPLACE: swap the <svg> for a real wave asset if one is provided later.
// The outer wrapper (relative, full-width, overflow-hidden) must stay.
// ---------------------------------------------------------------------------
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
        className="absolute bottom-0 w-full h-full"
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
        {/* Second layer for depth — gives the foamy/bubbly cloud appearance */}
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

// ---------------------------------------------------------------------------
// Badge — yellow pill label shown above the main heading in the mockup
// ---------------------------------------------------------------------------
function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#F5C518] text-[#1A2E44] text-xs font-semibold px-3 py-1.5 rounded-full leading-none tracking-wide">
      {/* Location pin icon */}
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-3.5 h-3 flex-shrink-0"
        aria-hidden="true"
      >
        <path d="M8 0a5.5 5.5 0 0 0-5.5 5.5C2.5 9.5 8 16 8 16s5.5-6.5 5.5-10.5A5.5 5.5 0 0 0 8 0Zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
      </svg>
      {text}
    </span>
  );
}

// ---------------------------------------------------------------------------
// HeroSection — main export
// ---------------------------------------------------------------------------
export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Autoplay was prevented:", err);
      });
    }
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden bg-[#00AEEF] z-0"
      aria-label="Hero"
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        src="/images/hero-vid.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/about-img.png"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Overlay to ensure text readability */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(135deg, rgba(0, 174, 239, 0.4) 0%, rgba(26, 46, 68, 0.6) 100%)",
        }}
      />

      {/* ── Main content container ─────────────────────────────────────── */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="pt-24 pb-36 text-left max-w-[640px] w-full">

          {/* Badge */}
          <div className="mb-6">
            <Badge text="We Provide, Sydney New South Wales, and Australia" />
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-white leading-[1.15] tracking-tight mb-6">
            Home Cleaning
            <br />
            Services and Airbnb
          </h1>

          {/* Supporting paragraph */}
          <p className="text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed mb-10 max-w-[480px]">
            We bring the best in your space with expert cleaning that reflects
            our highest standards.
          </p>

          {/* CTA button */}
          <Link
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-[#1A2E44] text-white font-semibold text-sm tracking-widest uppercase hover:bg-[#243d58] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* ── Bottom wave divider ────────────────────────────────────────── */}
      <WaveDivider />
    </section>
  );
}
