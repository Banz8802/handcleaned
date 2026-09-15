import type { CustomerDetails } from "@/lib/types/booking";

interface Step5CustomerDetailsProps {
  customer: CustomerDetails;
  onChange: (customer: CustomerDetails) => void;
  onSubmit: () => void;
  onBack: () => void;
  errors?: Record<string, string>;
  isSubmitting?: boolean;
}

export default function Step5CustomerDetails({
  customer,
  onChange,
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
          Customer Information
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Enter your contact information to complete your cleaning reservation request.
        </p>
      </div>

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
            rows={3}
            value={customer.specialInstructions || ""}
            onChange={(e) => handleFieldChange("specialInstructions", e.target.value)}
            placeholder="Any specific instructions for our cleaning team e.g., delicate surface care, pet on site..."
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
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2CBAE8] text-white font-bold text-base hover:bg-[#17739C] transition-all duration-200 shadow-md shadow-[#2CBAE8]/20 hover:shadow-lg hover:shadow-[#2CBAE8]/30 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Processing...</span>
          ) : (
            <>
              <span>Reserve Now / Continue</span>
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
