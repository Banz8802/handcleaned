'use client';

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
      </svg>
    </div>
  );
}

function EyebrowBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#FFE67B] text-[#1A2E44] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-3.5 h-3.5 flex-shrink-0"
        aria-hidden="true"
      >
        <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
      </svg>
      {text}
    </span>
  );
}

export default function TermsHeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-br from-[#1A2E44] via-[#17739C] to-[#00AEEF] z-0"
      aria-label="Terms of Service Hero"
    >
      {/* Ambient background glow circle */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-96 h-96 bg-[#FFE67B]/15 rounded-full blur-3xl pointer-events-none z-0"
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="pt-16 pb-24 lg:pt-20 lg:pb-28 text-left max-w-[760px] w-full">
          {/* Eyebrow */}
          <div className="mb-4">
            <EyebrowBadge text="Legal & Agreements" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-white leading-[1.18] tracking-tight mb-4">
            Terms of Service
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 max-w-[620px]">
            Welcome to Hand Cleaned. By accessing our website or booking and using our cleaning services, you agree to these Terms of Service.
          </p>

          {/* Effective Date pill */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Effective Date: 2026</span>
          </div>
        </div>
      </div>

      {/* Wave Transition */}
      <WaveDivider />
    </section>
  );
}
