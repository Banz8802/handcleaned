import type { PropertyDetails, StoreyType } from "@/lib/types/booking";
import { BEDROOM_OPTIONS, BATHROOM_OPTIONS, STOREY_OPTIONS } from "@/lib/data/bookingData";

interface Step3PropertyDetailsProps {
  property: PropertyDetails;
  onChange: (property: PropertyDetails) => void;
  onNext: () => void;
  onBack: () => void;
  errors?: Record<string, string>;
}

export default function Step3PropertyDetails({
  property,
  onChange,
  onNext,
  onBack,
  errors = {},
}: Step3PropertyDetailsProps) {
  const handleFieldChange = (field: keyof PropertyDetails, value: string) => {
    onChange({
      ...property,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
      <div className="mb-6">
        <span className="text-[#2CBAE8] text-xs font-bold uppercase tracking-wider block mb-1">
          Step 3 of 5
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2E44]">
          Property Details
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Provide your property location, room count, and access details.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Property Address */}
        <div>
          <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-[#1A2E44] mb-2">
            Property Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="address"
              type="text"
              value={property.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              placeholder="e.g. 123 George St, Sydney NSW 2000"
              className={`w-full bg-[#EBF6FB]/40 text-[#1A2E44] placeholder-gray-400 text-sm px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                errors.address
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#2CBAE8] focus:ring-[#2CBAE8]/20"
              }`}
            />
          </div>
          {errors.address && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.address}</p>
          )}
        </div>

        {/* Bedroom Selection Pills */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1A2E44] mb-2">
            Number of Bedrooms <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {BEDROOM_OPTIONS.map((opt) => {
              const isSelected = property.bedrooms === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleFieldChange("bedrooms", opt.value)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
                    isSelected
                      ? "bg-[#2CBAE8] text-white border-[#2CBAE8] shadow-sm ring-2 ring-[#2CBAE8]/20"
                      : "bg-[#EBF6FB]/30 text-[#1A2E44] border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bathroom Selection Pills */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1A2E44] mb-2">
            Number of Bathrooms <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {BATHROOM_OPTIONS.map((bath) => {
              const isSelected = property.bathrooms === bath;
              return (
                <button
                  key={bath}
                  type="button"
                  onClick={() => handleFieldChange("bathrooms", bath)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
                    isSelected
                      ? "bg-[#2CBAE8] text-white border-[#2CBAE8] shadow-sm ring-2 ring-[#2CBAE8]/20"
                      : "bg-[#EBF6FB]/30 text-[#1A2E44] border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {bath} {bath === "1" ? "Bath" : "Baths"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Storey Configuration */}
        <div>
          <label htmlFor="storey" className="block text-xs font-bold uppercase tracking-wider text-[#1A2E44] mb-2">
            Storey Configuration
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {STOREY_OPTIONS.map((st) => {
              const isSelected = property.storey === st.value;
              return (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => handleFieldChange("storey", st.value as StoreyType)}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
                    isSelected
                      ? "bg-[#1A2E44] text-white border-[#1A2E44] shadow-sm"
                      : "bg-[#EBF6FB]/30 text-[#1A2E44] border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Number of Cleaners Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1A2E44] mb-2">
            Number of Cleaners Requested
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {[1, 2, 3, 4, 5].map((count) => {
              const isSelected = (property.cleanersCount || 1) === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => onChange({ ...property, cleanersCount: count })}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
                    isSelected
                      ? "bg-[#2CBAE8] text-white border-[#2CBAE8] shadow-sm ring-2 ring-[#2CBAE8]/20"
                      : "bg-[#EBF6FB]/30 text-[#1A2E44] border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {count} {count === 1 ? "Cleaner" : "Cleaners"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Property / Lockbox / Access Notes */}
        <div>
          <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-[#1A2E44] mb-2">
            Property Notes & Access Instructions <span className="text-gray-400 font-normal lowercase">(optional)</span>
          </label>
          <textarea
            id="notes"
            rows={3}
            value={property.notes || ""}
            onChange={(e) => handleFieldChange("notes", e.target.value)}
            placeholder="Key lockbox location, parking info, alarm codes, or specific cleaning requests..."
            className="w-full bg-[#EBF6FB]/40 text-[#1A2E44] placeholder-gray-400 text-sm px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2CBAE8] focus:ring-2 focus:ring-[#2CBAE8]/20 transition-all resize-none"
          />
        </div>
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
          <span>Continue to Schedule</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
