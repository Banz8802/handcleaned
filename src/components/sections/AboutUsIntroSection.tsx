import Image from "next/image";
import { getSiteContent, type AboutPageContent } from "@/lib/data/contentConfig";

function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-block text-[#00AEEF] text-xs font-semibold uppercase tracking-[0.15em] mb-3">
      {text}
    </span>
  );
}

const PILLAR_ICONS = [
  (
    <svg key="1" className="w-5 h-5 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  (
    <svg key="2" className="w-5 h-5 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  (
    <svg key="3" className="w-5 h-5 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
];

interface AboutUsIntroSectionProps {
  content?: AboutPageContent['intro'];
}

export default function AboutUsIntroSection({ content: customContent }: AboutUsIntroSectionProps) {
  const content = customContent || getSiteContent().aboutPage.intro;

  return (
    <section
      className="relative w-full bg-white overflow-hidden py-16 lg:py-24"
      aria-labelledby="about-intro-heading"
    >
      {/* Decorative background ambient blur */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 -left-32 -translate-y-1/2 w-80 h-80 bg-[#EBF6FB] rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <SectionLabel text={content.badgeText || "About Hand Cleaned"} />

            <h2
              id="about-intro-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A2E44] leading-tight tracking-tight mb-6"
            >
              {content.heading}
            </h2>

            <div className="space-y-4 text-gray-600 text-base leading-relaxed mb-8">
              <p>{content.paragraph1}</p>
              <p>{content.paragraph2}</p>
            </div>

            {/* 3 Pillar Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {(content.pillars || []).map((pillar, idx) => (
                <div
                  key={pillar.title || idx}
                  className="bg-[#F7FBFF] border border-[#EBF6FB] p-4 rounded-2xl flex flex-col gap-2 hover:border-[#2CBAE8]/30 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#EBF6FB] flex items-center justify-center flex-shrink-0">
                    {PILLAR_ICONS[idx % PILLAR_ICONS.length]}
                  </div>
                  <h3 className="text-[#1A2E44] font-bold text-sm">
                    {pillar.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-normal">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-gray-100 group">
              <Image
                src={content.imageUrl || "/images/cleaners.webp"}
                alt="Hand Cleaned Professional Cleaning Team"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 480px"
                priority
              />

              {/* Floating accent badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFE67B] text-[#1A2E44] flex items-center justify-center font-bold text-base flex-shrink-0 shadow-sm">
                  ✓
                </div>
                <div>
                  <p className="text-[#1A2E44] font-bold text-xs uppercase tracking-wider">
                    {content.badgeTitle || "Dedicated Professionals"}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {content.badgeSubtitle || "Treating every property with the care it deserves"}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
