export default function TrustStripSection() {
  return (
    <section
      className="relative w-full bg-[#1A2E44] overflow-hidden py-8 sm:py-10 border-y border-white/10"
      aria-label="Trust Guarantees"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[160px] bg-[#2CBAE8]/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
          
          {/* Badge 1: 100% Satisfaction Guaranteed */}
          <div className="flex items-center gap-3.5 bg-white/5 hover:bg-white/10 px-6 py-3.5 rounded-full border border-white/10 transition-all duration-200 shadow-sm hover:scale-[1.02]">
            <div className="w-10 h-10 rounded-full bg-[#FFE67B]/20 border border-[#FFE67B]/40 text-[#FFE67B] flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
            <span className="font-semibold text-white text-sm sm:text-base tracking-wide">
              100% Satisfaction Guaranteed
            </span>
          </div>

          {/* Badge 2: Eco Friendly Cleaning Solutions */}
          <div className="flex items-center gap-3.5 bg-white/5 hover:bg-white/10 px-6 py-3.5 rounded-full border border-white/10 transition-all duration-200 shadow-sm hover:scale-[1.02]">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M17 8C8 10 5.83 16.17 3.83 21.34c-1.56 1.56-1.56 4.09 0 5.66 1.56 1.56 4.09 1.56 5.66 0C14.66 21.83 20.83 17 22 8c0 0-3.5 0-5 0zm-7.83 10.17c-1.17 1.17-3.07 1.17-4.24 0-1.17-1.17-1.17-3.07 0-4.24 1.17-1.17 3.07-1.17 4.24 0 1.17 1.17 1.17 3.07 0 4.24z" />
              </svg>
            </div>
            <span className="font-semibold text-white text-sm sm:text-base tracking-wide">
              Eco Friendly Cleaning Solutions
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
