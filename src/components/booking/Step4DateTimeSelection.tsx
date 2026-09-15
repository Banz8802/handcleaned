import type { ScheduleDetails } from "@/lib/types/booking";
import { TIME_SLOTS } from "@/lib/data/bookingData";

interface Step4DateTimeSelectionProps {
  schedule: ScheduleDetails;
  onChange: (schedule: ScheduleDetails) => void;
  onNext: () => void;
  onBack: () => void;
  errors?: Record<string, string>;
}

export default function Step4DateTimeSelection({
  schedule,
  onChange,
  onNext,
  onBack,
  errors = {},
}: Step4DateTimeSelectionProps) {
  // Compute minimum date string YYYY-MM-DD for today
  const today = new Date().toISOString().split("T")[0];

  const handleDateChange = (date: string) => {
    onChange({
      ...schedule,
      date,
    });
  };

  const handleTimeChange = (time: string) => {
    onChange({
      ...schedule,
      time,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
      <div className="mb-6">
        <span className="text-[#2CBAE8] text-xs font-bold uppercase tracking-wider block mb-1">
          Step 4 of 5
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2E44]">
          Select Date & Time
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Choose your preferred cleaning date and arrival window.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Date Selection */}
        <div>
          <label htmlFor="booking-date" className="block text-xs font-bold uppercase tracking-wider text-[#1A2E44] mb-2">
            Cleaning Date <span className="text-red-500">*</span>
          </label>
          <div className="relative max-w-md">
            <input
              id="booking-date"
              type="date"
              min={today}
              value={schedule.date}
              onChange={(e) => handleDateChange(e.target.value)}
              className={`w-full bg-[#EBF6FB]/40 text-[#1A2E44] text-sm px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                errors.date
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#2CBAE8] focus:ring-[#2CBAE8]/20"
              }`}
            />
          </div>
          {errors.date && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.date}</p>
          )}
        </div>

        {/* Time Slot Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1A2E44] mb-2">
            Preferred Arrival Window <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TIME_SLOTS.map((slot) => {
              const isSelected = schedule.time === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => handleTimeChange(slot)}
                  className={`py-3.5 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-[#2CBAE8] text-white border-[#2CBAE8] shadow-sm ring-2 ring-[#2CBAE8]/20"
                      : "bg-[#EBF6FB]/30 text-[#1A2E44] border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{slot}</span>
                  </div>
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          {errors.time && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.time}</p>
          )}
        </div>

        {/* Availability Note */}
        <div className="p-4 rounded-xl bg-[#EBF6FB]/60 border border-[#2CBAE8]/20 text-xs text-gray-600 flex items-start gap-3">
          <svg className="w-5 h-5 text-[#2CBAE8] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span className="font-bold text-[#1A2E44] block mb-0.5">Flexible Scheduling</span>
            <span>Arrival windows allow our cleaning team to accommodate Sydney traffic and guest checkout timing. Need a custom time? Specify in the notes on the next step.</span>
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
          onClick={onNext}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#2CBAE8] text-white font-bold text-sm hover:bg-[#17739C] transition-all duration-200 shadow-md shadow-[#2CBAE8]/20 hover:shadow-lg hover:shadow-[#2CBAE8]/30 cursor-pointer"
        >
          <span>Continue to Customer Details</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
