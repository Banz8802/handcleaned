export default function ResidentialServiceDetailsSection() {
  const FEATURES = [
    {
      icon: (
        <svg className="w-6 h-6 text-[#2CBAE8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Background Checked Staff",
      description: "Every cleaner on our team undergoes rigorous identity verification, police checks, and professional training for your complete peace of mind.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#2CBAE8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: "Eco-Friendly Products",
      description: "We use non-toxic, pet-safe, and eco-friendly cleaning supplies that leave your home smelling fresh without harsh chemical residues.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#2CBAE8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Flexible Team Sizing",
      description: "Easily scale your cleaning team from 1 to 2 cleaners based on your home size, schedule, and speed requirements.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#2CBAE8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Transparent Hourly Billing",
      description: "Clear hourly rates ($60/hr regular, $68/hr deep) with zero hidden fees. Pay only for the exact cleaner hours requested.",
    },
  ];

  return (
    <section className="relative w-full bg-[#EBF6FB] py-20 lg:py-24 overflow-hidden" aria-labelledby="residential-details-heading">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-[#2CBAE8] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
            Home Care Excellence
          </span>
          <h2
            id="residential-details-heading"
            className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A2E44] leading-tight tracking-tight max-w-[650px] mx-auto"
          >
            Why Sydney Families Trust Hand Cleaned
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-[#EBF6FB] flex items-center justify-center mb-5">
                {item.icon}
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
