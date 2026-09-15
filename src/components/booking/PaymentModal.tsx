import { useState } from "react";
import type { BookingData } from "@/lib/types/booking";

interface PaymentModalProps {
  bookingData: BookingData;
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({
  bookingData,
  isOpen,
  onClose,
}: PaymentModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyReference = () => {
    navigator.clipboard.writeText(bookingData.bookingReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        {/* Header Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2CBAE8]/10 text-[#2CBAE8] flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Title */}
        <span className="text-[#2CBAE8] text-xs font-bold uppercase tracking-wider block mb-1">
          Booking Request Captured
        </span>
        <h3 className="text-2xl font-bold text-[#1A2E44] mb-2">
          Reservation Prepared & Captured
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-6">
          Your booking information has been captured in a structured format and is ready for payment integration when your preferred gateway is connected.
        </p>

        {/* Booking Reference Box */}
        <div className="bg-[#EBF6FB] rounded-2xl p-4 mb-6 border border-[#2CBAE8]/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">
              Booking Reference Number
            </span>
            <span className="text-lg font-extrabold text-[#1A2E44]">
              {bookingData.bookingReference}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyReference}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-[#1A2E44] hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
          >
            {copied ? "Copied!" : "Copy Ref"}
          </button>
        </div>

        {/* Details Breakdown */}
        <div className="space-y-3 bg-gray-50 rounded-2xl p-5 border border-gray-200 text-xs mb-6">
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500">Customer:</span>
            <span className="font-bold text-[#1A2E44]">
              {bookingData.customer.firstName} {bookingData.customer.lastName} ({bookingData.customer.email})
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500">Service & Package:</span>
            <span className="font-bold text-[#1A2E44]">
              {bookingData.service.name} — {bookingData.package.name}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500">Property:</span>
            <span className="font-bold text-[#1A2E44] max-w-[240px] text-right truncate">
              {bookingData.property.address} ({bookingData.property.bedrooms} Bed, {bookingData.property.bathrooms} Bath)
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500">Cleaners Selected:</span>
            <span className="font-bold text-[#2CBAE8]">
              {bookingData.property.cleanersCount || 1} {(bookingData.property.cleanersCount || 1) === 1 ? "Cleaner" : "Cleaners"}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500">Schedule:</span>
            <span className="font-bold text-[#1A2E44]">
              {bookingData.schedule.date} @ {bookingData.schedule.time}
            </span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-[#1A2E44] font-bold text-sm">Calculated Total:</span>
            <span className="font-extrabold text-[#2CBAE8] text-base">
              ${bookingData.package.price.toFixed(2)} AUD
            </span>
          </div>
        </div>

        {/* Future Integration Note */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs mb-6 flex items-start gap-2.5">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span className="font-bold block mb-0.5">Payment Integration Gateway Status</span>
            <span>This temporary state confirms that all booking fields are validated and formatted for the future payment provider webhook & backend API.</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#1A2E44] text-white font-bold text-sm hover:bg-[#243d58] transition-colors cursor-pointer"
          >
            Close & Finish
          </button>
        </div>
      </div>
    </div>
  );
}
