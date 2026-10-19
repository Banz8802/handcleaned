import type { BookingPackage, PropertyType, StoreyType } from "@/lib/types/booking";
import { calculatePackagePrice } from "@/lib/data/bookingData";

interface Step2PackageSelectionProps {
  packages: BookingPackage[];
  selectedPackageId: string;
  mappedPropertyType: PropertyType;
  storey: StoreyType;
  bathrooms?: string;
  onSelectPackage: (pkg: BookingPackage) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2PackageSelection({
  packages,
  selectedPackageId,
  mappedPropertyType,
  storey,
  bathrooms,
  onSelectPackage,
  onNext,
  onBack,
}: Step2PackageSelectionProps) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
      <div className="mb-6">
        <span className="text-[#2CBAE8] text-xs font-bold uppercase tracking-wider block mb-1">
          Step 2 of 5
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2E44]">
          Choose Cleaning Package
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Select one of our 4 specialized Airbnb turnover packages. Prices dynamically adjust to your property size.
        </p>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {packages.map((pkg) => {
          const isSelected = selectedPackageId === pkg.id;
          const calculatedPrice = calculatePackagePrice(pkg, mappedPropertyType, storey, 1, bathrooms);

          return (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg)}
              className={`relative rounded-2xl p-6 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-[#2CBAE8] bg-[#EBF6FB]/70 ring-2 ring-[#2CBAE8]/30 shadow-lg scale-[1.01]"
                  : "border-gray-200 bg-white hover:border-[#2CBAE8]/60 hover:shadow-md"
              }`}
            >
              {/* Top Badge & Popular indicator */}
              <div className="flex items-center justify-between gap-2 mb-3">
                {pkg.badge ? (
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      pkg.isPopular
                        ? "bg-[#2CBAE8] text-white shadow-xs"
                        : "bg-[#1A2E44]/10 text-[#1A2E44]"
                    }`}
                  >
                    {pkg.badge}
                  </span>
                ) : (
                  <span />
                )}

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? "bg-[#2CBAE8] border-[#2CBAE8] text-white shadow-xs"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isSelected && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Package Header & Price */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-[#1A2E44] mb-1">
                  {pkg.name}
                </h3>
                <p className="text-xs text-gray-500 min-h-[36px] leading-relaxed">
                  {pkg.shortDescription}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#1A2E44]">
                    ${calculatedPrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">
                    AUD / turnover
                  </span>
                </div>
              </div>

              {/* Feature Inclusions Checklist */}
              <div className="pt-4 border-t border-gray-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A2E44] block mb-2.5">
                  What&apos;s Included:
                </span>
                <ul className="space-y-2 text-xs text-gray-700 mb-4">
                  {pkg.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-[#2CBAE8] flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer Button state */}
              <div className="mt-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPackage(pkg);
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    isSelected
                      ? "bg-[#2CBAE8] text-white shadow-sm"
                      : "bg-gray-100 text-[#1A2E44] hover:bg-gray-200"
                  }`}
                >
                  {isSelected ? "Package Selected" : "Select Package"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 text-[#1A2E44] font-bold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#2CBAE8] text-white font-bold text-sm hover:bg-[#17739C] transition-all duration-200 shadow-md shadow-[#2CBAE8]/20 hover:shadow-lg hover:shadow-[#2CBAE8]/30 cursor-pointer"
        >
          <span>Continue to Property Details</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
