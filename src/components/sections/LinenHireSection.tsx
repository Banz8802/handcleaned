'use client';

import { DEFAULT_LINEN_HIRE_PACKAGES } from "@/lib/data/commercialPricing";

export default function LinenHireSection() {
  const handleHireSelect = (packageName: string) => {
    const targetSection = document.getElementById("contact") || document.getElementById("services");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#contact";
    }
  };

  return (
    <section id="linen-hire" className="relative w-full bg-[#EBF6FB] py-20 lg:py-24 overflow-hidden" aria-labelledby="linen-hire-heading">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-[#2CBAE8] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
            Hotel Quality Supply
          </span>
          <h2
            id="linen-hire-heading"
            className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A2E44] leading-tight tracking-tight max-w-[650px] mx-auto mb-3"
          >
            Linen Hire Services
          </h2>
          <p className="text-gray-600 text-sm max-w-[600px] mx-auto">
            Fresh, crisp, premium hotel-grade linen packages delivered directly for your commercial properties & rentals.
          </p>
          <p className="text-xs font-bold text-[#2CBAE8] uppercase tracking-wider mt-2">
            * All prices are exclusive of GST
          </p>
        </div>

        {/* 3 Linen Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {DEFAULT_LINEN_HIRE_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl p-7 shadow-lg border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* Header */}
                <div className="text-center mb-5 pb-4 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-[#1A2E44] mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-sm font-semibold text-gray-500">$</span>
                    <span className="text-4xl font-extrabold text-[#1A2E44]">{pkg.price}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#2CBAE8] uppercase tracking-wide block mt-1">
                    {pkg.gstNote}
                  </span>
                </div>

                {/* Itemized Inclusions */}
                <div className="space-y-2.5 mb-8">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Set Inclusions:
                  </span>
                  {pkg.inclusions.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-gray-50">
                      <span className="text-gray-600 font-medium">{item.item}</span>
                      <span className="font-extrabold text-[#1A2E44] bg-[#EBF6FB] px-2 py-0.5 rounded-md text-[11px]">
                        × {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleHireSelect(pkg.name)}
                className="w-full py-3 px-4 rounded-full font-bold text-xs bg-[#2CBAE8] text-white hover:bg-[#17739C] transition-colors shadow-md shadow-[#2CBAE8]/20 flex items-center justify-center gap-2"
              >
                <span>Hire {pkg.name}</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
