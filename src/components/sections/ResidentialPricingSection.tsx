'use client';

import { useState } from "react";
import { DEFAULT_RESIDENTIAL_PACKAGES } from "@/lib/data/residentialPricing";

interface ResidentialPricingSectionProps {
  onSelectOption?: (optionName: string, calculatedHourlyRate: number, cleanersCount: number) => void;
}

export default function ResidentialPricingSection({ onSelectOption }: ResidentialPricingSectionProps) {
  const [numCleaners, setNumCleaners] = useState<number>(1);

  const handleReserve = (packageName: string, ratePerCleaner: number) => {
    const totalRate = numCleaners * ratePerCleaner;
    if (onSelectOption) {
      onSelectOption(packageName, totalRate, numCleaners);
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
      aria-labelledby="residential-pricing-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-[#2CBAE8] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
            Transparent Residential Rates
          </span>
          <h2
            id="residential-pricing-heading"
            className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A2E44] leading-tight tracking-tight max-w-[700px] mx-auto mb-4"
          >
            Residential Cleaning Options
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-[620px] mx-auto leading-relaxed">
            Select the number of cleaners you require below to automatically calculate total hourly rates for Regular and Deep Home Cleaning.
          </p>
        </div>

        {/* ── Cleaner Count Selection Control ────────────────────────────── */}
        <div className="bg-[#EBF6FB] rounded-2xl p-6 sm:p-8 mb-14 border border-[#2CBAE8]/20 shadow-sm max-w-[760px] mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <label htmlFor="cleaner-count-select" className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1A2E44]">
              Select Number of Cleaners Required:
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
            Currently selected: <span className="font-extrabold text-[#1A2E44]">{numCleaners} {numCleaners === 1 ? 'Cleaner' : 'Cleaners'}</span>
          </p>
        </div>

        {/* ── 2 Main Residential Pricing Cards ────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[960px] mx-auto items-stretch">
          {DEFAULT_RESIDENTIAL_PACKAGES.map((pkg) => {
            const calculatedTotalRate = numCleaners * pkg.ratePerCleanerPerHour;

            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-3xl p-7 sm:p-9 transition-all duration-300 ${
                  pkg.isPopular
                    ? "bg-[#1A2E44] text-white shadow-2xl ring-2 ring-[#FFE67B] scale-[1.01]"
                    : "bg-white text-[#1A2E44] shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                {/* Badge */}
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span
                      className={`text-xs font-extrabold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm ${
                        pkg.isPopular
                          ? "bg-[#FFE67B] text-[#1A2E44]"
                          : "bg-[#2CBAE8] text-white"
                      }`}
                    >
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Card Title & Description */}
                  <div className="pt-2 mb-6 text-center">
                    <h3 className={`text-2xl font-bold tracking-tight mb-2 ${pkg.isPopular ? "text-white" : "text-[#1A2E44]"}`}>
                      {pkg.name}
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${pkg.isPopular ? "text-white/80" : "text-gray-500"}`}>
                      {pkg.shortDescription}
                    </p>
                  </div>

                  {/* Price Calculation Box */}
                  <div className={`py-5 px-4 rounded-2xl text-center mb-7 ${pkg.isPopular ? "bg-white/10" : "bg-[#EBF6FB]"}`}>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-base font-bold opacity-80">$</span>
                      <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                        {calculatedTotalRate}
                      </span>
                      <span className="text-sm font-semibold opacity-80">/ hour</span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-black/10 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-semibold">
                      <span className={pkg.isPopular ? "text-[#FFE67B]" : "text-[#2CBAE8]"}>
                        {numCleaners} {numCleaners === 1 ? "cleaner" : "cleaners"} × ${pkg.ratePerCleanerPerHour}/hr
                      </span>
                      <span className="opacity-40 hidden sm:inline">•</span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-xs ${
                          pkg.isPopular
                            ? "bg-[#FFE67B] text-[#1A2E44]"
                            : "bg-[#2CBAE8] text-white"
                        }`}
                      >
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Minimum of {pkg.minHours || 2} Hours
                      </span>
                    </div>
                  </div>

                  {/* Inclusions List */}
                  <div className="space-y-3.5 mb-8">
                    <span className={`block text-xs font-bold uppercase tracking-wider ${pkg.isPopular ? "text-white/60" : "text-gray-400"}`}>
                      Included Services:
                    </span>
                    {pkg.inclusions.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold ${
                            pkg.isPopular
                              ? "bg-[#FFE67B] text-[#1A2E44]"
                              : "bg-[#2CBAE8]/15 text-[#2CBAE8]"
                          }`}
                        >
                          ✓
                        </span>
                        <span className={`text-xs sm:text-sm leading-snug ${pkg.isPopular ? "text-white/90" : "text-gray-600"}`}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reserve Now Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => handleReserve(pkg.name, pkg.ratePerCleanerPerHour)}
                    className={`w-full py-3.5 px-6 rounded-full font-bold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 ${
                      pkg.isPopular
                        ? "bg-[#FFE67B] text-[#1A2E44] hover:bg-[#FFDE59] shadow-[#FFE67B]/20"
                        : "bg-[#2CBAE8] text-white hover:bg-[#17739C] shadow-[#2CBAE8]/20"
                    }`}
                  >
                    <span>Reserve {pkg.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
