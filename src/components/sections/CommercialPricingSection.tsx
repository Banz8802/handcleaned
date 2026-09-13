'use client';

import { useState } from "react";
import { DEFAULT_COMMERCIAL_PACKAGE } from "@/lib/data/commercialPricing";

interface CommercialPricingSectionProps {
  onSelectOption?: (optionName: string, calculatedHourlyRate: number, cleanersCount: number) => void;
}

export default function CommercialPricingSection({ onSelectOption }: CommercialPricingSectionProps) {
  const [numCleaners, setNumCleaners] = useState<number>(2);

  const calculatedTotalRate = numCleaners * DEFAULT_COMMERCIAL_PACKAGE.ratePerCleanerPerHour;

  const handleReserve = () => {
    if (onSelectOption) {
      onSelectOption(DEFAULT_COMMERCIAL_PACKAGE.name, calculatedTotalRate, numCleaners);
    }
    const targetSection = document.getElementById("contact") || document.getElementById("services");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#contact";
    }
  };

  return (
    <section
      id="pricing"
      className="relative w-full bg-white py-20 lg:py-28 overflow-hidden"
      aria-labelledby="commercial-pricing-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-[#2CBAE8] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
            Transparent Commercial Rates
          </span>
          <h2
            id="commercial-pricing-heading"
            className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A2E44] leading-tight tracking-tight max-w-[700px] mx-auto mb-4"
          >
            Commercial & Office Cleaning Pricing
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-[620px] mx-auto leading-relaxed">
            Select the number of commercial cleaners required for your facility to calculate exact hourly rates.
          </p>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-2">
            * All prices are exclusive of GST
          </p>
        </div>

        {/* ── Cleaner Count Selection Control ────────────────────────────── */}
        <div className="bg-[#EBF6FB] rounded-2xl p-6 sm:p-8 mb-12 border border-[#2CBAE8]/20 shadow-sm max-w-[760px] mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <label htmlFor="cleaner-count-select" className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1A2E44]">
              Select Number of Commercial Cleaners:
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setNumCleaners(count)}
                  className={`w-11 h-11 rounded-xl font-extrabold text-sm transition-all duration-200 shadow-xs ${
                    numCleaners === count
                      ? "bg-[#2CBAE8] text-white shadow-md shadow-[#2CBAE8]/20 scale-105"
                      : "bg-white text-[#1A2E44] hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
          <p className="text-center sm:text-right text-xs text-[#2CBAE8] font-semibold mt-3">
            Selected Team: <span className="font-extrabold text-[#1A2E44]">{numCleaners} {numCleaners === 1 ? 'Cleaner' : 'Cleaners'}</span>
          </p>
        </div>

        {/* ── Main Commercial Pricing Card ────────────────────────────── */}
        <div className="max-w-[720px] mx-auto">
          <div className="relative flex flex-col justify-between rounded-3xl p-8 sm:p-10 bg-[#1A2E44] text-white shadow-2xl ring-2 ring-[#FFE67B]">
            {/* Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs font-extrabold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm bg-[#FFE67B] text-[#1A2E44]">
                Sydney Business Standard
              </span>
            </div>

            <div>
              {/* Card Title & Description */}
              <div className="pt-2 mb-6 text-center">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-white">
                  {DEFAULT_COMMERCIAL_PACKAGE.name}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-white/80 max-w-[540px] mx-auto">
                  {DEFAULT_COMMERCIAL_PACKAGE.shortDescription}
                </p>
              </div>

              {/* Price Calculation Box */}
              <div className="py-6 px-4 rounded-2xl text-center mb-8 bg-white/10">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-lg font-bold opacity-80">$</span>
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                    {calculatedTotalRate}
                  </span>
                  <span className="text-sm font-semibold opacity-80">/ hour</span>
                </div>

                <div className="mt-2 pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-semibold">
                  <span className="text-[#FFE67B]">
                    {numCleaners} {numCleaners === 1 ? "cleaner" : "cleaners"} × ${DEFAULT_COMMERCIAL_PACKAGE.ratePerCleanerPerHour}/hr
                  </span>
                  <span className="text-white/50 hidden sm:inline">•</span>
                  <span className="text-white/70">Exclusive of GST</span>
                </div>
              </div>

              {/* Inclusions List */}
              <div className="space-y-3.5 mb-8">
                <span className="block text-xs font-bold uppercase tracking-wider text-white/60">
                  Included Commercial Services:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DEFAULT_COMMERCIAL_PACKAGE.inclusions.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold bg-[#FFE67B] text-[#1A2E44]">
                        ✓
                      </span>
                      <span className="text-xs leading-snug text-white/90">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reserve Now Button */}
            <div>
              <button
                type="button"
                onClick={handleReserve}
                className="w-full py-4 px-6 rounded-full font-bold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 bg-[#FFE67B] text-[#1A2E44] hover:bg-[#FFDE59] shadow-[#FFE67B]/20"
              >
                <span>Book Commercial Service</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
