function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-block text-[#00AEEF] text-xs font-semibold uppercase tracking-[0.15em] mb-3">
      {text}
    </span>
  );
}

const COMMITMENTS = [
  {
    number: "01",
    title: "High-Quality & Consistent Results",
    description: "Deliver high-quality and consistent cleaning services every single visit.",
    icon: (
      <svg className="w-5 h-5 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Dependable & Professional Service",
    description: "Provide dependable and professional customer service you can rely on.",
    icon: (
      <svg className="w-5 h-5 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Care & Respect for Every Property",
    description: "Treat every property with care, dignity, and the thorough respect it deserves.",
    icon: (
      <svg className="w-5 h-5 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Meticulous Attention to Detail",
    description: "Pay attention to the fine details that make a genuine difference in cleanliness.",
    icon: (
      <svg className="w-5 h-5 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Lasting Relationships Built on Trust",
    description: "Build lasting relationships with our customers through trust and complete satisfaction.",
    icon: (
      <svg className="w-5 h-5 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export default function AboutUsCommitmentSection() {
  return (
    <section
      className="relative w-full bg-white overflow-hidden py-16 lg:py-24"
      aria-labelledby="commitment-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-[720px] mx-auto mb-12 sm:mb-16">
          <SectionLabel text="Core Values" />
          
          <h2
            id="commitment-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A2E44] leading-tight tracking-tight mb-4"
          >
            Our Commitment
          </h2>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            At Hand Cleaned, we believe that quality service begins with reliability and attention to detail.
          </p>
        </div>

        {/* 5 Commitment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {COMMITMENTS.map((item) => (
            <div
              key={item.number}
              className="bg-[#F7FBFF] border border-gray-100 p-7 rounded-3xl flex flex-col justify-between hover:border-[#2CBAE8]/40 hover:shadow-lg transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="w-10 h-10 rounded-2xl bg-[#EBF6FB] flex items-center justify-center flex-shrink-0 group-hover:bg-[#00AEEF]/10 transition-colors">
                    {item.icon}
                  </span>
                  <span className="text-2xl font-extrabold text-gray-300 group-hover:text-[#00AEEF] transition-colors">
                    {item.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#1A2E44] mb-2">
                  {item.title}
                </h3>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed mt-2">
                {item.description}
              </p>
            </div>
          ))}

          {/* 6th Card: Summary Accent Box */}
          <div className="bg-gradient-to-br from-[#1A2E44] to-[#0F1E2E] p-7 rounded-3xl flex flex-col justify-center text-white shadow-md relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute -bottom-10 -right-10 w-36 h-36 bg-[#00AEEF]/20 rounded-full blur-2xl pointer-events-none"
            />
            <span className="text-[#FFE67B] font-bold text-xs uppercase tracking-widest mb-2">
              The Hand Cleaned Standard
            </span>
            <p className="text-white/90 text-sm leading-relaxed">
              Every clean we perform is guided by these five core commitments to ensure complete satisfaction.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
