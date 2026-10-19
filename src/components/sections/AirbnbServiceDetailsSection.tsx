import { getSiteContent } from "@/lib/data/contentConfig";

const FEATURE_ICONS = [
  (
    <svg key="1" className="w-6 h-6 text-[#2CBAE8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  ),
  (
    <svg key="2" className="w-6 h-6 text-[#2CBAE8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  (
    <svg key="3" className="w-6 h-6 text-[#2CBAE8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  (
    <svg key="4" className="w-6 h-6 text-[#2CBAE8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
];

export default function AirbnbServiceDetailsSection() {
  const content = getSiteContent().airbnbPage;

  return (
    <section className="relative w-full bg-[#EBF6FB] py-20 lg:py-24 overflow-hidden" aria-labelledby="service-details-heading">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-[#2CBAE8] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
            Service Excellence
          </span>
          <h2
            id="service-details-heading"
            className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A2E44] leading-tight tracking-tight max-w-[650px] mx-auto"
          >
            {content.featuresTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.features.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-[#EBF6FB] flex items-center justify-center mb-5">
                {FEATURE_ICONS[index % FEATURE_ICONS.length]}
              </div>
              <h3 className="text-lg font-bold text-[#1A2E44] mb-2">{item.title}</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
