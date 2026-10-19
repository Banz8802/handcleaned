'use client';

import { useState, useEffect } from "react";
import { DEFAULT_CLEANER_RATES } from "@/lib/data/residentialPricing";
import { getPricingRates, setPricingRates, type PricingRatesConfig } from "@/lib/data/pricingConfig";

export default function ResidentialAddonsSection() {
  const [pricingRates, setPricingRatesState] = useState<PricingRatesConfig>(() => getPricingRates());

  useEffect(() => {
    fetch('/api/pricing-rates')
      .then((res) => res.json())
      .then((data: PricingRatesConfig | null) => {
        if (data) {
          setPricingRates(data);
          setPricingRatesState(data);
        }
      })
      .catch((err) => console.warn('Could not fetch active pricing rates for residential addons section:', err));
  }, []);

  const regRate = pricingRates.hourlyRates?.regularCleaningPerHour ?? 60;
  const deepRate = pricingRates.hourlyRates?.deepCleaningPerHour ?? 68;

  return (
    <section className="relative w-full bg-white py-20 lg:py-24 overflow-hidden" aria-labelledby="residential-matrix-heading">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-[#2CBAE8] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
            Rate Breakdown
          </span>
          <h2
            id="residential-matrix-heading"
            className="text-3xl sm:text-4xl font-bold text-[#1A2E44] leading-tight tracking-tight max-w-[650px] mx-auto mb-4"
          >
            Residential Cleaning Rate Schedule
          </h2>
          <p className="text-gray-600 text-sm max-w-[600px] mx-auto">
            Full transparent breakdown of hourly team rates per cleaner.
          </p>
        </div>

        {/* Rate Schedule Table */}
        <div className="bg-[#EBF6FB]/50 rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-12 max-w-[800px] mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-[#1A2E44] text-white text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Number of Cleaners</th>
                  <th className="py-4 px-6 font-semibold">Regular Cleaning Rate</th>
                  <th className="py-4 px-6 font-semibold">Deep Cleaning Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs sm:text-sm text-[#1A2E44]">
                {DEFAULT_CLEANER_RATES.map((row) => {
                  const calculatedRegular = regRate * row.cleaners;
                  const calculatedDeep = deepRate * row.cleaners;

                  return (
                    <tr key={row.cleaners} className={row.cleaners % 2 === 1 ? "bg-white" : "bg-[#EBF6FB]/30"}>
                      <td className="py-3.5 px-6 font-bold text-[#1A2E44]">
                        {row.cleaners} {row.cleaners === 1 ? "Cleaner" : "Cleaners"}
                      </td>
                      <td className="py-3.5 px-6 font-medium text-[#1A2E44]">
                        ${calculatedRegular} / hour
                        <span className="text-xs text-gray-400 block sm:inline sm:ml-2">
                          (${regRate}/hr × {row.cleaners})
                        </span>
                      </td>
                      <td className="py-3.5 px-6 font-bold text-[#2CBAE8]">
                        ${calculatedDeep} / hour
                        <span className="text-xs text-gray-400 font-normal block sm:inline sm:ml-2">
                          (${deepRate}/hr × {row.cleaners})
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Informational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
          <div className="bg-[#EBF6FB] rounded-2xl p-6 border border-[#2CBAE8]/20">
            <h3 className="text-base font-bold text-[#1A2E44] mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2CBAE8] text-white flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              Regular Cleaning (${regRate}/hr per cleaner)
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              Ideal for weekly or fortnightly maintenance cleans. Covers general dusting, floor vacuuming, mopping, bathroom sanitization, and kitchen tidy up.
            </p>
          </div>

          <div className="bg-[#EBF6FB] rounded-2xl p-6 border border-[#2CBAE8]/20">
            <h3 className="text-base font-bold text-[#1A2E44] mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FFE67B] text-[#1A2E44] flex items-center justify-center text-xs font-bold">
                !
              </span>
              Deep Cleaning (${deepRate}/hr per cleaner)
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              Recommended for initial cleans or deep resets. Focuses on built-up soap scum, detailed tile scrubbing, oven/rangehood detailing, and skirting board wipes.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
