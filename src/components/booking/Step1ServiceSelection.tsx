import type { BookingService } from "@/lib/types/booking";

interface Step1ServiceSelectionProps {
  services: BookingService[];
  selectedServiceId: string;
  onSelectService: (service: BookingService) => void;
  onNext: () => void;
}

export default function Step1ServiceSelection({
  services,
  selectedServiceId,
  onSelectService,
  onNext,
}: Step1ServiceSelectionProps) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
      <div className="mb-6">
        <span className="text-[#2CBAE8] text-xs font-bold uppercase tracking-wider block mb-1">
          Step 1 of 5
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2E44]">
          Select Cleaning Service
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Choose the service type that fits your property needs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {services.map((service) => {
          const isSelected = selectedServiceId === service.id;

          return (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className={`relative rounded-2xl p-6 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-[#2CBAE8] bg-[#EBF6FB]/60 ring-2 ring-[#2CBAE8]/20 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs"
              }`}
            >
              {/* Top Row: Icon + Badge */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                    isSelected ? "bg-[#2CBAE8] text-white" : "bg-[#1A2E44]/5 text-[#1A2E44]"
                  }`}
                >
                  {service.iconName === "home" && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  )}
                  {service.iconName === "sparkles" && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  )}
                  {service.iconName === "building" && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V9a1 1 0 011-1h2a1 1 0 011 1v12" />
                    </svg>
                  )}
                  {service.iconName === "towel" && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                </div>

                {service.badge && (
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      isSelected
                        ? "bg-[#2CBAE8] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {service.badge}
                  </span>
                )}
              </div>

              {/* Service Info */}
              <div>
                <h3 className="text-lg font-bold text-[#1A2E44] mb-1">
                  {service.name}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {service.shortDescription}
                </p>
              </div>

              {/* Selection Indicator */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className={`text-xs font-semibold ${isSelected ? "text-[#2CBAE8]" : "text-gray-400"}`}>
                  {isSelected ? "Selected Service" : "Click to select"}
                </span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                    isSelected
                      ? "bg-[#2CBAE8] border-[#2CBAE8] text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isSelected && (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#2CBAE8] text-white font-bold text-sm hover:bg-[#17739C] transition-all duration-200 shadow-md shadow-[#2CBAE8]/20 hover:shadow-lg hover:shadow-[#2CBAE8]/30 cursor-pointer"
        >
          <span>Continue to Packages</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
