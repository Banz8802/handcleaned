import { DEFAULT_PRICING_MATRIX as MATRIX_DATA } from "@/lib/data/airbnbPricing";

export default function AirbnbAddonsSection() {

  return (
    <section className="relative w-full bg-white py-20 lg:py-24 overflow-hidden" aria-labelledby="pricing-matrix-heading">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-[#2CBAE8] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
            Detailed Rate Breakdown
          </span>
          <h2
            id="pricing-matrix-heading"
            className="text-3xl sm:text-4xl font-bold text-[#1A2E44] leading-tight tracking-tight max-w-[650px] mx-auto mb-4"
          >
            Complete Airbnb Pricing & Storey Schedule
          </h2>
          <p className="text-gray-600 text-sm max-w-[600px] mx-auto">
            Full transparency across all property sizes and storey configurations. No hidden fees or surprise charges.
          </p>
        </div>

        {/* Pricing Matrix Table */}
        <div className="bg-[#EBF6FB]/50 rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#1A2E44] text-white text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Property Type</th>
                  <th className="py-4 px-6 font-semibold">Departure Clean</th>
                  <th className="py-4 px-6 font-semibold">Midstay (Linen)</th>
                  <th className="py-4 px-6 font-semibold">Midstay Only</th>
                  <th className="py-4 px-6 font-semibold">Initial / Deep</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs sm:text-sm text-[#1A2E44]">
                {MATRIX_DATA.filter((row) => !row.type.startsWith("5 Bed")).map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#EBF6FB]/30"}>
                    <td className="py-3.5 px-6 font-bold text-[#1A2E44]">{row.type}</td>
                    <td className="py-3.5 px-6 font-medium">{row.departure}</td>
                    <td className="py-3.5 px-6 font-medium">{row.midstayLinen}</td>
                    <td className="py-3.5 px-6 font-medium">{row.midstayOnly}</td>
                    <td className="py-3.5 px-6 font-bold text-[#2CBAE8]">{row.deep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GST & Policy Notice */}
        <div className="bg-[#EBF6FB] border border-[#2CBAE8]/30 rounded-xl p-4 mb-6 max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-[#1A2E44]">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#2CBAE8] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              ✓
            </span>
            <span className="font-bold">All prices are inclusive of GST.</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-600 text-xs sm:text-sm">
            <span>
              Deep Clean includes up to 2 bedrooms (<strong className="text-[#1A2E44]">+$10/extra bed</strong>).
            </span>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span>
              Extra bathrooms exceeding contract: <strong className="text-[#1A2E44]">+$25/full bath</strong>, <strong className="text-[#1A2E44]">+$15/half bath</strong>.
            </span>
          </div>
        </div>

        {/* Additional Storey & Room Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto">
          <div className="bg-[#EBF6FB] rounded-2xl p-6 border border-[#2CBAE8]/20">
            <h3 className="text-base font-bold text-[#1A2E44] mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2CBAE8] text-white flex items-center justify-center text-xs font-bold">
                i
              </span>
              Standard Turnover Storeys
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              Applies to Departure Clean & Midstay Clean packages:
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-[#1A2E44] font-medium">
              <li className="flex justify-between border-b border-gray-200/60 pb-1">
                <span>Two-Storey Properties:</span>
                <span className="font-bold text-[#2CBAE8]">+$21.00</span>
              </li>
              <li className="flex justify-between pt-1">
                <span>Three-Storey Properties:</span>
                <span className="font-bold text-[#2CBAE8]">+$42.00</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#EBF6FB] rounded-2xl p-6 border border-[#2CBAE8]/20">
            <h3 className="text-base font-bold text-[#1A2E44] mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FFE67B] text-[#1A2E44] flex items-center justify-center text-xs font-bold">
                !
              </span>
              Initial / Deep Clean Storeys
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              Applies to Initial / Deep Cleaning package:
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-[#1A2E44] font-medium">
              <li className="flex justify-between border-b border-gray-200/60 pb-1">
                <span>Two-Storey Properties:</span>
                <span className="font-bold text-[#2CBAE8]">+$31.50</span>
              </li>
              <li className="flex justify-between pt-1">
                <span>Three-Storey Properties:</span>
                <span className="font-bold text-[#2CBAE8]">+$63.00</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#EBF6FB] rounded-2xl p-6 border border-[#2CBAE8]/20">
            <h3 className="text-base font-bold text-[#1A2E44] mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1A2E44] text-[#FFE67B] flex items-center justify-center text-xs font-bold">
                +
              </span>
              Extra Bedroom Policy
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              Applies to Initial / Deep Cleaning package:
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-[#1A2E44] font-medium">
              <li className="flex justify-between border-b border-gray-200/60 pb-1">
                <span>Included Base:</span>
                <span className="font-bold text-[#1A2E44]">Up to 2 Bedrooms</span>
              </li>
              <li className="flex justify-between pt-1">
                <span>Each Extra Bedroom:</span>
                <span className="font-bold text-[#2CBAE8]">+$10.00</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#EBF6FB] rounded-2xl p-6 border border-[#2CBAE8]/20">
            <h3 className="text-base font-bold text-[#1A2E44] mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2CBAE8] text-white flex items-center justify-center text-xs font-bold">
                +
              </span>
              Extra Bathroom Policy
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              When bathrooms exceed the contracted allowance:
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-[#1A2E44] font-medium">
              <li className="flex justify-between border-b border-gray-200/60 pb-1">
                <span>Contract Base:</span>
                <span className="font-bold text-[#1A2E44]">1 to 2 Baths</span>
              </li>
              <li className="flex justify-between border-b border-gray-200/60 pb-1">
                <span>Extra Full Bathroom:</span>
                <span className="font-bold text-[#2CBAE8]">+$25.00</span>
              </li>
              <li className="flex justify-between pt-1">
                <span>Extra Half Bathroom:</span>
                <span className="font-bold text-[#2CBAE8]">+$15.00</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
