import Link from "next/link";

export default function AboutUsCtaSection() {
  return (
    <section
      className="relative w-full bg-[#F7FBFF] overflow-hidden py-16 lg:py-20"
      aria-label="Closing Call to Action"
    >
      {/* Decorative ambient background blur */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#00AEEF]/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl text-center max-w-[920px] mx-auto">
          
          {/* Eyebrow badge */}
          <span className="inline-block bg-[#EBF6FB] text-[#00AEEF] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6">
            Quality & Care Guaranteed
          </span>

          {/* Central PDF Closing Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A2E44] leading-tight tracking-tight mb-6">
            At Hand Cleaned, <span className="text-[#00AEEF]">you are in good hands.</span>
          </h2>

          <p className="text-gray-600 text-base sm:text-lg max-w-[620px] mx-auto mb-10 leading-relaxed">
            Ready to experience dependable, high-quality cleaning tailored to your space? Book your clean today or get in touch with our friendly team.
          </p>

          {/* Action CTAs matching site buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/booking"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#2CBAE8] text-white font-bold text-sm sm:text-base hover:bg-[#17739C] transition-all duration-200 shadow-lg shadow-[#2CBAE8]/20 hover:shadow-xl hover:scale-[1.02]"
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
              <span>+61 411 289 877</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
