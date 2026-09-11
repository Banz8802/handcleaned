import Link from "next/link";

interface CtaBannerSectionProps {
  title?: string;
  accentTitle?: string;
  badges?: string[];
  ariaLabel?: string;
}

function getBadgeIcon(text: string) {
  if (text.includes("Background")) {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#2CBAE8]" aria-hidden="true">
        <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2A11.954 11.954 0 0110 1.944zm4.707 6.349a1 1 0 00-1.414-1.414L9 11.172 6.707 8.879a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l6-6z" clipRule="evenodd" />
      </svg>
    );
  }
  if (text.includes("Eco")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true">
        <path d="M17 8C8 10 5.83 16.17 3.83 21.34c-1.56 1.56-1.56 4.09 0 5.66 1.56 1.56 4.09 1.56 5.66 0C14.66 21.83 20.83 17 22 8c0 0-3.5 0-5 0zm-7.83 10.17c-1.17 1.17-3.07 1.17-4.24 0-1.17-1.17-1.17-3.07 0-4.24 1.17-1.17 3.07-1.17 4.24 0 1.17 1.17 1.17 3.07 0 4.24z" />
      </svg>
    );
  }
  if (text.includes("Zero") || text.includes("Fee")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-[#2CBAE8]" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M15 9l-6 6" />
      </svg>
    );
  }
  if (text.includes("Sydney") || text.includes("Australia")) {
    return (
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-[#2CBAE8]" aria-hidden="true">
        <path d="M8 0a5.5 5.5 0 0 0-5.5 5.5C2.5 9.5 8 16 8 16s5.5-6.5 5.5-10.5A5.5 5.5 0 0 0 8 0Zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
      </svg>
    );
  }
  return (
    <span className="text-[#2CBAE8] font-bold text-xs">✓</span>
  );
}

const DEFAULT_GUARANTEES = [
  "Background Checked",
  "Eco-Friendly Products",
  "Zero Hidden Fees",
  "Sydney, New South Wales, and Australia",
];

export default function CtaBannerSection({
  title = "Ready for a Spotless Home or Airbnb?",
  accentTitle = "Book in under 60 seconds.",
  badges = DEFAULT_GUARANTEES,
  ariaLabel = "Quick Booking CTA",
}: CtaBannerSectionProps) {
  return (
    <section
      className="relative w-full bg-[#1A2E44] overflow-hidden py-14 sm:py-16"
      aria-label={ariaLabel}
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#2CBAE8]/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          
          {/* Main Headline */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight mb-8 max-w-[800px]">
            {title}{" "}
            {accentTitle && (
              <span className="text-[#2CBAE8] font-extrabold">{accentTitle}</span>
            )}
          </h2>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10 w-full sm:w-auto">
            <Link
              href="#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#2CBAE8] text-white font-semibold text-sm sm:text-base hover:bg-[#17739C] transition-all duration-200 shadow-lg shadow-[#2CBAE8]/20 hover:shadow-xl hover:scale-[1.02]"
            >
              <span>Book Your Clean Now</span>
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M1 8a.5.5 0 0 1 .5-.5h11.793L10.146 4.354a.5.5 0 1 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
              </svg>
            </Link>

            <a
              href="tel:+61411289877"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#FFE67B] hover:bg-[#FFDE59] text-[#1A2E44] font-bold text-sm sm:text-base pl-2.5 pr-6 py-2 rounded-full transition-all duration-200 shadow-md hover:scale-[1.02]"
            >
              <span className="w-8 h-8 rounded-full bg-[#E5A000] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.429 5.43l.774-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </span>
              <span>Call Us: +61 411 289 877</span>
            </a>
          </div>

          {/* Guarantees Badges Strip */}
          {badges && badges.length > 0 && (
            <div className="w-full pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 sm:gap-x-12">
              {badges.map((item, index) => {
                const isEco = item.includes("Eco");
                return (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2.5 text-white/90 text-xs sm:text-sm font-medium tracking-wide"
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                        isEco
                          ? "bg-emerald-500/20 border border-emerald-400/40"
                          : "bg-[#2CBAE8]/20 border border-[#2CBAE8]/40"
                      }`}
                    >
                      {getBadgeIcon(item)}
                    </span>
                    <span>{item}</span>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
