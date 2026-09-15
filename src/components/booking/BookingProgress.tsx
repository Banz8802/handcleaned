interface BookingProgressProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

const STEPS = [
  { number: 1, title: "Service", subtitle: "Choose type" },
  { number: 2, title: "Package", subtitle: "Select tier" },
  { number: 3, title: "Property", subtitle: "Size & details" },
  { number: 4, title: "Schedule", subtitle: "Date & time" },
  { number: 5, title: "Details", subtitle: "Contact info" },
];

export default function BookingProgress({
  currentStep,
  completedSteps,
  onStepClick,
}: BookingProgressProps) {
  return (
    <div className="w-full bg-white border-b border-gray-100 py-6 px-4 sm:px-6 shadow-xs sticky top-[72px] z-40">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between relative">
          
          {/* Connector Line behind numbers */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0 hidden sm:block" />

          {STEPS.map((step) => {
            const isCurrent = currentStep === step.number;
            const isCompleted = completedSteps.includes(step.number);
            const isClickable = isCompleted || step.number <= currentStep;

            return (
              <div
                key={step.number}
                className="relative z-10 flex flex-col items-center group"
              >
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(step.number)}
                  disabled={!isClickable}
                  className={`flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer ${
                    isCurrent
                      ? "bg-[#2CBAE8] text-white ring-4 ring-[#2CBAE8]/20 shadow-md shadow-[#2CBAE8]/30 scale-105"
                      : isCompleted
                      ? "bg-[#1A2E44] text-white hover:bg-[#2CBAE8]"
                      : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                  }`}
                  aria-label={`Step ${step.number}: ${step.title}`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </button>

                <div className="mt-2 text-center">
                  <span
                    className={`block text-xs font-bold transition-colors ${
                      isCurrent
                        ? "text-[#2CBAE8]"
                        : isCompleted
                        ? "text-[#1A2E44]"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="hidden md:block text-[11px] text-gray-400 font-normal">
                    {step.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
