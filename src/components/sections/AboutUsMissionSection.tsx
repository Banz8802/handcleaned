function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-block text-[#FFE67B] text-xs font-semibold uppercase tracking-[0.15em] mb-3">
      {text}
    </span>
  );
}

export default function AboutUsMissionSection() {
  return (
    <section
      className="relative w-full bg-[#1A2E44] overflow-hidden py-16 lg:py-24"
      aria-labelledby="mission-heading"
    >
      {/* Decorative ambient background glows */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00AEEF]/10 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFE67B]/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="max-w-[860px] mx-auto text-center">
          
          {/* Eyebrow Label */}
          <SectionLabel text="Our Purpose" />

          {/* Heading */}
          <h2
            id="mission-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight mb-8"
          >
            Our Mission
          </h2>

          {/* Mission Quote Card */}
          <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 backdrop-blur-md shadow-2xl">
            {/* Quote Icon */}
            <div className="w-12 h-12 rounded-full bg-[#00AEEF]/20 text-[#2CBAE8] flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            {/* Exact PDF Mission Statement */}
            <blockquote className="text-white/95 text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed tracking-tight">
              &ldquo;Our mission is to provide dependable cleaning solutions that help our customers maintain clean, comfortable, and welcoming spaces—while making the entire experience simple, convenient, and stress-free.&rdquo;
            </blockquote>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-[#2CBAE8] text-sm font-semibold tracking-wide">
              <span>Hand Cleaned Promise</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
