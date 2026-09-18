import type { CustomerDetails } from "@/lib/types/booking";

interface Step5CustomerDetailsProps {
  customer: CustomerDetails;
  onChange: (customer: CustomerDetails) => void;
  paymentMethod: 'stripe' | 'manual';
  onPaymentMethodChange: (method: 'stripe' | 'manual') => void;
  onSubmit: () => void;
  onBack: () => void;
  errors?: Record<string, string>;
  isSubmitting?: boolean;
}

export default function Step5CustomerDetails({
  customer,
  onChange,
  paymentMethod,
  onPaymentMethodChange,
  onSubmit,
  onBack,
  errors = {},
  isSubmitting = false,
}: Step5CustomerDetailsProps) {
  const handleFieldChange = (field: keyof CustomerDetails, value: string) => {
    onChange({
      ...customer,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
      <div className="mb-6">
        <span className="text-[#2CBAE8] text-xs font-bold uppercase tracking-wider block mb-1">
          Step 5 of 5
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2E44]">
          Customer Information & Payment
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Enter your contact information and select your preferred payment method.
        </p>
      </div>

      {errors.submit && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 font-medium">
          {errors.submit}
        </div>
      )}

      <div className="space-y-5 mb-8">
        {/* Name Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-xs font-bold uppercase tracking-wider text-[#1A2E44] mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              value={customer.firstName}
              onChange={(e) => handleFieldChange("firstName", e.target.value)}
              placeholder="Sarah"
              className={`w-full bg-[#EBF6FB]/40 text-[#1A2E44] placeholder-gray-400 text-sm px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                errors.firstName
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#2CBAE8] focus:ring-[#2CBAE8]/20"
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-xs font-bold uppercase tracking-wider text-[#1A2E44] mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              value={customer.lastName}
              onChange={(e) => handleFieldChange("lastName", e.target.value)}
              placeholder="Jenkins"
              className={`w-full bg-[#EBF6FB]/40 text-[#1A2E44] placeholder-gray-400 text-sm px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                errors.lastName
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#2CBAE8] focus:ring-[#2CBAE8]/20"
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Contact Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#1A2E44] mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={customer.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              placeholder="sarah@example.com"
              className={`w-full bg-[#EBF6FB]/40 text-[#1A2E44] placeholder-gray-400 text-sm px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#2CBAE8] focus:ring-[#2CBAE8]/20"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-[#1A2E44] mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={customer.phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              placeholder="0411 289 877"
              className={`w-full bg-[#EBF6FB]/40 text-[#1A2E44] placeholder-gray-400 text-sm px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                errors.phone
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#2CBAE8] focus:ring-[#2CBAE8]/20"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Special Instructions / Notes */}
        <div>
          <label htmlFor="specialInstructions" className="block text-xs font-bold uppercase tracking-wider text-[#1A2E44] mb-2">
            Special Instructions <span className="text-gray-400 font-normal lowercase">(optional)</span>
          </label>
          <textarea
            id="specialInstructions"
            rows={2}
            value={customer.specialInstructions || ""}
            onChange={(e) => handleFieldChange("specialInstructions", e.target.value)}
            placeholder="Any specific instructions for our cleaning team e.g., delicate surface care, pet on site..."
            className="w-full bg-[#EBF6FB]/40 text-[#1A2E44] placeholder-gray-400 text-sm px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2CBAE8] focus:ring-2 focus:ring-[#2CBAE8]/20 transition-all resize-none"
          />
        </div>

        {/* Payment Method Selector */}
        <div className="pt-4 border-t border-gray-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1A2E44] mb-3">
            Select Payment Method <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stripe Card Option */}
            <div
              onClick={() => onPaymentMethodChange('stripe')}
              className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'stripe'
                  ? 'border-[#2CBAE8] bg-[#EBF6FB]/60 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                checked={paymentMethod === 'stripe'}
                onChange={() => onPaymentMethodChange('stripe')}
                className="mt-1 accent-[#2CBAE8]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#1A2E44]">Credit / Debit Card</span>
                  <span className="text-[10px] bg-[#2CBAE8]/15 text-[#17739C] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Instant
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Secure Checkout via Stripe (Sandbox Test Mode). Instant booking confirmation.
                </p>
              </div>
            </div>

            {/* Manual Payment Fallback Option */}
            <div
              onClick={() => onPaymentMethodChange('manual')}
              className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'manual'
                  ? 'border-[#2CBAE8] bg-[#EBF6FB]/60 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="manual"
                checked={paymentMethod === 'manual'}
                onChange={() => onPaymentMethodChange('manual')}
                className="mt-1 accent-[#2CBAE8]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#1A2E44]">Pay Later / Manual Invoice</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Fallback
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Receive an invoice via email and pay manually via bank transfer or on arrival.
                </p>
              </div>
            </div>
          </div>
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
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2CBAE8] text-white font-bold text-base hover:bg-[#17739C] transition-all duration-200 shadow-md shadow-[#2CBAE8]/20 hover:shadow-lg hover:shadow-[#2CBAE8]/30 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Processing...</span>
          ) : (
            <>
              <span>{paymentMethod === 'stripe' ? 'Proceed to Stripe Checkout' : 'Complete Booking Request'}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

