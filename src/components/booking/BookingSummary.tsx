import { useState } from "react";
import type {
  BookingService,
  BookingPackage,
  PropertyDetails,
  ScheduleDetails,
  CustomerDetails,
} from "@/lib/types/booking";
import type { PricingRatesConfig } from "@/lib/data/pricingConfig";
import { calculateExtraBathroomFee } from "@/lib/data/bookingData";

interface BookingSummaryProps {
  service: BookingService;
  selectedPackage: BookingPackage;
  calculatedPrice: number;
  property: PropertyDetails;
  schedule: ScheduleDetails;
  customer: CustomerDetails;
  currentStep: number;
  pricingRates?: PricingRatesConfig;
}

export default function BookingSummary({
  service,
  selectedPackage,
  calculatedPrice,
  property,
  schedule,
  customer,
  currentStep,
  pricingRates,
}: BookingSummaryProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const extraBathroomFee = calculateExtraBathroomFee(property.bedrooms, property.bathrooms, pricingRates);
  const basePackagePrice = Math.max(0, calculatedPrice - extraBathroomFee);

  return (
    <aside className="w-full">
      {/* Mobile Sticky / Toggle Bar */}
      <div className="lg:hidden mb-6 bg-[#1A2E44] text-white rounded-2xl p-4 shadow-lg border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#2CBAE8] uppercase tracking-wider font-bold block">
              Booking Total
            </span>
            <span className="text-2xl font-extrabold text-white">
              ${calculatedPrice.toFixed(2)} <span className="text-xs font-normal text-gray-300">AUD</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMobileExpanded((prev) => !prev)}
            className="px-4 py-2 rounded-xl bg-[#2CBAE8] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>{mobileExpanded ? "Hide Details" : "View Summary"}</span>
            <svg
              className={`w-4 h-4 transition-transform ${mobileExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {mobileExpanded && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-3 text-xs text-gray-300 animate-in fade-in duration-150">
            <div className="flex justify-between">
              <span className="text-gray-400">Service:</span>
              <span className="font-bold text-white">{service.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Package:</span>
              <span className="font-bold text-white">{selectedPackage.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Address:</span>
              <span className="font-bold text-white text-right max-w-[180px] truncate">
                {property.address || "Not specified yet"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Configuration:</span>
              <span className="font-bold text-white">
                {property.bedrooms === "Studio" ? "Studio" : `${property.bedrooms} Bed`},{" "}
                {property.bathrooms} Bath ({property.storey})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Schedule:</span>
              <span className="font-bold text-white">
                {schedule.date ? schedule.date : "Date pending"} {schedule.time ? `(${schedule.time})` : ""}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Card (Sticky) */}
      <div className="hidden lg:block bg-[#1A2E44] text-white rounded-2xl p-7 shadow-xl border border-white/10 sticky top-28">
        <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
          <h3 className="text-xl font-bold text-white tracking-tight">
            Booking Summary
          </h3>
          <span className="text-xs font-semibold bg-[#2CBAE8]/20 text-[#2CBAE8] border border-[#2CBAE8]/30 px-3 py-1 rounded-full">
            Step {currentStep} of 5
          </span>
        </div>

        {/* Selected Service */}
        <div className="mb-5 pb-5 border-b border-white/10">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
            Service
          </span>
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-base">{service.name}</span>
            <span className="text-xs text-[#2CBAE8] font-semibold bg-[#2CBAE8]/10 px-2.5 py-0.5 rounded-full">
              Selected
            </span>
          </div>
        </div>

        {/* Selected Package */}
        <div className="mb-5 pb-5 border-b border-white/10">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
            Package Tier
          </span>
          <div className="flex items-start justify-between">
            <div>
              <span className="font-bold text-white text-base block">{selectedPackage.name}</span>
              <span className="text-xs text-gray-400 block mt-0.5 max-w-[200px] line-clamp-2">
                {selectedPackage.shortDescription}
              </span>
            </div>
          </div>
        </div>

        {/* Property Specs */}
        <div className="mb-5 pb-5 border-b border-white/10">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block mb-1.5">
            Property Specifications
          </span>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Address:</span>
              <span className="font-semibold text-white text-right max-w-[180px] truncate">
                {property.address || "Pending input"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bedrooms:</span>
              <span className="font-semibold text-white">
                {property.bedrooms === "Studio" ? "Studio" : `${property.bedrooms} Bedroom(s)`}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-400">Bathrooms:</span>
              <div className="text-right">
                <span className="font-semibold text-white">{property.bathrooms} Bathroom(s)</span>
                {extraBathroomFee > 0 && (
                  <span className="block text-[10px] text-[#FFE67B] font-semibold">
                    (+${extraBathroomFee.toFixed(2)} extra bath fee)
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Storey:</span>
              <span className="font-semibold text-white">{property.storey}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Cleaners:</span>
              <span className="font-semibold text-[#2CBAE8]">
                {property.cleanersCount || 1} {(property.cleanersCount || 1) === 1 ? "Cleaner" : "Cleaners"}
              </span>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="mb-5 pb-5 border-b border-white/10">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block mb-1.5">
            Cleaning Date & Time
          </span>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Date:</span>
              <span className="font-semibold text-white">{schedule.date || "Not selected"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Time Slot:</span>
              <span className="font-semibold text-[#2CBAE8]">{schedule.time || "Not selected"}</span>
            </div>
          </div>
        </div>

        {/* Customer Contact Preview */}
        {(customer.firstName || customer.email) && (
          <div className="mb-5 pb-5 border-b border-white/10">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block mb-1.5">
              Customer Info
            </span>
            <div className="space-y-1 text-xs">
              {customer.firstName && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="font-semibold text-white">{customer.firstName} {customer.lastName}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="font-semibold text-white max-w-[160px] truncate">{customer.email}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="bg-[#243d58] rounded-xl p-4 mb-6 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-300">
            <span>Base Package:</span>
            <span className="font-semibold text-white">${basePackagePrice.toFixed(2)}</span>
          </div>

          {extraBathroomFee > 0 && (
            <div className="flex justify-between items-center text-xs text-[#FFE67B]">
              <span>Extra Bathroom Fee:</span>
              <span className="font-bold">+${extraBathroomFee.toFixed(2)}</span>
            </div>
          )}

          <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
            <span className="text-xs text-gray-200 font-semibold">Total Price:</span>
            <span className="text-2xl font-extrabold text-[#2CBAE8]">
              ${calculatedPrice.toFixed(2)}
            </span>
          </div>
          <span className="text-[11px] text-gray-400 block">
            Includes GST & turnover cleaning supplies
          </span>
        </div>

        {/* Trust Note */}
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <svg className="w-4 h-4 text-[#2CBAE8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Payment details collected on next step. Zero hidden fees.</span>
        </div>
      </div>
    </aside>
  );
}
