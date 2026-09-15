import BubbleDecoration from "@/components/ui/BubbleDecoration";

export default function BookingHero() {
  return (
    <section className="relative w-full bg-[#1A2E44] text-white py-16 lg:py-20 overflow-hidden">
      {/* Background Ambient Bubbles */}
      <BubbleDecoration
        imageIndex={1}
        animationIndex={1}
        size={140}
        className="top-4 left-6 opacity-20"
      />
      <BubbleDecoration
        imageIndex={2}
        animationIndex={2}
        size={180}
        className="bottom-4 right-10 opacity-20"
      />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-2 bg-[#2CBAE8]/20 border border-[#2CBAE8]/40 text-[#2CBAE8] text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-4">
          <span className="w-2 h-2 rounded-full bg-[#2CBAE8] animate-pulse" />
          Instant Online Booking
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-[800px] mx-auto mb-4">
          Book Your Cleaning Service in Minutes
        </h1>

        <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-[640px] mx-auto leading-relaxed">
          Select your package, customize property details, pick a schedule, and lock in professional 5-star cleaning for your property.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-gray-300">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#2CBAE8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>No Hidden Costs</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#2CBAE8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>Trusted Sydney Cleaners</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#2CBAE8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>Instant Confirmation</span>
          </div>
        </div>
      </div>
    </section>
  );
}
