'use client';

import { useRouter } from "next/navigation";
import { DEFAULT_LINEN_HIRE_PACKAGES } from "@/lib/data/commercialPricing";

export default function LinenHireSection() {
  const router = useRouter();
  const handleHireSelect = (packageName?: string) => {
    let pkgId = "";
    if (packageName) {
      if (packageName.toLowerCase().includes("king")) pkgId = "king-linen";
      else if (packageName.toLowerCase().includes("queen")) pkgId = "king-linen";
      else if (packageName.toLowerCase().includes("single")) pkgId = "single-linen";
      else if (packageName.toLowerCase().includes("pool")) pkgId = "pool-towel";
    }
    const params = new URLSearchParams({
      service: "linen-hire",
      ...(pkgId ? { package: pkgId } : {}),
    });
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <section id="linen-hire" className="relative w-full bg-[#EBF6FB] py-20 lg:py-24 overflow-hidden" aria-labelledby="linen-hire-heading">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-[#2CBAE8] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
            Hotel Quality Supply
          </span>
          <h2
            id="linen-hire-heading"
            className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A2E44] leading-tight tracking-tight max-w-[650px] mx-auto mb-3"
          >
            Airbnb Linen Hire Services
          </h2>
          <p className="text-gray-600 text-sm max-w-[600px] mx-auto">
            Fresh, crisp, premium hotel-grade linen kit packs delivered directly for your Airbnb & short-stay rentals.
          </p>
          <p className="text-xs font-bold text-[#2CBAE8] uppercase tracking-wider mt-2">
            * All prices are inclusive of GST
          </p>
        </div>

        {/* 7-Day Rental & Late Fee Notice Banner */}
        <div className="bg-white/80 border border-[#2CBAE8]/30 rounded-2xl p-4 sm:p-5 mb-10 max-w-[960px] mx-auto flex items-start sm:items-center gap-3.5 shadow-xs">
          <span className="w-8 h-8 rounded-full bg-[#2CBAE8] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 sm:mt-0">
            i
          </span>
          <div className="text-xs sm:text-sm text-[#1A2E44] leading-relaxed">
            <strong className="font-bold">Rental Policy:</strong> Linen rental period is <strong>7 days</strong>. All rented items are required to be returned within this period. A daily late fee will be applied for any items not returned after the 7-day rental period until they are received.
          </div>
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
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2CBAE8] bg-[#EBF6FB] px-2.5 py-1 rounded-full inline-block mb-2">
                    {pkg.rentalPeriod || "7-day rental"}
                  </span>
                  <h3 className="text-xl font-bold text-[#1A2E44] mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-sm font-semibold text-gray-500">$</span>
                    <span className="text-4xl font-extrabold text-[#1A2E44]">{pkg.price.toFixed(2)}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#2CBAE8] uppercase tracking-wide block mt-1">
                    {pkg.gstNote}
                  </span>
                  {pkg.dailyLateFee !== undefined && (
                    <span className="text-[11px] font-medium text-red-500 block mt-1.5">
                      Daily Late Fee: ${pkg.dailyLateFee.toFixed(2)}
                    </span>
                  )}
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
