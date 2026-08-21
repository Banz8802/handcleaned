import Link from "next/link";
import Image from "next/image";

// ---------------------------------------------------------------------------
// ImageCollage — the distinctive 2x2 collage layout with rounded corners
// and a central blue diamond overlapping all four quadrants.
// ---------------------------------------------------------------------------
function ImageCollage() {
  return (
    <div className="relative flex-shrink-0 w-full max-w-[500px] aspect-[580/556] overflow-hidden rounded-3xl mx-auto lg:mx-0">
      <Image
        src="/images/about-img.png"
        alt="About Hand Cleaned"
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 500px"
        priority
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section label — small teal uppercase label used above each heading
// ---------------------------------------------------------------------------
function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-block text-[#00AEEF] text-xs font-semibold uppercase tracking-[0.15em] mb-3">
      {text}
    </span>
  );
}

// ---------------------------------------------------------------------------
// AboutSection — main export
// ---------------------------------------------------------------------------
export default function AboutSection() {
  return (
    <section
      className="relative w-full bg-white overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* ── Section-level floating bubbles (right side per mockup) ─── */}
      <div aria-hidden="true" className="absolute top-16 right-8 w-16 h-16 rounded-full border border-pink-200 opacity-30 pointer-events-none" />
      <div aria-hidden="true" className="absolute top-8  right-20 w-8  h-8  rounded-full bg-pink-100 opacity-20 pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-16 right-4  w-10 h-10 rounded-full border border-sky-200 opacity-25 pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-8  right-24 w-5  h-5  rounded-full bg-sky-100 opacity-30 pointer-events-none" />

      {/* ── Inner container ──────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16 xl:gap-20">

          {/* ── Left: image collage ──────────────────────────────────── */}
          <ImageCollage />

          {/* ── Right: text content ──────────────────────────────────── */}
          <div className="flex-1 flex flex-col justify-center text-center lg:text-left min-w-0 lg:pt-8">

            <SectionLabel text="About Us" />

            <h2
              id="about-heading"
              className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A2E44] leading-tight tracking-tight mb-5"
            >
              House Cleaning
            </h2>

            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-[480px] mx-auto lg:mx-0">
              Our service is designed to maintain your home in a consistently
              clean, hygienic, and welcoming condition. Whether you choose a
              weekly, fortnightly, or custom schedule, our professional team
              ensures every visit leaves your space refreshed and immaculate —
              just the way you like it. This service is perfect for busy
              households, professionals, families, or anyone who values a tidy
              and organized living environment without the stress of cleaning it
              themselves.
            </p>

            <div className="flex justify-center lg:justify-start">
              <Link
                href="#services"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-md border-2 border-[#00AEEF] text-[#00AEEF] font-semibold text-sm hover:bg-[#00AEEF] hover:text-white transition-colors"
              >
                Read more
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M1 8a.5.5 0 0 1 .5-.5h11.793L10.146 4.354a.5.5 0 1 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}